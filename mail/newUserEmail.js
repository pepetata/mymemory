const sendEmail = require("../mail/sendEmail").sendEmail;
const User = require("../models/user");

function newUserEmail(user, req) {
  const proto =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";

  const email = user.email;
  const subject = "Registro no Sistema Meu Ídolo";
  var text = "<p>Olá " + user.nickname + " !!!</p>\n\n";
  text += "<p>Obrigado por registrar-se no Sistema Meu Ídolo.</p>\n\n";
  text +=
    '<p>Para confirmar seu email e finalizar seu registro, por favor  <a href="' +
    proto +
    "://" +
    req.headers.host +
    "/confirmation/?id=" +
    user.id +
    "&email=" +
    user.email +
    '">clique aqui.</a></p>\n\n';
  text +=
    "<p>Ou, se preferir, digite em seu browser: " +
    proto +
    "://" +
    req.headers.host +
    "/confirmation/?id=" +
    user.id +
    "&email=" +
    user.email +
    "\n\n";

  sendEmail(email, subject, text, true);
  //console.log(text);
}

module.exports = { newUserEmail };
