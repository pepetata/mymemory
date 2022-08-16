const sendEmail = require('../mail/sendEmail').sendEmail;

function sendContactEmail(req) {
//   console.log('suggestedIdolEmail', req.body.name, req.body.email)
    return new Promise((resolve) => {
      
        const cc = req.body.email;
        const subject = "Mensagem de um Usuário do Memoria Test";
        var text = '<p>Nosso usuário ' + req.body.name + ' enviou esta mensagem para nossa equipe:</p>\n\n';
        text += "<hr>";
        text += '<div>' + req.body.text + '</div>\n\n';
        text += "<hr>";
        text += "<br>";
        text += "<p>" + req.body.name + ", agradecemos muito por sua coloboração!";
        text += "<br>";
        text += "<br>";
        sendEmail('myidol', subject, text, true, cc).then((result) => {
            resolve(result);
        });
    });
}

module.exports = {sendContactEmail}