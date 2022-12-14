import { sendEmail } from "./sendEmail";
// import User from "../models/user"
var text = "";

function mmEmail(user, mm, req) {
  const proto =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";

  text += "<ol>";
  text +=
    "<li style='margin-top: 0.25rem'><strong>Resposta</strong>: " +
    mm.name +
    "</li>";
  text +=
    "<li style='margin-top: 0.25rem'><strong>Texto</strong>: " +
    mm.text +
    "</li>";
  text +=
    "<li style='margin-top: 0.25rem'><strong>Foto na Internet</strong>: " +
    decodeURI(mm.link) +
    "</li>";

  if (mm.link) {
    text += "<div style='margin-top: 0.25rem'>";
    text += "<picture>";
    // text += "<img style='max-width: 100%;height: auto;     object-fit: contain; vertical-align: middle;'  src='"+mm.link+"'"
    text +=
      "<img style='max-width: 100%;height: auto;object-fit: contain; vertical-align: middle;'  src='" +
      decodeURI(mm.link) +
      "'";
    text += '   onerror="(currentTarget) => {';
    text += "   currentTarget.onerror = null;";
    text +=
      "   currentTarget.src = " +
      proto +
      "://" +
      req.headers.host +
      "/images/logobig.png'";
    text += '}"';
    // onError={SetShowImg(false)}
    // onError={e => {
    //   console.log(e.onerror)
    //   // "this.onerror=null;this.src='http:localhost:3000/images/logobig.png'"
    // }}
    // className="img-fluid"
    text += " alt='Foto na Internet' width='200px' height='100px' />";
    text += "</picture><br /></div>";
  }

  if (mm.picture) {
    text +=
      "<li style='margin-top: 0.25rem'><strong>Foto no Computador/Telefone</strong></li>";
    text += "<div style='margin-top: 0.25rem'>";
    text += "<picture>";
    // text += "<img style='max-width: 100%;height: auto;     object-fit: contain; vertical-align: middle;'  src='"+mm.link+"'"
    text +=
      "<img style='max-width: 100%;height: auto;object-fit: contain; vertical-align: middle;'  src='" +
      proto +
      "://" +
      req.headers.host +
      mm.picture +
      "'";
    text += '   onerror="(currentTarget) => {';
    text += "   currentTarget.onerror = null;";
    text +=
      "   currentTarget.src = '" +
      proto +
      "://" +
      req.headers.host +
      "/images/logobig.png'";
    text += '}"';
    // onError={SetShowImg(false)}
    // onError={e => {
    //   console.log(e.onerror)
    //   // "this.onerror=null;this.src='http:localhost:3000/images/logobig.png'"
    // }}
    // className="img-fluid"
    text += " alt='Foto no Computador' width='200px' height='100px' />";
    text += "</picture><br /></div>";
  }

  text +=
    "<li style='margin-top: 0.25rem'><strong>Refer??ncia</strong>: " +
    decodeURI(mm.href) +
    "</li>";
  text +=
    "<li style='margin-top: 0.25rem'><strong>Privado?</strong>: " +
    (mm.private ? "Sim" : "N??o") +
    "</li>";
  text += "</ol>";
  text +=
    "<p><strong>Exercite seu c??rebro todos os dias. Voc?? vai notar a diferen??a.</strong></p>";
  text += "<p>Chame seus amigos para este exerc??cio.</p>";
  return;
}

function newMemoryEmail(user, mm, req) {
//  console.log("newMemoryEmail", user, mm);;
  const email = user.email;

  const subject = "Cadastro de Nova Mem??ria no Sistema Memoria Test";
  text = "<p>Ol?? " + user.nickname + " !!!</p>\n\n";
  text +=
    "<p>Parab??ns!!! Sua mem??ria est?? gravada no Sistema Memoria Test.</p>\n\n";
  text += "<p>Esta foi a mem??ria gravada:</p>";

  mmEmail(user, mm, req);

  sendEmail(email, subject, text, true);
  // console.log(text);
}

function updateMemoryEmail(user, mm, req) {
//  console.log("updateMemoryEmail", user, mm);
  const email = user.email;

  const subject = "Altera????o de Mem??ria no Sistema Memoria Test";
  text = "<p>Ol?? " + user.nickname + " !!!</p>\n\n";
  text += "<p>Sua mem??ria foi alterada no Sistema Memoria Test.</p>\n\n";
  text += "<p>Com suas altera????es ela ficou assim:</p>";

  mmEmail(user, mm, req);

  sendEmail(email, subject, text, true);
  // console.log(text);
}

module.exports = { newMemoryEmail, updateMemoryEmail };
