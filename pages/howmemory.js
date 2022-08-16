import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";

import Layout from "../components/Layout";
import NewMemoryButton from "../containers/NewMemoryButton";
import menu from "../images/menu.png";
import SaveButton from "../containers/SaveButton";
import AddMemoryButton from "../containers/AddMemoryButton";
import DeleteButton from "../containers/DeleteButton";

const HowWorks = (props) => {
  return (
    <React.StrictMode>
      <Layout
        title="Como Cadastrar suas Memórias"
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
                Como cadastrar sua própria memória em nosso sistema
              </h1>
              <br />
              <br />
              <p>
                É isso mesmo! Você pode exercitar seu cérebro usando suas
                próprias memórias.
              </p>
              <br />
              {/* ---------------------------------------------------------------- */}
              <ol>
                <li className="adstrong">Cadastre-se no sistema</li>
                <ul>
                  <li className="mt-1">
                    Se você já se cadastrou, pule para o passo 2 abaixo.
                  </li>
                  <li className="mt-1">
                    Para cadastrar sua memória você precisa cadastrar você como
                    um usuário do sistema antes (veja abaixo em&nbsp;
                    <Link href="/howsignup">
                      <a>Como se Cadastrar</a>
                    </Link>
                    ).
                  </li>
                  <li className="mt-1">
                    Note que o seu cadastro só é feito uma vez.
                  </li>
                </ul>
                <br />
                {/* ---------------------------------------------------------------- */}
                <li className="adstrong">Registre-se no sistema</li>
                <ul>
                  <li className="mt-1">
                    Se você já se registrou, pule para o passo 3 abaixo.
                  </li>
                  <li className="mt-1">
                    Para cadastrar sua memória você precisa estar registrado no
                    sistema (veja abaixo em&nbsp;
                    <Link href="/howsignin">
                      <a>Como se Registrar</a>
                    </Link>
                    ), ou seja, nós precisamos saber quem é você para depois
                    mostrar suas memórias.
                  </li>
                  <li className="mt-1">
                    Então,{" "}
                    <strong className="red">
                      registre-se todas as vezes que for usar nosso sistema
                    </strong>
                    .
                  </li>
                </ul>
                <br />
                {/* ----------------------------------------------------------- */}
                <li className="adstrong">Cadastre suas memórias</li>
                <ul>
                  <li className="mt-1">
                    Clique no botão&nbsp;
                    <NewMemoryButton /> acima.
                  </li>
                  <li className="mt-1">
                    <strong>Preencha as informações:</strong>
                  </li>
                  <ul>
                    <li className="mt-2">
                      <strong className="red">Resposta</strong>: (informação
                      obrigatória)
                    </li>
                    <li className="mt-2">
                      <strong className="red">Texto</strong>: preencha para
                      complementar a informação na foto. Ou use um texto com uma
                      pergunta. Ex. quem descobriu o Brasil?
                    </li>
                    <li className="mt-2">
                      <strong className="red">Foto na Internet</strong>: se
                      quiser mostrar uma foto que esta na internet, informe o
                      endereço aqui. Esse endereço deve começar com http:// ou
                      https://
                    </li>
                    <li className="mt-2">
                      <strong className="red">
                        Foto no seu computador/telefone
                      </strong>
                      : você pode usar uma foto que tenha em seu computador ou
                      internet para ser mostrada.
                    </li>
                    <li className="mt-2">
                      <strong className="red">Referência</strong>: é um endereço
                      na internet onde a pessoa pode encontrar mais informação
                      sobre a resposta.
                    </li>
                    <li className="mt-3">
                      Para cadastrar uma memória, informe a resposta e um das
                      informações sobre a resposta (Texto, Foto na Internet ou
                      Foto no Computador/Telefone). a Referência não é
                      obrigatória.
                    </li>
                  </ul>
                  <li className="mt-4">
                    <strong>
                      Quando tiver preenchido as informações desejadas. Clique
                      no botão <SaveButton />
                    </strong>
                  </li>
                  <li className="mt-4">
                    <strong>
                      Para cadastrar outra memória, clique no botão{" "}
                      <AddMemoryButton />
                    </strong>
                  </li>
                  <li>
                    <strong className="red">Cadastre quantas memórias quiser!!</strong></li>
                </ul>
                <br />
                {/* ----------------------------------------------------------- */}
                <li className="adstrong">Altere suas memórias</li>
                <ul>
                  <li className="mt-1">
                    Quando quiser alterar alguma informação de uma memória já
                    cadastrada, faça assim:
                  </li>
                  <li className="mt-1">
                    Depois de registrar-se no sistema, clique no botão&nbsp;
                    <NewMemoryButton /> acima.
                  </li>
                  <li className="mt-1">
                    a) Preencha a Resposta da memória que deseja alterar.
                  </li>
                  <li className="mt-1">
                    b) Pressione a tecla [TAB] ou mova o cursor para outra informação. Assim o sistema vai mostrar toda informação existente de sua memória.
                  </li>
                  <li className="mt-1">
                    c) Altere a informação que desejar.
                  </li>
                  <li className="mt-4">
                    <strong>
                      d) Quando estiver satisfeito com as alterações desejadas. Clique
                      no botão <SaveButton />
                    </strong>
                  </li>
                  <li className="mt-4">
                      Para alterar outra memória, clique no botão <AddMemoryButton /> e siga os passos de a) a d) acima.
                  </li>
                </ul>
                <br />
                {/* ----------------------------------------------------------- */}
                <li className="adstrong">Apague suas memórias</li>
                <ul>
                  <li className="mt-1">
                    Quando quiser apagar alguma memória já
                    cadastrada, faça assim:
                  </li>
                  <li className="mt-1">
                    Depois de registrar-se no sistema, clique no botão&nbsp;
                    <NewMemoryButton /> acima.
                  </li>
                  <li className="mt-1">
                    a) Preencha a Resposta da memória que deseja alterar.
                  </li>
                  <li className="mt-1">
                    b) Pressione a tecla [TAB] ou mova o cursor para outra informação. Assim o sistema vai mostrar toda informação existente de sua memória.
                  </li>
                  <li className="mt-4">
                    <strong>
                      c) Clique no botão <DeleteButton />
                    </strong>
                  </li>
                </ul>
              </ol>
              <hr />
              {/* ----------------------------------------------------------- */}
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
                  />{" "}
                  que fica no lado superior direito da tela.
                </li>
              </ul>
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
  let user = {};
  if (context.req.cookies.midu) user = JSON.parse(context.req.cookies.midu);
  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default HowWorks;
