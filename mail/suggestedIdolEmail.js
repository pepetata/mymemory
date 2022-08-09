
const sendEmail = require('../mail/sendEmail').sendEmail;

function suggestedIdolEmail(req) {
  // console.log('suggestedIdolEmail', req.body.name, req.body.email)

    const cc = req.body.email;
    const subject = "Sugestão de Novo Ídolo";
    var text = '<p>Nosso usuário ' + req.body.name + ' enviou esta sugestão de ídolo para nosso sistema:</p>\n\n';
    text += "<hr>";
    text += '<div>' + req.body.text + '</div>\n\n';
    text += "<hr>";
    text += "<br>";
    text += "<br>";
    text += "<p>" + req.body.name + ", agradecemos muito por sua coloboração!";
    text += "<br>";
    text += "<br>";

    sendEmail('myidol', subject, text, true, cc);

}

module.exports = {suggestedIdolEmail}