import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import CancelButton from "../containers/CancelButton";
import server from "../common/server";
import SendButton from "../containers/SendButton";

const Forgotpw = (props) => {
  const router = useRouter();
  const [user, setUser] = useState({email: props.email});
  const [showError, SetShowError] = useState({ display: "none" });
  const [formErrors, setFormErrors] = useState(null);
//console.log('Forgotpw', props)
//   useEffect(() => {
//     // console.log("forgotpw - dentro do useEffect");
//     setUser({ ...user, email: localStorage.email });
//   },[user]);


  const validateEmail = (email) => {
    if (! email) return true
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  const sendButton = (event) => {
    event.preventDefault();
    displayErrorMsg(false);
    let errors = [];
    if (!user.email) {
      errors.push({
        error: true,
        msg: "É necessário informar seu correio eletrônico que foi registrado em nosso sistema.",
      });
    }
    if (!validateEmail(user.email)) {
        errors.push({
          error: true,
          msg: "O correio eletrônico informado não está no formato correto.",
        });
      }
      
    if (errors.length > 0) {
      displayErrorMsg(true, errors);
      return;
    }
    let dataUser = { email: user.email };
    fetch(server + "/api/login/forgotpw", {
      method: "POST",
      body: JSON.stringify(dataUser),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
//        console.log('sendButton json=====================',json);
        if (json.error) {
          displayErrorMsg(true, [json]);
        } else {
          displayErrorMsg(true, [
            {
              error: false,
              msg: "Enviamos uma nova senha para seu email. Utilize esta nova senha para o próximo login e mude-a conforme sua conveniência.",
            },
          ]);
          //   router.push("/");
        }
      });
  };

  const displayErrorMsg = (val, msgs) => {
    setFormErrors(msgs);
    // console.log("formErrors", formErrors);
    if (val) SetShowError({ display: "block" });
    else SetShowError({ display: "none" });
  };

  const ShowError = (
    <div
      role="alert"
      id="error-group"
      style={showError}
      className="alert alert-danger"
    >
      {formErrors ? (
        formErrors[0].error ? (
          formErrors.length === 1 ? (
            <p id="moreerrors">
              <strong>Por favor corriga este erro:</strong>
            </p>
          ) : (
            <p id="moreerrors">
              <strong> Por favor corriga estes erros:</strong>
            </p>
          )
        ) : null
      ) : null}
      <ul id="errors">
        {formErrors
          ? formErrors.map((e, idx) => {
              {/* console.log(e.msg); */}
              return <li key={idx}>{e.msg}</li>;
            })
          : null}
      </ul>
    </div>
  );

  const pageContent = (
    <div className="container">
      <br />
      <br />
      <div className="row">
        <div className="col-lg-3 col-xs-2"></div>
        <div className="col-lg-6 col-xs-8">
          <form>
            <h1 className="h2">Precisa de uma nova senha?</h1>
            <p>
              Insira abaixo seu correio eletrônico registrado no Sistema Meu
              Ídolo.
            </p>
            <br />
            <div className="mb-3">
              <label className="form-label">Correio Eletrônico</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                }}
                aria-describedby="email_Help"
                maxLength="150"
                className="form-control form-control-sm"
                autoComplete="email"
              />
            </div>
            <br />
            <br />
            <div className="row">
              <div className="col-lg-3 col-xs-0"></div>
              <div className="col-lg-3 col-xs-4 text-center">
                {/* <button type="submit" className="btn btn-warning otbutton mt-2">
                  Login
                </button> */}
                {/* <button
                  className="btn btn-warning otbutton mt-2"
                  onClick={(e) => {
                    sendButton(e);
                  }}
                >
                  Enviar
                </button> */}
                <SendButton send={sendButton} />
              </div>
              <div className="col-lg-3 col-xs-4 text-center">
                {/* <Link href="/index" passHref> */}
                <CancelButton href="/" />
                {/* </Link> */}
              </div>
            </div>
          </form>
          {ShowError}
        </div>
        <div className="col-lg-3 col-xs-2"></div>
      </div>

      <style jsx>{`
        .privacyTitle {
          font-weight: 600;
          color: #1650a1;
        }
      `}</style>
    </div>
  );

  return (
    <React.StrictMode>
      <Layout
        title="Redefinir senha do Sistema Memoria Test"
        content={pageContent}
        group1={false}  group2 = {false} group3={false}
      />
    </React.StrictMode>
  );
};
 

export async function getServerSideProps(context) {
    const { email } = context.query;
//    console.log("forgotpw", context.query), email;
    return { props: { email } };
  }

  

export default Forgotpw;
