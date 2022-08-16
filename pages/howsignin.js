import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";

import home30 from "../images/home30.png";
import registrar from "../images/signup.png";
import menu from "../images/menu.png";
import Layout from "../components/Layout";
import SaveButton from "../containers/SaveButton";
import showName from "../images/show_name.png"
import right from "../images/right.png"
import wrong from "../images/wrong.png"
import unknown from "../images/unknown.png"
import hide from "../images/hide.png"
import SigninButton from "../containers/SigninButton";



const HowWorks = (props) => {
  return (
    <React.StrictMode>
      <Layout
        title="Como se Registrar no Sistem Minhas Memórias"
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
              <h1 className="h4">Como se registrar no Sistema Memoria Test !!</h1>
              <br />
              <p>Você não precisa se registrar em nosso sistema para usá-lo. Veja como usar nosso sistema em&nbsp;
                <Link href="/howworks">
                      <a>Como Usar</a>
                    </Link>
                    . </p>

              <p>Mas se quiser usar suas próprias memórias durante os testes, então é necessário se cadastrar (veja abaixo em&nbsp;
                <Link href="/howsignup">
                      <a>Como se Cadastrar</a>
                    </Link>
               ) e depois se registrar.</p>

              <br />
              <p>É muito simples se registrar, são apenas dois passos:</p>
              <ol>
                <li className="adstrong">Efetue o login no sistema</li>
                <ul>
                  {/* TODO trocar abaixo */}
                  <li className="mt-1">
                    Acesse nosso site novamente:&nbsp;
                    <Link href="https://www.ondetem.org">{/* TODO trocar abaixo */}
                      <a>www.OndeTem.org</a>
                    </Link>
                  </li>
                  <li className="mt-1">
                    Clique no botão&nbsp;
<SigninButton />
                    &nbsp; e informe seu correio eletrônico e senha para ter
                    acesso.
                  </li>
                </ul>
                <br />

                <li className="adstrong">
                  Agora é só curtir!!!
                </li>
                <ul>
                  <li className="mt-1">Exercite sua memória usando nossas memórias.</li>
                  <li className="mt-1">
                    Se não quiser ver alguma de nossas memórias, basta clicar no botão&nbsp;
                <Image
                      src={hide}
                      className="imgButton mp-2"
                      width={128}
                      height={52}
                      alt="Entrar no Sistema"
                    />
                  </li>
                  <li className="mt-1">
                    Se quiser, cadastre suas memórias (veja abaixo em&nbsp;
                <Link href="/howmemory">
                      <a>Como Cadastrar Memória</a>
                    </Link>
                    ).
                  </li>
                </ul>
                <br />
              </ol>
              <h2 className="h5 blue">
                Obs.: Quando estiver usando o celular, alguns botões podem estar
                &quot;escondidos&quot; na barra de navegação.
              </h2>
              <ul>
                <li className="mt-1">
                  Neste caso, procure o botão desejado clicando em&nbsp;&nbsp;
                  <Image
                    src={menu}
                    className="imgButton"
                    width={62}
                    height={47}
                    alt="Menu"
                  /> que fica no lado superior direito da tela.
                </li>
              </ul>
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
  let user = {};
  if (context.req.cookies.midu) user = JSON.parse(context.req.cookies.midu);
  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default HowWorks;
