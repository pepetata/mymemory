import { body, validationResult } from "express-validator";
// import validator from "validator";
import { rename, unlink } from "node:fs";
import path from "node:path";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validateBody = initMiddleware(
  validateMiddleware(
    [
      body("data").escape(),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
//  console.log("/api/mymemory/delete  req.body=", req.body);
  await validateBody(req, res);

  const errors = validationResult(req);
//  console.log("/api/mymemory/delete  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }

  // delete mymemory
  const id = req.body.data;
  const mymemoryId=await new MyMemory().delete(id);
  
  // console.log("mymemory.save", mymemoryId);

  // was there any error saving?
  if (mymemoryId === -1 || mymemoryId?.error === -1) {
    var error = {
      param: "inputEmail",
      msg: "Problema ao apagar sua memória. tente novamente!!!",
      value: req.body.data,
    };
    errors.errors.push(error);
//    console.log("erros = ", errors.array());
    return res.status(200).json({ errors: errors.array() });
  }

  res.status(200).send({});
}
