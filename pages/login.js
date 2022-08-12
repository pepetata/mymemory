import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
// import { useCookies } from "react-cookie";

// import useUser from '../lib/useUser'
import Layout from "../components/Layout";
import CancelButton from "../containers/CancelButton";

import view30 from "../images/view30.png";
import view_not30 from "../images/view_not30.png";

const Login = (props) => {
  // const [cookies, setCookie] = useCookies(["midu","midt"]);
  const router = useRouter();
  const [user, setUser] = useState(props.user);
  const [viewPW, setViewPW] = useState(false);
  const [showError, SetShowError] = useState({ display: "none" });
  const [formErrors, setFormErrors] = useState(null);
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const { needlogin , timeout, r} = router.query;
  // useUser()

  useEffect(() => {
    console.log("login - dentro do useEffect", needlogin, timeout, r, router.query);
  }, [props]);

  const tooglePW = (event) => {
    event.preventDefault();
    // console.log("dentro do tooglePW");
    setViewPW(!viewPW);
  };

  const loginButton = async (event) => {
    event.preventDefault();
    displayErrorMsg(false);
    let errors = [];
    if (!user?.email) {
      errors.push({
        msg: "É necessário informar seu email que foi registrado em nosso sistema.",
      });
    }
    if (!user?.pw) {
      errors.push({ msg: "É necessário informar sua senha." });
    }
    if (errors.length > 0) {
      displayErrorMsg(true, errors);
      return;
    }

    try {
      let body = { username: user.email, password: user.pw };
      // console.log("JSON.stringify({ body })", JSON.stringify({ body }));
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      console.log(' login.js loginButton, json=', json)

      // console.log(json);
      if (json.errors || json.error) {
        displayErrorMsg(true, json.errors);
      } else {
        // save user
        // route to destination (r) or to home
        router.push(r? r:"/");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      displayErrorMsg(true, [error.message]);
    }
  };

  const displayErrorMsg = (val, msgs) => {
    setFormErrors(msgs);
    if (val) SetShowError({ display: "block" });
    else SetShowError({ display: "none" });
    // console.log('displayErrorMsg formErrors=',formErrors)
  };

  const ShowError = (
    <div
      role="alert"
      id="error-group"
      style={showError}
      className="alert alert-danger"
    >
    {/* <p>{console.log(formErrors)}</p> */}
      {formErrors ? (
        formErrors.length === 1 ? (
          <p id="moreerrors">
            <strong>Por favor corriga este erro:</strong>
          </p>
        ) : (
          <p id="moreerrors">
            <strong> Por favor corriga estes erros:</strong>
          </p>
        )
      ) : null}
      <ul id="errors">
        {formErrors
          ? formErrors.map((e, idx) => {
              {
                /* console.log(e.msg); */
              }
              return <li key={idx}>{e.msg}</li>;
            })
          : null}
      </ul>
    </div>
  );

  const TimeOutMsg = () => {
    return (
      <div>
        <br />
        <h2 className="h5 link-danger">
          Sua sessão expirou !!! Você precisa se logar novamente para acessar
          nosso sistema!!!
        </h2>
        <br />
      </div>
    );
  };

  const NeedLoginMsg = () => {
    return (
      <div>
        <br />
        <h2 className="h5 link-danger">
          Você precisa se logar antes de acessar nosso sistema!!!
        </h2>
        <br />
      </div>
    );
  };

  const pageContent = (
    <div className="container">
      <br />
      <br />
      <div className="row">
        <div className="col-lg-3 col-xs-2"></div>
        <div className="col-lg-6 col-xs-8">
          {needlogin === "true" && <NeedLoginMsg />}
          {timeout === "true" && <TimeOutMsg />}
          <form>
            <h1 className="h2">Efetuar login:</h1>
            <hr />
            <div className="mb-3">
              <label className="form-label">Correio Eletrônico</label>
              <input
                type="email"
                name="user[email]"
                onChange={(e) => {
                  localStorage.setItem("email", e.target.value); // to be used by /forgotpw
                  setUser({ ...user, email: e.target.value });
                }}
                ref={emailRef}
                required
                aria-describedby="email_Help"
                maxLength="150"
                className="form-control form-control-sm"
                autoComplete="email"
              />
            </div>
            <div className="mb-3 input-group">
              <label className="input-group">Senha</label>
              <input
                type={viewPW ? "text" : "password"}
                name="user[pw]"
                ref={pwRef}
                required
                aria-describedby="passwordHelpBlock"
                maxLength="20"
                className="form-control form-control-sm"
                autoComplete="current-password"
                onChange={(e) => setUser({ ...user, pw: e.target.value })}
              />
              <span className="input-group-text">
                <button
                  onClick={(e) => {
                    tooglePW(e);
                  }}
                  style={{ padding: 0 }}
                  className="btn"
                >
                  <Image
                    id="pwImg"
                    src={viewPW ? view_not30 : view30}
                    className="imgButton"
                    alt="Ver senha"
                    width={30}
                    height={30}
                  />
                </button>
              </span>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-1 col-xs-0"></div>
              <div className="col-lg-5 col-xs-12 text-center mt-2">
                <Link href="/forgotpw">
                  <a className="fs-5 fw-bold">Esqueci minha senha</a>
                </Link>
              </div>
              <div className="col-lg-5 col-xs-12 text-center mt-2">
                <Link href="/user">
                  <a className="fs-5 fw-bold">Não sou registrado</a>
                </Link>
              </div>
            </div>
            <br />
            {ShowError}
            <hr />
            <div className="row">
              <div className="col-lg-3 col-xs-0"></div>
              <div className="col-lg-3 col-xs-4 text-center">
                {/* <button type="submit" className="btn btn-warning otbutton mt-2">
                  Login
                </button> */}
                <button
                  className="btn btn-warning otbutton mt-2"
                  onClick={(e) => {
                    loginButton(e);
                  }}
                >
                  Login
                </button>
              </div>
              <div className="col-lg-3 col-xs-4 text-center">
                {/* <Link href="/index" passHref> */}
                <CancelButton href="/" />
                {/* </Link> */}
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-3 col-xs-2"></div>
      </div>

      <style jsx>{`
        .privacyTitle {
          font-weight: 600;
          color: #1650a1;
        }
      `}</style>
    </div>
  );

  return (
    <React.StrictMode>
      <Layout
        title="Login no Sistema Meu Ídolo"
        content={pageContent}
        group1={false}
        group2={false}
        group3={false}
      />
    </React.StrictMode>
  );
};

// // getStaticProps : The page will be pre-rendered at build time
// export async function getStaticProps() {
//   return { props: {} };
// }

export default Login;
