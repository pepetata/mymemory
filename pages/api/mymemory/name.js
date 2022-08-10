import { check, validationResult } from "express-validator";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";
import { titleCase } from "../../../lib/common";

const validateBody = initMiddleware(
  validateMiddleware([check("name").trim().escape()], validationResult)
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

  var mymemoryFound = await new MyMemory().findName(
    req.body.name,
    req.body.user
  );
  console.log("mymemory.findName", mymemoryFound);

  const newMyMemory = {};
  console.log("newMyMemory", newMyMemory);
  // was there any error saving?
  if (mymemoryFound === -1 || mymemoryFound?.error === -1) {
    mymemoryFound = newMyMemory;
  } else
    mymemoryFound = new MyMemory(
      mymemoryFound.id,
      titleCase(mymemoryFound.name),
      decodeURI(mymemoryFound.link),
      decodeURI(mymemoryFound.href),
      mymemoryFound.private===1,
      mymemoryFound.user
    );
  console.log("mymemoryFound final", mymemoryFound);

  res.status(200).send(mymemoryFound);
}
