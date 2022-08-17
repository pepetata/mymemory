import React, { useState, useEffect } from "react";
// import { useCookies } from "react-cookie";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import SignupButton from "../containers/SignupButton";

import logo from "../images/logobig250.png";
import home35 from "../images/home35.png";
// import registrar from "../images/signup.png";
import changeUser from "../images/user.png";
import sair from "../images/logout.png";

// header groups:
// 1- create memory - only if logged
// 2- register (not logged) or change user (logged)
// 3- login (not logged) or logout (logged)
//

// nao vou usar o react-bootstrap pois o rendering é feito no cliente
// vou usar SSR - Server SIde Rendering e Static-site Generation (SSG) qdo possivel
// senao, uso SPA's (Single Page Application) em outros casos
//import {Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';

import variables from "../styles/variables.module.scss";
import SigninButton from "../containers/SigninButton";
import NewMemoryButton from "../containers/NewMemoryButton";
//
const HeaderNav = (props) => {
  // const [cookies, setCookie, removeCookie] = useCookies(["midu", "midt"]);
  // const [userId, setUserId] = useState(cookies.midu ? cookies.midu.id : 0);
  const [userId, setUserId] = useState(props.user ? props.user.id : false);
  const router = useRouter();
  const [group1, setGroup1] = useState(props.group1);
  const [group2, setGroup2] = useState(props.group2);
  const [group3, setGroup3] = useState(props.group3);
  // console.log("HeaderNav", props);
  // console.log("HeaderNav userId", userId);
  useEffect(() => {
    console.log("HeaderNav useEffect", userId, props,window.location.pathname);
    import("bootstrap/dist/js/bootstrap.min");
  }, [props, userId]);

  // const Hide = { display: "none" };
  // const Show = { display: "block" };

  const NewMemory = (props) => {
    return (
      <a onClick={myMemory}>
        <NewMemoryButton />
      </a>
    );
  };

  const Register = (props) => {
    return (
      <Link href="/user">
        <a>
          <SignupButton />
        </a>
      </Link>
    );
  };

  const ChangeUser = (props) => {
    return (
      <Link href="/user">
        <a>
          <Image
            src={changeUser}
            className="imgButton"
            width={35}
            height={35}
            alt="Alterar Usuário"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Clique para alterar seus dados."
          />
        </a>
      </Link>
    );
  };

  const Logout = () => {
    return (
      <a onClick={logout}>
        <Image
          src={sair}
          className="imgButton"
          width={35}
          height={35}
          alt="Sair do Sistema"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="Clique para sair do sitema e voltar à tela principal."
        />
      </a>
    );
  };

  const Login = () => {
    return (
      <Link href="/login">
        <a>
          <SigninButton />
        </a>
      </Link>
    );
  };

  const myMemory =  (event) => {
    if (event) event.preventDefault();
    if (userId)
    router.push("/mymemory");
    else router.push("/login?needlogin=true&r=/mymemory");

  };

  const logout =  (event) => {
    if (event) event.preventDefault();
    let logout = confirm("Você realmente deseja sair da aplicação?");
    if (!logout) return;

    fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then( async (json) => {
        console.log(json);
        setUserId(0);
        router.reload(window.location.pathname)
        // router.push("/");
      });
  };

  return (
    <div id="header">
      <nav
        id="nav"
        className="navbar navbar-expand-lg navbar-light navbar-default"
      >
        <div className="container-fluid">
          <Link href="/">
            <a>
              <Image src={logo} alt="Logo" width={220} height={45} />
            </a>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar"
            aria-controls="navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navbar" className="collapse navbar-collapse">
            {/* <ul className="nav navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a />
              </li>
            </ul> */}
            <ul className="nav navbar-nav ms-auto mb-2 mb-lg-0">
              <li
                className="nav-item pe-4 my-pt-4"
                style={{ marginTop: "13px" }}
              >
                <Link href="/">
                  <a>
                    <Image
                      src={home35}
                      className="imgButton"
                      alt="Home"
                      width={35}
                      height={35}
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="Clique para voltar à tela principal"
                    />
                  </a>
                </Link>
              </li>
              {group1 && (
                <li className="nav-item pe-4 my-pt-4">
                      <NewMemory />
                </li>
              )}

              {group2 && (
                <>
                  {userId ? (
                    <li className="nav-item pe-4 my-pt-4"  style={{ marginTop: "13px" }}>
                      <ChangeUser />
                    </li>
                  ) : (
                    <li className="nav-item pe-4 my-pt-4">
                      <Register />
                    </li>
                  )}
                </>
              )}

              {group3 && (
                <>
                  {userId ? (
                    <li className="nav-item pe-4 my-pt-4"  style={{ marginTop: "13px" }}>
                      <Logout />
                    </li>
                  ) : (
                    <li className="nav-item pe-4 my-pt-4">
                      <Login />
                    </li>
                  )}
                </>
              )}

              {/* {group3 && (
                <li className="nav-item pe-4 my-pt-4">
                  {userId ? <Logout /> : <Login />}
                </li>
              )} */}
            </ul>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .imgHome {
          vertical-align: middle;
          margin-left: 3px;
          margin-top: 10px;
          max-width: 100%;
        }

        .imgButton {
          vertical-align: middle;
          margin-left: 3px !important;
          max-width: 100%;
        }

        #nav {
          //height: 49px;
          z-index: 2098;
          box-shadow: 5px 3px 7px #b36b00;
          margin-top: 10px;
          margin-left: 10px;
          margin-right: 10px;
          background-color: ${variables.headercolor};
          border-radius: 3px;
          font-family: "Varela Round", sans-serif;
          font-size: 14px;
          z-index: 2098;
          box-shadow: 5px 3px 7px #b36b00;
        }

        .navbar {
          margin-top: 10px;
          margin-left: 10px;
          margin-right: 10px;
          background-color: ${variables.headercolor};
          border-radius: 3px;
          font-family: "Varela Round", sans-serif;
          font-size: 14px;
        }
        navlogo {
          margin-left: 20px;
        }
        .navbar-right {
          position: absolute;
          right: 0px;
          padding-right: 20px;
        }

        #navbar > ul > li > a,
        #homeDiv > li > a {
          /* color: #1609E8; */
          color: ${variables.logoB};
          font-weight: bold;

          &:hover {
            /* color: #1609E8; */
            color: darkorange;
            font-weight: bold;
            text-decoration: underline;
          }
        }

        .navbar-default {
          margin-top: 10px;
          margin-left: 10px;
          margin-right: 10px;
          background-color: $header-color;
          border-radius: 3px;
        }

        @media only screen and (max-device-width: 576px) {
          .my-pt-4 {
            margin-top: 1.5rem !important;
          }

           {
            /* #navbar {
            background-color: #f2dc82;
          } */
          }

          #navbar > ul > li {
            height: 50px;
          }

          #nav {
            padding-top: 2px;
          }

          #logoHeader {
            display: none;
          }

          #logoHeaderBrand {
            display: block;
          }

          #navbar > ul > li > a {
            padding-left: 10px;
          }

          .headerImg img {
            height: 32px;
          }

          .btnav {
            margin-left: 8px;
            margin-bottom: 0px;
          }
        }
      `}</style>
    </div>
  );
};
export default HeaderNav;
