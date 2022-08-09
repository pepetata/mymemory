//[label /pages/index.js]

import React, { Component } from "react";
// import { CookiesProvider } from "react-cookie";
//import Head from 'next/head'
import Link from "next/link";
import Layout from "../components/Layout";
import Iron from "@hapi/iron";
import { getTokenCookie } from "../lib/auth-cookies";

// import CookieConsent from "react-cookie-consent";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import Image from "next/image";

// import singer1 from "../public/images/anitta.jpg";
// import singer2 from "../public/images/ivete_sangalo.webp";
// import singer3 from "../public/images/ludimilla.jpg";
// import singer4 from "../public/images/Luan Santana.jpg";
// import singer5 from "../public/images/maiaramaraisa.webp";

// import artist1 from "../public/images/Bruna Marquezine.webp";
// import artist2 from "../public/images/Juliana Paes.jpg";
// import artist3 from "../public/images/larissamanoela.jpg";
// import artist4 from "../public/images/Marina Ruy Barbosa.png";
// import artist5 from "../public/images/PAOLLA OLIVEIRA.jpg";

// import soccer1 from "../public/images/Daniel Alves.webp";
// import soccer2 from "../public/images/David Luiz.webp";
// import soccer3 from "../public/images/Marcelo Vieira Jr.png";
// import soccer4 from "../public/images/neymar.jpg";
// import soccer5 from "../public/images/Philippe Coutinho.jpg";

// import emmy from "../public/images/emmy.jpg";
// import oscar from "../public/images/trophie3.jpeg";
// import fifa from "../public/images/fifa.jpg";

const animationSinger = { duration: 5000, easing: (t) => t };
const animationArtist = { duration: 7000, easing: (t) => t };
const animationSoccer = { duration: 6000, easing: (t) => t };
const divStyle = { position: "relative", height: "300px" };

const Index = (props) => {
  // console.log("Index", props);
  //const param =

  const pageContent = (
    <>
      <br />
      <br />
      <br />
      <h1>Index.js</h1>
    </>
    // <>
    //   <br />
    //   <br />
    //   <br />
    //   <h1>Quais são seus ídolos prediletos?</h1>
    //   <h2>Quais cantores?</h2>
    //   <h2>Quais artistas de novelas?</h2>
    //   <h2>Quais apresentadores de TV?</h2>
    //   <h2>Quais atletas?</h2>

    //   <Link href="/feed">
    //     <a>Ver noticias do idols</a>
    //   </Link>
    //   <br />
    //   <br />
    //   <br />
    //   <br />
    // </>
  );

  return (
    // <CookiesProvider>
    // <React.StrictMode>
    <Layout
      title="Memoria Test"
      content={pageContent}
      user={props.user}
      group1={true}
      group2={true}
      group3={true}
    />
    // </React.StrictMode>
    // <CookieConsent
    //   location="bottom"
    //   buttonText="Entendido e Aceito!!"
    //   cookieName="MyIdolConsetCookie"
    //   style={{ background: "#1f5088" }}
    //   buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
    //   expires={150}
    // >
    //   Este site usa cookies para garantir que você obtenha a melhor
    //   experiência em nosso site.{" "}
    //   <Link href="/privacy">
    //     <a style={{ color: "white" }}>
    //       <span>Saber mais</span>
    //     </a>
    //   </Link>
    // </CookieConsent>
    // </CookiesProvider>
  );
};

export async function getServerSideProps(context) {
  const TOKEN_SECRET = process.env.SECRET_COOKIE_PASSWORD;
  let user = {};
  const token = getTokenCookie(context.req);
  console.log("index - getServerSideProps  token=", token);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
    console.log("index - getServerSideProps  session=", session);
    user = session
  }

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default Index;

// nao vou usar o react-bootstrap pois o rendering é feito no cliente
// vou usar SSR - Server SIde Rendering e Static-site Generation (SSG) qdo possivel
// senao, uso SPA's (Single Page Application) em outros casos
//import {Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
