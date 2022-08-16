import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";

import SignupButton from "../containers/SignupButton";

import home30 from "../images/home30.png";
import menu from "../images/menu.png";
import Layout from "../components/Layout";
import SaveButton from "../containers/SaveButton";
import SigninButton from "../containers/SigninButton";

const HowWorks = (props) => {
  return (
    <React.StrictMode>
      <Layout
        title="Como se Cadastrar no Sistem Minhas Memórias"
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
              <h1 className="h4">
                Como com se cadastrar no Sistema Memoria Test !!
              </h1>
              <br />
              <p>
                Você não precisa se cadastrar em nosso sistema para usá-lo. Veja
                como usar nosso sistema em&nbsp;
                <Link href="/howworks">
                  <a>Como Usar</a>
                </Link>
                ).{" "}
              </p>

              <p>
                Mas se quiser usar suas próprias memórias durante os testes,
                então é necessário se cadastrar.
              </p>

              <br />
              <p>É muito simples se cadastrar, são apenas dois passos:</p>

              <ol>
                <li className="adstrong">Cadastre-se no sistema</li>
                <ul>
                  <li className="mt-1">
                    Acesse nosso site: {/* TODO trocar abaixo */}
                    <Link href="https://www.ondetem.org">
                      <a>www.OndeTem.org</a>
                    </Link>
                  </li>
                  <li className="mt-1">
                    Na tela principal &nbsp;&nbsp;
                    <Image
                      src={home30}
                      className="imgButton imgHome"
                      alt="Home"
                      width={30}
                      height={30}
                    />{" "}
                    , clique no botão&nbsp;&nbsp;
                    <SignupButton />
                  </li>
                  <li className="mt-1">
                    Informe seus dados e certifique-se que seu correio
                    eletrônico está correto.
                  </li>
                  <li className="mt-1">
                    Clique no botão&nbsp;
                    <SaveButton />
                  </li>
                  <li className="bold mt-1">
                    Note que o sistema te enviará um correio eletrônico pra você
                    confirmar que seu endereço de correio eletrônico está
                    correto. Se não chegar nos próximos minutos, verifique se o
                    correio eletrônico não foi enviado para a pasta de lixo
                    eletrônico (spam).
                  </li>
                </ul>
                <br />
                <li className="adstrong">Confirme seu cadastro</li>
                <ul>
                  <li className="mt-1">
                    Precisamos confirmar que seu endereço de correio eletrônico
                    está correto.
                  </li>
                  <li className="mt-1">
                    Abra o correio eletrônico que te enviamos.
                  </li>
                  <li className="mt-1">
                    Clique no local indicado para confirmar que seu endereço de
                    correio eletrônico está correto.
                  </li>
                  <li className="mt-1 red">
                    Note que estes passos 1 e 2 precisam ser executados apenas
                    uma vez. Depois disso, sempre que quiser acessar nosso
                    sistema, basta apenas se registrar (veja abaixo em&nbsp;
                    <Link href="/howsignin">
                      <a>Como se Registrar</a>
                    </Link>
                    ).
                  </li>
                </ul>
                <br />
                <li className="adstrong">
                  PRONTO!! Seu cadastro está finalizado
                </li>
                <ul>
                <li className="mt-1">Este cadastro é feito apenas uma vez.</li>
                  <li className="mt-1">
                    Se quiser cadastrar suas memórias e depois usá-las em seus
                    testes, você precisa se registrar no sistema (veja abaixo
                    em&nbsp;
                    <Link href="/howsignin">
                      <a>Como se Registrar</a>
                    </Link>
                    ).
                  </li>
                </ul>
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
