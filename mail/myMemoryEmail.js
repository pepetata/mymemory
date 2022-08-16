const sendEmail = require("./sendEmail").sendEmail;
const User = require("../models/user");

function newMemoryEmail(user, mm, req) {
  // console.log('newMemoryEmail',user, mm)
  const proto =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";

  const email = user.email;
  const subject = "Cadastro de Nova Memória no Sistema Memoria Test";
  var text = "<p>Olá " + user.nickname + " !!!</p>\n\n";
  text += "<p>Parabéns!!! Sua memória está gravada no Sistema Memoria Test.</p>\n\n";
  text += "<p>Esta foi a memória gravada:</p>"
  text += "<ol>"
  text += "<li><strong>Resposta</strong>: "+mm.name+"</li>"
  text += "<li><strong>Texto</strong>: "+mm.text+"</li>"
  text += "<li><strong>Foto na Internet</strong>: "+mm.link+"</li>"

  if (mm.link){
    text += "<div>"
    text += "<picture>"
    text += "<img style='max-width: 100%;height: auto;     object-fit: contain; vertical-align: middle;'  src='"+mm.link+"'"
    text += "   onerror='(currentTarget) => {"
    text += "   currentTarget.onerror = null;"
    text += "   currentTarget.src = '"+ proto + '://' + req.headers.host +"/images/logobig.png'";
    text += "}'"
        // onError={SetShowImg(false)}
        // onError={e => {
        //   console.log(e.onerror)
        //   // "this.onerror=null;this.src='http:localhost:3000/images/logobig.png'"
        // }}
        // className="img-fluid"
    text += "alt='Foto na Internet' width='200px' height='100px' />"
    text += "</picture><br /></div>"
  }
  text += "<li><strong>Referência</strong>: "+mm.href+"</li>"
  text += "</ol><br />"
  text += "<p><strong>Exercite seu cérebro todos os dias. Você vai notar a diferenças.</strong></p>"
  text += "<br /><p>Chame seus amigos para este exercício.</p>"






  // text +=
  //   '<p>Para confirmar seu email e finalizar seu registro, por favor  <a href="' +
  //   proto +
  //   "://" +
  //   req.headers.host +
  //   "/confirmation/?id=" +
  //   user.id +
  //   "&email=" +
  //   user.email +
  //   '">clique aqui.</a></p>\n\n';
  // text +=
  //   "<p>Ou, se preferir, digite em seu browser: " +
  //   proto +
  //   "://" +
  //   req.headers.host +
  //   "/confirmation/?id=" +
  //   user.id +
  //   "&email=" +
  //   user.email +
  //   "\n\n";

  sendEmail(email, subject, text, true);
  //console.log(text);
}

module.exports = { newMemoryEmail };
