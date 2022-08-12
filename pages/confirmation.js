import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import entrar from "../images/entrar.png";
import menu from "../images/menu.png";
import SigninButton from "../containers/SigninButton";
const server = process.env.SERVER

const Confirmation = (props) => {
  const [errorNoParam, setErrorNoParam] = useState(props.error);
  const [error, setError] = useState(props.user.error);
  const [confirm, setConfirm] = useState(props.user.confirmation);
  const [user, setUser] = useState(props.user);

  const NoParam = () => {
    return (
      <div>
        <h1 className="h3 red">Houve um erro!!</h1>
        <br />
        <h2 className="h4">Não podemos processar sua confirmação.</h2>
      </div>
    );
  };

  const EmailError = () => {
    return (
      <div>
        <h1 className="h3 red">Houve um erro!!</h1>
        <br />
        <h2 className="h4">
          O correio eletrônico que está tentando validar não existe em nosso
          sistema. Verifique o email recebido e tente novamente.
        </h2>
      </div>
    );
  };

  const Confirmation = () => {
    return (
      <div>
        <h1 className="h3">Parabéns!! Seu email está confirmado.</h1>
        <br />
        <p>A partir de agora você poderá usufruir de nosso sistema.</p>

        <br />
        <h2 className="h4">Estes foram os dados informados no seu cadastro:</h2>
        <ul>
          <li>
            Nome Completo:{" "}
            <strong className="royalblue">{user.full_name}</strong>
          </li>
          <li>
            Apelido: <strong className="royalblue">{user.nickname}</strong>
          </li>
          <li>
            Correio Eletrônico:{" "}
            <strong className="royalblue">{user.email}</strong>
          </li>
          <li>Senha: **** (não mostramos para sua segurança)</li>
        </ul>
        <br />
        <br />
          <div className="red strong"> {/* TODO  mudar o texto*/}
  
          </div>
      </div>
    );
  };

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
                {errorNoParam ? <NoParam /> : ""}
                {error ? <EmailError /> : ""}
                {confirm ? <Confirmation /> : ""}
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
      </div>
    </>
  );

  return (
    <React.StrictMode>
      <Layout
        title="Confirmação de Correio Eletrônico - Meu Ídolo"
        content={pageContent}
        group1={false}
        group2={false}
        group3={true}
      />
    </React.StrictMode>
  );
};

export async function getServerSideProps(context) {
  let error = true;
  let user = { error: false, confirmation: false };
  console.log("confirmation", context.query);
  const { id, email } = context.query;

  if (!id || !email) {
    return { props: { error, user } };
  }
  const res = await fetch(`${server}/api/user/confirmation`, {
    method: "POST",
    body: JSON.stringify({ email: email, id: id }),
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();

  // console.log("voltou", json);
  user = json.user;
  error = false;
  if (user.error !== -1) {
    user.error = false;
    user.confirmation = true;
  }
  // console.log('props=',  { props: { error, user } });
  return { props: { error, user } };
}

export default Confirmation;
