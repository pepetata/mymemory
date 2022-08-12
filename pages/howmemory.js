import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";

import Layout from "../components/Layout";



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
              <h1 className="h4">Como se registrar no Sistema Memoria Test !!</h1>
              <br />
              <br />
              <br />
              <h2 className="h5">Homens trabalhando nisso!!</h2>

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
