
const sendEmail = require('../mail/sendEmail').sendEmail;
const User = require('../models/user');

function newPassword(user, req) {
  const proto =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";

  const email = user.email;
  const subject = "Sistema Memoria Test - Nova Senha";
  var text = '<p>Olá ' + user.nickname + ' !!!</p>\n\n';
  text += '<p>Obrigado por usufruir do Sistema Memoria Test.</p>\n\n';
  text += '<p>Conforme sua solicitaçao, alteramos sua senha para: <strong>'+user.pw+'</strong></p>\n\n';
  text += '<p>Acesse nosso Sistem clicando em <a href="" > ' + proto + '://' + req.headers.host + '</a> e troque sua senha de acordo com sua conveniência.</p>\n\n';

  sendEmail(email, subject, text, true);
//console.log(text);

}




module.exports = {newPassword}