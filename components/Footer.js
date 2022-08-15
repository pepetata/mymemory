import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cancel from "../images/user.png";

// nao vou usar o react-bootstrap pois o rendering é feito no cliente
// vou usar SSR - Server SIde Rendering e Static-site Generation (SSG) qdo possivel
// senao, uso SPA's (Single Page Application) em outros casos
//import {Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';

import variables from "../styles/variables.module.scss";
import SendButton from "../containers/SendButton";
import server from "../common/server";
//
const Footer = (props) => {
  const [contact, SetContact] = useState({nameContactUs:"",emailContactUs:"",commentContactUs:""});
  const [sending, SetSending] = useState(false);
  const [sent, SetSent] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    const { id, value } = event.target;
    // console.log("handleChange", id, value);
    SetContact({ ...contact, [id]: value });
  };

  const send = (event) => {
    event.preventDefault();
    let errors = [];
    if (
      !contact.nameContactUs ||
      !contact.emailContactUs ||
      !contact.commentContactUs
    ) {
      alert(
        "Por favor preencha todas as informações solicitadas para enviar sua mensagem: \n- Seu nome, \n- Seu email e\n- Sua mensagem."
      );
      return;
    }
    SetSending(true);

    let dataUser = {
      email: contact.emailContactUs,
      name: contact.nameContactUs,
      text: contact.commentContactUs,
    };

    fetch(server + "/api/sendContact", {
      method: "POST",
      body: JSON.stringify(dataUser),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        SetContact({});
        SetSending(false);
        SetSent(true);
        setTimeout(() => {
          SetSent(false);
        }, 5000);
      });
  };

  const contactDiv = {
    height: "210px",
    width: "95%",
  };

  const Sending = () => {
    return (
      <div id="footerInputDiv" style={contactDiv}>
        <div style={{ display: "table", height: "200px", overflow: "hidden" }}>
          <div style={{ display: "table-cell", verticalAlign: "middle" }}>
            <div>
              <h1 className="h5 red">
                Estamos enviando sua mensagem a nossos colaboradores.
              </h1>
              <p></p>
              <h2 className="h6">Por favor aguarde !!!</h2>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Sent = () => {
    return (
      <div id="footerInputDiv" style={contactDiv}>
        <div style={{ display: "table", height: "200px", overflow: "hidden" }}>
          <div style={{ display: "table-cell", verticalAlign: "middle" }}>
            <div>
              <h1 className="h5 red">Sua mensagem foi enviada com sucesso. </h1>
              <p></p>
              <h2 className="h6">Agradecemos o contato !!</h2>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="footer" className="footer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-xs-0">
            <div>
              <div className="row footerLine">
                <Link href="/aboutus">
                  <a>Sobre o Memoria Test</a>
                </Link>
              </div>
              <div className="row footerLine">
                <Link href="/howworks">
                  <a>Como Usar</a>
                </Link>
              </div>
              <div className="row footerLine">
                <Link href="/howsignup">
                  <a>Como se Cadastrar</a>
                </Link>
              </div>
              <div className="row footerLine">
                <Link href="/howsignin">
                  <a>Como se Registrar</a>
                </Link>
              </div>
              <div className="row footerLine">
                <Link href="/howmemory">
                  <a>Como Cadastrar Memória</a>
                </Link>
              </div>
              <div className="row footerLine">
                <Link href="/privacy">
                  <a>Política de Privacidade</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-xs-0">
            <div>
              <hr id="footerHRContact" className="footerHr"></hr>
              <div className="row footerContact">
                <p>
                  <span className="blue">
                    Fale com a Equipe do Memoria Test
                  </span>
                </p>
              </div>

              {!sending && !sent ? (
                <div id="footerInputDiv" style={contactDiv}>
                  <form id="contactusForm">
                    <div className="mb-3 input-group input-group-sm">
                      <span className="input-group-text" id="basic-addon1">
                        Seu nome
                      </span>
                      <input
                        id="nameContactUs"
                        className="form-control"
                        type="text"
                        value={contact.nameContactUs}
                        maxLength="100"
                        autoComplete="name"
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="mb-3 input-group input-group-sm">
                      <span className="input-group-text" id="basic-addon1">
                        Seu email
                      </span>
                      <input
                        id="emailContactUs"
                        className="form-control"
                        type="email"
                        value={contact.emailContactUs}
                        maxLength="150"
                        autoComplete="email"
                        onChange={handleChange}
                      ></input>
                    </div>
                    <div className="mb-3 input-group input-group-sm">
                      <textarea
                        id="commentContactUs"
                        className="form-control"
                        rows="4"
                        value={contact.commentContactUs}
                        cols="50"
                        placeholder="Sua mensagem para a equipe do Memoria Test."
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <SendButton send={send} />
                  </form>
                </div>
              ) : null}

              {sending ? <Sending /> : null}
              {sent ? <Sent /> : null}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer.row {
          margin: 0;
        }

        #footerInputDiv label {
          text-align: center;
          align-items: center;
          height: 206px;
          color: red;
        }

        #footerInputDiv {
          width: 95%;
          margin: auto;
          height: 210px;
          text-align: center;
        }

        .footerContact {
          text-align: center;
        }

        .footerFollow {
          text-align: center;
          line-height: 40px;
        }

        .footerInput {
          margin-bottom: 5px;
          width: 100%;
          font-family: initial;
        }

        .footerHrShow {
          margin: auto;
          width: 60%;
        }

        #footerHRContact {
          display: none;
        }

        .submitError {
          border-style: outset;
          border-color: #ef7979;
          border-width: medium;
          background-color: mistyrose;
        }

        .footer a {
          color: #337ab7;
          text-decoration: none;
        }

        .footer .mb-3 {
          margin-bottom: 1px !important;
        }

        .footer .otbutton {
          height: 30px;
          width: 90px;
        }

        .footer p {
          margin-bottom: 5px;
        }

        .footer .form-control:focus {
          color: #212529;
          background-color: mistyrose;
          border-color: #ef7979;
          outline: 0;
        }

        .footer {
          background-color: ${variables.headercolor};
          font-family: "Varela Round", sans-serif;
          font-size: 14px;
          text-align: center;
          position: relative;
          bottom: 0;
          left: 0;
          padding-bottom: 30px;
          width: 100%;
          padding-bottom: 30px;
          padding-top: 20px;
          width: 100%;
          margin-top: 35px;
        }

        .footerContact a,
        .footerFollow a {
          font-weight: bold;
          line-height: 45px;
          color: blue;
          border-top: 1px;
          border: 10px;
        }

        .footerLine a {
          /* padding-left: 20%; */
          /* font-weight: 600; */
          line-height: 35px;

          /* padding-top: 40px; */
        }
        @media only screen and (max-device-width: 767px) {
          #footerHRContact {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};
export default Footer;
