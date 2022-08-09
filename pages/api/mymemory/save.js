import { check, validationResult } from "express-validator";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("data.privateMem").toBoolean(),
      check("data.name")
        .not()
        .isEmpty()
        .withMessage("O nome de sua memória não foi informado")
        .trim()
        .escape(),
      check("data.link").trim().escape(),
      check("data.href").trim().escape(),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
  console.log("/api/mymemory/save  req.body=", req.body);
  await validateBody(req, res);

  const errors = validationResult(req);
  console.log("/api/mymemory/save  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }

  // save mymemory
  var id = req.body.data?.id;
  const mymemory = new MyMemory(
    id,
    req.body.data.name,
    req.body.data.link,
    req.body.data.href,
    req.body.data.privateMem,
    req.body.user.id
  );

  console.log("x------------", req.body.data, mymemory);

  // check if the email is already in db -- not if user exists and is not changing email
  // if (! id) {
  //   // const existingUser = await user.getByEmail(req.body.data.email);
  //   // console.log("existingUser", existingUser, "error" in existingUser);
  //   if ("error" in existingUser === false) {
  //     var error = {
  //       param: "inputEmail",
  //       msg: "O email informado já está registrado em nosso sistema!!! Cadastre outro email, ou faça o login com o email já registrado.",
  //       value: req.body.data.email,
  //     };
  //     errors.errors.push(error);
  //     console.log("erros = ", errors.array());
  //     return res.status(200).json({ errors: errors.array() });
  //   } else if (existingUser.error === -1) {
  //     var error = {
  //       param: "inputEmail",
  //       msg: "Problema ao gravar seus dados. tente novamente!!!",
  //       value: req.body.data.email,
  //     };
  //     errors.errors.push(error);
  //     console.log("erros = ", errors.array());
  //     return res.status(200).json({ errors: errors.array() });
  //   }
  // }

  var mymemoryId;
  if (!id) {
    mymemoryId = await mymemory.save();
  } else {
    mymemoryId = await mymemory.update();
  }
  console.log("mymemory.save", mymemoryId);

  // was there any error saving?
  if (mymemoryId === -1 || mymemoryId?.error === -1) {
    var error = {
      param: "inputEmail",
      msg: "Problema ao gravar seus dados. tente novamente!!!",
      value: req.body.data.name,
    };
    errors.errors.push(error);
    console.log("erros = ", errors.array());
    return res.status(200).json({ errors: errors.array() });
  }

  res.status(200).send({ id: mymemoryId });
}
