import { body, validationResult } from "express-validator";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";
import MyMemory from "../../../models/mymemory";

const validateBody = initMiddleware(
  validateMiddleware(
    [
      body("id").isNumeric(),
      body("user").isNumeric(),
    ],
    validationResult
  )
);

export default async function handler(req, res) {
  console.log("/api/mymemory/hide  req.body=", req.body);
  await validateBody(req, res);
  console.log("/api/mymemory/hide  2 ");

  const errors = validationResult(req);
  console.log("/api/mymemory/save  errors=", errors);
  if (!errors.isEmpty()) {
    res.status(200).json({ errors: errors.array() });
    return;
  }
await new MyMemory().hide(req.body.id, req.body.user);

  res.status(200).send({});
}
