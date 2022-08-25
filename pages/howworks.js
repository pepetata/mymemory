import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";
import Iron from "@hapi/iron";
import { getTokenCookie } from "../lib/auth-cookies";

import home30 from "../images/home30.png";
import registrar from "../images/signup.png";
import menu from "../images/menu.png";
import Layout from "../components/Layout";
import SaveButton from "../containers/SaveButton";
import showName from "../images/show_name.png";
import right from "../images/right.png";
import wrong from "../images/wrong.png";
import unknown from "../images/unknown.png";
import hide from "../images/hide.png";
import table30 from "../images/tables30.png";
import table_not30 from "../images/tables_not30.png";

const HowWorks = (props) => {
  return (
    <React.StrictMode>
      <Layout
        title="Como usar o Sistem Minhas Memórias"
        content={pageContent}
        user={props.user}
        group1={true}
        group2={true}
        group3={true}
      />
    </React.StrictMode>
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
            <div id="anuncie">
              <h1 className="h4">Como usar o Sistema Memoria Test !!</h1>
              <br />
              <p>
                Nosso sistema pode ser utilizado,{" "}
                <strong className="red"> de forma totalmente gratuíta</strong>,
                já na primeira tela do sistema. Use e abuse de seu cérebro para
                lembrar de tudo!!
              </p>
              <br />
              <p>
                Basta ver o que mostramos e responder a
                situação. Se quiser confirmar a resposta, clique no botão&nbsp;
                <Image
                  src={showName}
                  className="imgButton"
                  width={128}
                  height={51}
                  alt="Entrar no Sistema"
                />
              </p>
              <br />
              <p>
                Depois disso basta clicar em um dos botões:
                <Image
                  src={right}
                  className="imgButton mp-2"
                  width={128}
                  height={46}
                  alt="Entrar no Sistema"
                />
                <Image
                  src={wrong}
                  className="imgButton mp-2"
                  width={128}
                  height={49}
                  alt="Entrar no Sistema"
                />
                &nbsp; ou&nbsp;
                <Image
                  src={unknown}
                  className="imgButton mp-2"
                  width={128}
                  height={48}
                  alt="Entrar no Sistema"
                />
                &nbsp;para podermos manter uma contagem dos seus acertos.
              </p>
              <p>Logo em seguida mostramos o próximo teste.</p>
              <p>É simples assim!!</p>
              <br />
              <p>
                Se não desejar ver as estatísticas de acertos e erros, basta
                clicar no botão&nbsp;
                <Image
                  src={table_not30}
                  className="imgButton mp-2"
                  width={30}
                  height={30}
                  alt="Entrar no Sistema"
                />
                . E depois, se desejar vê-las novamente, clique em &nbsp;
                <Image
                  src={table30}
                  className="imgButton mp-2"
                  width={30}
                  height={30}
                  alt="Entrar no Sistema"
                />
              </p>
              <br />
              <p>
                Você ainda pode se cadastrar no sistema para registrar suas
                próprias memórias. Veja abaixo em&nbsp;
                <Link href="/howsignup">
                  <a>Como se Cadastrar</a>
                </Link>
                .
              </p>
              <br />
              <p><strong>
                Sendo cadastrado, você pode entrar no sistema </strong>(veja abaixo
                em&nbsp;
                <Link href="/howsignin">
                  <a>Como se Registrar</a>
                </Link>
                ) <strong>e ver todas as nossas memórias mais as suas. E ainda pode nos
                dizer que não deseja ver alguma memória que mostramos clicando
                no botão&nbsp;
                <Image
                  src={hide}
                  className="imgButton mp-2"
                  width={128}
                  height={52}
                  alt="Entrar no Sistema"
                /></strong>
              </p>
              <br />

              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .adstrong {
        font-weight: bold;
        font-size: 18px;
        color: #1650a1;
      }
    `}</style>
  </>
);

export async function getServerSideProps(context) {
  const TOKEN_SECRET = process.env.SECRET_COOKIE_PASSWORD;
  let user = {
    accept: false,
    agreement: true,
    email: "",
    full_name: "",
    id: "",
    nickname: "",
    pw: "",
  };

  const token = getTokenCookie(context.req);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
//    console.log("howworks - getServerSideProps  session=", session);
    user = session;
  }

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default HowWorks;
