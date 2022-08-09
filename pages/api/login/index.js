import passport from "passport";
import nextConnect from "next-connect";
import { check, validationResult } from "express-validator";

import { localStrategy } from "../../../lib/password-local";
import { setLoginSession } from "../../../lib/auth";
import initMiddleware from "../../../lib/init-middleware";
import validateMiddleware from "../../../lib/validate-middleware";

// import MySQLStore from "express-mysql-session";
// import sessionEx from "express-session";
// const MySQLStore = require("express-mysql-session")(sessionEx);

// const KEY = "myidolsessionstore";
// const SECRET = "E5lUKwg*uw3q1HAduaXAYjM^72ry&yMi8zXK6K1c";
// const sessionStore = new MySQLStore({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   charset: "utf8mb4",
//   debug: false,
// });

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("username")
        .isEmail()
        .withMessage("O email não está no formato correto")
        .normalizeEmail({ gmail_remove_dots: false }),
      // password must be at least 5 chars long
      check("password")
        // check pw length only if new user or when changing it
        .custom((value, { req }) => {
          var pw = value.toString();
          if (pw.length < 4) {
            throw new Error("A senha precisa ter no mínimo 4 caracteres");
          }
          return true;
        }),
      //.withMessage('A senha precisa ter no mínimo 4 caracteres'),
    ],
    validationResult
  )
);

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    console.log("/api/login authenticate");
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });

passport.use(localStrategy);

export default nextConnect()
  // .use(
  //   sessionEx({
  //     key: KEY,
  //     secret: SECRET,
  //     store: sessionStore,
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // )
  // .use(passport.initialize())
  // .use(passport.session())
  .post(async (req, res) => {
    try {
      console.log("/api/login  ");
      await validateBody(req, res);
      const errors = validationResult(req);
      console.log("/apilogin  errors=", errors);
      if (!errors.isEmpty()) {
        res.status(200).json({ errors: errors.array() });
        return;
      }

      console.log("/api/login - nextConnect");
      const user = await authenticate("local", req, res);
      console.log("/api/login - nextConnect 2", user, "error" in user);

      // check if user is ok to continue
      if ("errors" in user === true) {
        res.status(200).send(JSON.stringify(user));
        return;
      }

      // session is the payload to save in the token, it may contain basic info about the user
      const session = { ...user };

      await setLoginSession(res, session);
      console.log("/api/login - nextConnect 3");

      res.status(200).send({ done: true });
    } catch (error) {
      console.log("nextConnect - error=", error);
      // console.error(error);
      res.status(401).send(error.message);
    }
  });
