import { check, validationResult } from "express-validator";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import User from "../../../models/user";
import { newUserEmail } from "../../../mail/newUserEmail";
import { setLoginSession } from "../../../lib/auth";

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("data.changeEmail").toBoolean(),
      check("data.changePW").toBoolean(),
      // username must be an email
      check("data.email")
        .isEmail()
        .withMessage("O email não está no formato correto")
        .normalizeEmail({ gmail_remove_dots: false }),
      check("data.full_name")
        .not()
        .isEmpty()
        .withMessage("O nome completo não foi informado")
        .trim()
        .escape(),
      check("data.nickname")
        .not()
        .isEmpty()
        .withMessage("O apelido não foi informado")
        .trim()
        .escape(),
      // password must be at least 5 chars long
      check("data.pw")
        // check pw length only if new user or when changing it
        .custom((value, { req }) => {
          var pw = value.toString();
          console.log(
            pw,
            "id=",
            req.body.data.id,
            req.body.data.changePW,
            "value",
            typeof pw
          );
          if (
            pw.length < 4 &&
            (req.body.data.id === "" ||
              (req.body.data.id !== "" && req.body.data.changePW))
          ) {
            throw new Error("A senha precisa ter no mínimo 4 caracteres");
          }
          return true;
        }),
      //.withMessage('A senha precisa ter no mínimo 4 caracteres'),
      check("data.accept").toBoolean(),
      check("data.agreement")
        .toBoolean()
        .custom((value, { req }) => {
          if (!value) {
            throw new Error("Voce precisa aceitar o Acordo de Usuários");
          }
          return true;
        }),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
  await validateBody(req, res);

  const errors = validationResult(req);
  console.log("/api/user/save  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }

  // save user
  var id = req.body.data?.id;
  const user = new User(
    id,
    req.body.data.full_name,
    req.body.data.nickname,
    req.body.data.email,
    req.body.data.pw,
    req.body.data.accept
  );
  // data.changeEmail = req.body.data.changeEmail
  // data.changePW=req.body.data.changePW

  console.log("x------------", req.body.data, user);

  // check if the email is already in db -- not if user exists and is not changing email
  if ((id && req.body.data.changeEmail) || !id) {
    const existingUser = await user.getByEmail(req.body.data.email);
    console.log("existingUser", existingUser, "error" in existingUser);
    if ("error" in existingUser === false) {
      var error = {
        param: "inputEmail",
        msg: "O email informado já está registrado em nosso sistema!!! Cadastre outro email, ou faça o login com o email já registrado.",
        value: req.body.data.email,
      };
      errors.errors.push(error);
      console.log("erros = ", errors.array());
      return res.status(200).json({ errors: errors.array() });
    } else if (existingUser.error === -1) {
      var error = {
        param: "inputEmail",
        msg: "Problema ao gravar seus dados. tente novamente!!!",
        value: req.body.data.email,
      };
      errors.errors.push(error);
      console.log("erros = ", errors.array());
      return res.status(200).json({ errors: errors.array() });
    }
  }

  var userId;
  if (id) {
    // update all data
    userId = await user.update();
    // update pw?
    console.log(
      "/api/user/save  req.body.data.changePW",
      req.body.data.changePW,
      req.body.data.changePW === true
    );
    if (req.body.data.changePW === true) await user.updatePW();
    // session is the payload to save in the token, it may contain basic info about the user
    const session = { ...user };
    // update the cookie session to get the new data updated
    await setLoginSession(res, session);
  } else var userId = await user.save();
  console.log("user.save", userId);

  // was there any error saving?
  if (userId === -1 || userId?.error === -1) {
    var error = {
      param: "inputEmail",
      msg: "Problema ao gravar seus dados. tente novamente!!!",
      value: req.body.data.email,
    };
    errors.errors.push(error);
    console.log("erros = ", errors.array());
    return res.status(200).json({ errors: errors.array() });
  }
  user.id = userId;

  if (!id) {
    // send email to confirm
    newUserEmail(user, req);
  }
  // mudou o email?
  if (req.body.data.changeEmail === true || !id) {
    //send email for confirmation --TODO
    console.log("======== envinado email -------");
  }
  res.status(200).send({ id: userId });
}
