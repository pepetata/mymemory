// components/layout.js
import React, { Component } from "react";
import Head from "next/head";

import HeaderNav from "./HeaderNav";
import Footer from "./Footer";
// header groups:
// 1- news - only if logged
// 2- register (not logged) or change user (logged)
// 3- login (not logged) or logout (logged)
//

const Layout = (props) => {
  // console.log('Layout', props)
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" type="image/png" href="favicon-32x32.png" />
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <main>
        <HeaderNav
          user={props.user}
          group1={props.group1}
          group2={props.group2}
          group3={props.group3}
        />
        <main>
        {props.content}
        </main>
        <Footer />
      </main>
    </>
  );
};

export default Layout;
