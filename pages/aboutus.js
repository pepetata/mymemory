import React, { Component } from "react";
import Layout from "../components/Layout";

const AboutUs = (props) => {
  return (
    <React.StrictMode>
      <Layout title="Sobre o Sistem Memoria Test" content={pageContent} group1={false}  group2 = {false} group3={false}/>
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
              <h1 className="h3">Quem Somos</h1>
              <br />
              <h2 className="h5 red">
                Memoria Test
              </h2>
              <p>
               Você notou bem! Mas está correto: memoria sem acento pois está em Latin. Queremos oferecer este sistema a outros países e nos pareceu melhor usar uma palavra em Latin.
              </p>
              <br />
              <br />
              <p>
                O Sistema Memoria Test foi desenvolvido para testarmos e execrcitarmos nossa memória.
              </p>
              <br />
              <br />              
              <p>
                Hoje em dia a informação está tão fácil de acessar que nem nos damos ao trabalho de gravar nada na memória.
              </p>
              <br />
              <br />
              <p>
                Já está longe os tempos onde tínhamos uma grande lista de telefones guardados na memória e, hoje em dia só sabemos o nosso telefone.
              </p>
              <br />
              <br />
              <p>
                <strong>A solução é exercitar o &quot;músculo&quot; cérebro!</strong>
              </p>
              <br />
              <br />
              <p>
                Nós temos muitas &quot;memórias&quot; cadastradas para você se exercitar. Mas você pode criar suas próprias memórias para seu treino pessoal.
              </p>
              <br />
              <br />
              <p>
                Treine seu cérebro quantas vezes quiser. <strong className="red">É totalmente gratuíto.</strong>
              </p>
              <br />
              <br />

              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

// // getStaticProps : The page will be pre-rendered at build time
// export async function getStaticProps() {
//   return {props:{}}
//  }

export default AboutUs;