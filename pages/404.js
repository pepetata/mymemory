import React, { Component } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import i404 from "../images/404.png";

const A404 = (props) => {
  return (
    <React.StrictMode>
      <Layout
        title="Memoria Test - Página não encontrada"
        content={pageContent}
        group1={false}  group2 = {false} group3={false}
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
          <div className="row">
            <div className="col-lg-4 col-xs-0">
              <Image
                src={i404}
                // className="position-absolute top-50 start-50 translate-middle"
                style={{ alignSelf: "center" }}
                height={225}
                width={225}
                alt="erro 404"
              />
            </div>
            <div className="col-lg-8 col-xs-0">
              <h1 className="h1">Opa!!! Algo deu errado</h1>
              <br />
              <br />
              <h2 className="h3">Esta página não existe.</h2>
              <br />
              <br />
              <Link href="/">
                <a style={{textDecoration: 'none'}}>
                  <h3 className="h5">
                    Clique aqui para voltar à página inicial.
                  </h3>
                </a>
              </Link>

              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default A404;

// getStaticProps : The page will be pre-rendered at build time
export async function getStaticProps() {
  return {props:{}}
 }

