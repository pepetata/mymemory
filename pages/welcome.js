import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const Welcome = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const u = JSON.parse(sessionStorage.getItem("user"));
    // console.log("u", u.user, u.user.email);
    setUser(u.user);
    // console.log("user", user);
  }, []);

  const pageContent = (
    <>
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-xs-2"></div>
          <div className="col-lg-8 col-xs-8">
            <div id="body">
              <div id="suggestIdol">
                <h1 className="h3">Seja bem-vindo ao nosso time!!</h1>
                <br />
                <p>
                  Enviamos um email para você. Por favor leia-o e clique no
                  local adequado para confirmar que o endereço de email
                  informado está correto.
                </p>
                <p>
                  Caso não receba nosso email, verifique na pasta de lixo
                  eletrônico. Pode esta lá, neste caso, avise ao seu sistema de
                  email que nós não enviamos email considerado lixo eletrônico.
                </p>
                <p>
                  Infelizmente cada sistema de email tem uma forma de avisar
                  isso e não temos como ajudar neste caso.
                </p>
                <p className="royalblue bold">
                  Assim que você confirmar seu email, poderá usar nosso sistema
                  quantas vezes quiser e sem custo!!!
                </p>
                <br />
                <p>Estes foram os dados informados no seu cadastro:</p>
                <ol>
                  <li>
                    Nome Completo:{" "}
                    <strong className="royalblue">{user.full_name}</strong>
                  </li>
                  <li>
                    Apelido:{" "}
                    <strong className="royalblue">{user.nickname}</strong>
                  </li>
                  <li>
                    Correio Eletrônico:{" "}
                    <strong className="royalblue">{user.email}</strong>
                  </li>
                  <li>Senha: **** (não mostramos para sua segurança)</li>
                </ol>
                <br />
                <br />
                <br />
                <Link href="/">
                  <button
                    className="btn btn-warning otbutton"
                    // onClick={this.props.fun}
                  >
                    Entendido
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <style jsx>{`
        .accordion-item {
          background-color: $accordion-color;
          border: 1px solid rgba(0, 0, 0, 0.125);
        }

        .accordion-button:not(.collapsed) {
          color: #0c63e4;
          background-color: #e7f1ff;
          box-shadow: inset 0 -1px 0 rgb(0 0 0 / 13%);
        }
      `}</style>
    </>
  );

  return (
    <React.StrictMode>
      <Layout
        title="Seja bem-vindo ao Meu Ídolo!!"
        content={pageContent}
        group1={false}
        group2={false}
        group3={false}
      />
    </React.StrictMode>
  );
};

export default Welcome;
