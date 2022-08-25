import { body, validationResult } from "express-validator";
// import validator from "validator";
import { rename, unlink } from "node:fs";
import path from "node:path";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";
import { newMemoryEmail, updateMemoryEmail } from "../../../mail/myMemoryEmail";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validateBody = initMiddleware(
  validateMiddleware(
    [
      body("data.privateMem").toBoolean(),
      body("data.name")
        .not()
        .isEmpty()
        .withMessage("O nome de sua memória não foi informado")
        .trim()
        .toLowerCase()
        .escape(),
      body("data.texto").trim().toLowerCase().escape(),
      body("data.link")
        .if((value, { req }) => req.body.data.link)
        .isURL({ protocols: ["http", "https"] })
        .withMessage("O endereço da foto da internet não é válido."),
      body("data.href")
        .if((value, { req }) => req.body.data.href)
        .isURL({ protocols: ["http", "https"] })
        .withMessage("O endereço da referência não é válido."),
      // body("data.link").custom((value, { req }) => {
      //   console.log("validating link");
      //   if (value == "") return true;
      //   if (value.isURL()) return value.trim();
      //   throw new Error("O endereço da Foto na Internet não é válido.");
      // }),
      // .not()
      // .isEmpty()
      // .isURL({ protocols: ["http", "https"] })
      // .withMessage("O endereço da foto não é válido.")
      // .trim(),
      // body("data.href").custom((value, { req }) => {
      //   console.log("validating href");
      //   if (value == "") return true;
      //   if (value.isURL()) return value.trim();
      //   throw new Error("O endereço da referência não é válido.");
      // }),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
//  console.log("/api/mymemory/save  req.body=", req.body);
  await validateBody(req, res);

  const errors = validationResult(req);
//  console.log("/api/mymemory/save  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }

  let userFile=req.body.data.picture;
  // move new picture to userFiles
  // check if the new Picture is in the tempFiles
  if (req.body.data.newImage && req.body.data.newImage.search("tempFiles") > -1) {
    // move picture from folder tempFiles to userFiles
    const tempFile = req.body.data.newImage;
    userFile = tempFile.replace("tempFiles", "userFiles");
    const folder = `${__dirname}${path.sep}..${path.sep}..${path.sep}..${path.sep}public`;
    // console.log('----------------------', tempFile, userFile, __dirname, folder)

    // move new pictue from folder tempFiles to userFiles
    rename(folder + tempFile, folder + userFile, (err) => {
      if (err) throw err;
      console.log("Rename complete!");
    });

    // remove old picture from folder userFiles
    if (req.body.data.picture) {
      const removeFile = folder + req.body.data.picture;
//      console.log("removeFile", removeFile);
      unlink(removeFile, (err) => {
        if (err) throw err;
//        console.log("Delete complete!");
      });
    }
  }
  // save mymemory
  var id = req.body.data?.id;
  const mymemory = new MyMemory(
    id,
    req.body.data.name,
    req.body.data.text,
    encodeURI(req.body.data.link),
    encodeURI(req.body.data.href),
    req.body.data.private,
    req.body.user.id,
    userFile
  );

//  console.log("x------------", req.body.data, mymemory);

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
    newMemoryEmail(req.body.user, mymemory, req);
  } else {
    mymemoryId = await mymemory.update();
    updateMemoryEmail(req.body.user, mymemory, req);
  }
  // console.log("mymemory.save", mymemoryId);

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
  res.status(200).send({ id: mymemoryId, picture: userFile });
}
