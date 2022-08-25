import Local from "passport-local";
// import { findUser, validatePassword } from "./user";
import User from "../models/user";

export const localStrategy = new Local.Strategy(async function (
  username,
  password,
  done
) {
//  console.log("passport-local - localStrategy");
  const user = await new User().getByEmail(username);
//  console.log("passport-local - localStrategy - user=", user);

  // user exists?
//  console.log("passport-local user=", user);
  if (user?.error === -1 || user?.error === 0)
    done(null, {
      errors: [
        {
          error: 1,
          msg: "Informação incorreta! Verifique seu correio eletrônico e senha.",
        },
      ],
    });
const pwIsValid = await new User().validatePassword(user, password);
//console.log('pwIsValid=',pwIsValid)
  if (user && pwIsValid) {
    console.log("passport-local - localStrategy - pw valida - user =", user);
    // check if user has confirmed pw
    if (user?.status === "0")
    done(null, {
      errors: [
        {
          error: 1,
          msg: "Você ainda não confirmou seu email e por isso não poderá usar nossa aplicação ainda. Procure o email que te enviamos e siga as instruções.",
        },
      ],
    });

    else {// user is ok - authorized
      // set the last login
      new User().setLastLogin(user.id)
      done(null, user)};
  } else {
    done(null, {
      errors: [
        {
          error: 1,
          msg: "pw invalida --------------- Informação incorreta! Verifique seu correio eletrônico e senha.",
        },
      ],
    });
  }
});
