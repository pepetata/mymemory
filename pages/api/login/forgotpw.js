import { body, validationResult } from "express-validator";
// import validator from "validator";
import { rename, unlink } from "node:fs";
import path from "node:path";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import User from "../../../models/user";
import { newPassword } from "../../../mail/newPassword";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validateBody = initMiddleware(
  validateMiddleware(
    [
      body("email")
      .isEmail()
      .withMessage("O email não está no formato correto")
      .normalizeEmail({ gmail_remove_dots: false }),
    ],
    validationResult
  )
);

const createPW = () => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 8;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}


export default async function handler(req, res) {
  console.log("/api/mymemory/forgotpw  req.body=", req.body);
  // await validateBody(req, res);
  // res.status(200).send({ });
  const u = await new User().getByEmail(req.body.email);
  if (!u.error && 'id' in u) {
    const newPW = createPW();
    let user = new User(u.id, u.full_name, u.nickname, u.email, newPW, u.accept_emails);
    user.update();
    console.log('nova senha', newPW)
    newPassword(user, req);
    res.end(JSON.stringify(''))
  } else res.end(JSON.stringify({error:1, msg:'O correio eletrônico informado não existe em nossos arquivos.'}))
}
