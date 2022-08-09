import { check, validationResult } from "express-validator";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("name")
        .trim()
        .escape(),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
  console.log("/api/mymemory/name  req.body=", req.body);
  await validateBody(req, res);

  const errors = validationResult(req);
  console.log("/api/mymemory/name  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }


  var mymemoryFound  = await new MyMemory().findName(req.body.name,req.body.user);
  console.log("mymemory.save", mymemoryFound);

  const newMyMemory = new MyMemory(); 
  console.log('newMyMemory',newMyMemory)
  // was there any error saving?
  if (mymemoryFound === -1 || mymemoryFound?.error === -1) {
    mymemoryFound=newMyMemory
  } else mymemoryFound = new MyMemory(
    mymemoryFound.id,
    mymemoryFound.name,
    mymemoryFound.link,
    mymemoryFound.href,
    mymemoryFound.private,
    mymemoryFound.user
    )
    console.log('mymemoryFound final',mymemoryFound)

  res.status(200).send(mymemoryFound);
}
