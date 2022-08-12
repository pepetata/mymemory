//[label /pages/index.js]

import React, { useState, useEffect } from "react";
// import { CookiesProvider } from "react-cookie";
//import Head from 'next/head'
import Link from "next/link";
import Image from "next/image";
import Iron from "@hapi/iron";
import { getTokenCookie } from "../lib/auth-cookies";

import Layout from "../components/Layout";
import variables from "../styles/variables.module.scss";
import table30 from "../images/tables30.png";
import table_not30 from "../images/tables_not30.png";

const animationSinger = { duration: 5000, easing: (t) => t };
const animationArtist = { duration: 7000, easing: (t) => t };
const animationSoccer = { duration: 6000, easing: (t) => t };
const divStyle = { position: "relative", height: "300px" };
const server = process.env.SERVER;

const Index = (props) => {
  const [user] = useState(props.user);
  const [mymemory, setMyMemory] = useState(props.mymemory);
  const [showName, setShowName] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [forgetCount, setForgetCount] = useState(0);
  const [except, setExcept] = useState([props.mymemory?.id]);
  const [userId] = useState(props.user?.id);
  const size = useWindowSize();
  const [viewTable, setViewTable] = useState(true);
  console.log(
    "index size=",
    size,
    viewTable,
    typeof size.width,
    size.width > 620
  );
  console.log(
    "Index user=",
    user,
    "mymemory=",
    mymemory,
    "except=",
    except,
    "userid",
    userId
  );

  // Hook
  function useWindowSize() {
    // https://stackoverflow.com/questions/63406435/how-to-detect-window-size-in-next-js-ssr-using-react-hook
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== "undefined") {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount
    console.log("windowSize=", windowSize);
    // if (windowSize.width < 620) setViewTable(false)
    return windowSize;
  }

  const showResult = (e) => {
    console.log("showResult ====", showName);
    setShowName(true);
    setShowButtons(true);
  };

  const incCounter = (counter) => {
    console.log("incCounter", counter);
    setShowName(false);
    // setShowButtons(false);
    setShowName(false);
    switch (counter) {
      case "right":
        setRightCount(rightCount + 1);
        break;
      case "wrong":
        setWrongCount(wrongCount + 1);
        break;
      case "unknown":
        setUnknownCount(unknownCount + 1);
        break;
      case "forget":
        setForgetCount(forgetCount + 1);
        break;
    }
    getNext(except);
  };

  const getNext = async (except) => {
    try {
      // get mymemory
      const exceptStr = except + "";
      const res = await fetch(`/api/mymemory/getnext`, {
        method: "POST",
        body: JSON.stringify({
          except: exceptStr,
          user: userId ? user.id : 0,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      console.log("getNext  json=", json);

      setMyMemory(json);
      if (json.id) setExcept([...except, json.id]);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // displayErrorMsg(true, [error.message]);
    }
  };

  const startAgain = async () => {
    console.log("startAgain");
    setExcept([]);
    setForgetCount(0);
    setRightCount(0);
    setUnknownCount(0);
    setWrongCount(0);
    console.log("except=", except);
    getNext([]);
  };

  const hideMemory = async () => {
    console.log("hideMemory");
    if (!confirm("Tem certea que não quer mais ver esta memória?")) return;

    try {
      const res = await fetch(`/api/mymemory/hide`, {
        method: "POST",
        body: JSON.stringify({
          id: mymemory.id,
          user: userId,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      console.log(json);

      // getNext(except);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // displayErrorMsg(true, [error.message]);
    }
  };

  const toogleTable = (event) => {
    if (event) event.preventDefault();
    setViewTable(!viewTable);
  };

  const ShowQuiz = () => {
    return (
      <div id="showPic" className="text-center">
        {mymemory.link > "" && (
          <picture>
            <img
              src={mymemory.link || "/images/logobig.png"}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "/images/logobig.png";
              }}
              // className="img-fluid"
              className="picImg"
              // style={{mimHeight: '100%'}}
              alt="Foto"
              width={300}
              height={300}
              maxheight={300}
            />
          </picture>
        )}
        {mymemory.text > "" && (
          <div className="row">
            <div className="col-lg-4 col-xs-0"></div>
            <div className="col-lg-4 col-xs-0">
              <br />
              <p>{mymemory.text}</p>
            </div>
          </div>
        )}
        <br />
        <br />
        <style global jsx>{`
          .picImg {
             {
              /* width: 100%; */
            }
            height: 290px;
            object-fit: contain;
          }
          #showPic {
            display: block;
            width: 100%;
            height: 300px;
             {
              /* overflow: scroll; */
            }
          }
        `}</style>
      </div>
    );
  };

  const ShowResult = () => {
    console.log("ShowResult", showName);
    return (
      <div>
        <button
          type="button"
          className="btn btn-warning otbutton"
          onClick={showResult}
          title="Clique para mostrar mostrar o nome e os botões para indicar se acertou ou não"
        >
          Resposta
        </button>
        <input
          id="showNameInput"
          type="text"
          value={mymemory.name}
          readOnly
          className={showName ? "bold" : "transparent"}
          // style={{border: '0'}}
        />
        {mymemory.href && (
          <Link href={mymemory.href}>
            <a target="_blank">
              <button
                type="button"
                className="btn btn-light otbutton"
                title="Clique para ficar sabendo mais sobre a resposta."
                // onClick={openHref}
              >
                Saiba Mais
              </button>
            </a>
          </Link>
        )}
        <style global jsx>{`
          #showNameInput {
            background-color: ${variables.bgcolor};
            border: 0;
          }
          .transparent {
            color: transparent;
          }
        `}</style>
      </div>
    );
  };

  const ShowButtons = () => {
    console.log("ShowResult", showName);
    return (
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-success otbutton"
          onClick={() => incCounter("right")}
          title="Você acertou a resposta? Então clique aqui."
        >
          Acertei
        </button>
        <button
          type="button"
          className="btn btn-danger otbutton ms-3"
          onClick={() => incCounter("wrong")}
          title="Errou a resposta. Clique aqui."
        >
          Errei
        </button>
        <button
          type="button"
          className="btn btn-secondary otbutton ms-3"
          onClick={() => incCounter("unknown")}
          title="Clique se não conhece este tema."
        >
          Não sei
        </button>
        {userId && (
          <button
            type="button"
            className="btn btn-light otbutton ms-3"
            onClick={hideMemory}
            title="Clique se não quer mais ver esta memória."
          >
            Não mostre mais
          </button>
        )}
        <button
          className="btn btn-warning ms-3 pb-0"
          onClick={toogleTable}
          title="Clique para mostrar ou não mostrar as estatísticas"
        >
          <Image
            src={viewTable ? table_not30 : table30}
            className="imgButton ps-1"
            alt="Gravar"
            width={30}
            height={20}
          />
        </button>
      </div>
    );
  };

  const TableMobile = () => {   return (
    <div  className="text-start">
        <table style={{ margin: "0 auto", tableLayout: "fixed"}}>
          <tr>
            <td style={{width: "130px" }} >Mostrados: </td>
            <td style={{width: "50px" }} >{except.length - 1}</td>
            <td style={{width: "50px" }} ></td>
          </tr>
          <tr>
            <td>Acertos:</td>
            <td> {rightCount}</td>
            <td>
              {except.length === 1
                ? "-"
                : Math.trunc((rightCount / (except.length - 1)) * 100)}
              {except.length > 1 && "%"}
            </td>
          </tr>
          <tr>
            <td>Erros:</td>
            <td> {wrongCount}</td>
            <td>
              {except.length === 1
                ? "-"
                : Math.trunc((wrongCount / (except.length - 1)) * 100)}
              {except.length > 1 && "%"}
            </td>
          </tr>
          <tr>
            <td>Não conhecidos:</td>
            <td> {unknownCount}</td>
            <td>
              {except.length === 1
                ? "-"
                : Math.trunc((unknownCount / (except.length - 1)) * 100)}
              {except.length > 1 && "%"}
            </td>
          </tr>
          {userId && (
            <tr>
            <td>Não mostre:</td>
            <td> {forgetCount}</td>
            <td>
              {except.length === 1
                ? "-"
                : Math.trunc((forgetCount / (except.length - 1)) * 100)}
              {except.length > 1 && "%"}
            </td>
          </tr>              
          )}
        </table>
        </div>
      )}
      
  const ShowStatistics = () => {
    return (
      <div className="mt-3">
        {size.width < 620 ? (<TableMobile />) : (
          <table
            style={{ margin: "0 auto", tableLayout: "fixed", width: "600px" }}
          >
            <thead>
              <tr className="text-start">
                <th>Mostrados</th>
                <th>Acertos</th>
                <th>Erros</th>
                <th>Não conhecidos</th>
                {userId && <th>Não mostre</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{except.length - 1}</td>
                <td>{rightCount}</td>
                <td>{wrongCount}</td>
                <td>{unknownCount}</td>
                {userId && <td>{forgetCount}</td>}
              </tr>
              <tr>
                <td></td>
                <td>
                  {except.length === 1
                    ? "-"
                    : Math.trunc((rightCount / (except.length - 1)) * 100)}
                  {except.length > 1 && "%"}
                </td>
                <td>
                  {except.length === 1
                    ? "-"
                    : Math.trunc((wrongCount / (except.length - 1)) * 100)}
                  {except.length > 1 && "%"}
                </td>
                <td>
                  {except.length === 1
                    ? "-"
                    : Math.trunc((unknownCount / (except.length - 1)) * 100)}
                  {except.length > 1 && "%"}
                </td>
                {userId && (
                  <td>
                    {except.length === 1
                      ? "-"
                      : Math.trunc((forgetCount / (except.length - 1)) * 100)}
                    {except.length > 1 && "%"}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        )}

        <style jsx>{`
          table td + td {
            border-left: 2px solid gray;
          }
          table th + th {
            border-left: 2px solid gray;
          }
        `}</style>
      </div>
    );
  };

  const ShowMemory = () => {
    console.log("ShowMemory viewTable=", viewTable);
    // setViewTable(size.width > 620)
    // incluir texto
    // api/robot para pegar mais
    return (
      <>
        <div className="text-center">
          {"id" in mymemory ? (
            ""
          ) : (
            <>
              <br />
              <br />
              <br />
              <br />
              <h3 className="h4 red">
                UAU ! Você viu tudo que tínhamos para mostrar.
              </h3>
              <h4 className="h5">Crie mais memórias para seu treino.</h4>
              <br />
              <button
                type="button"
                className="btn btn-warning otbutton"
                onClick={startAgain}
              >
                Começar de novo
              </button>
              <br />
              <br />
              <br />
              <br />
              <br />
            </>
          )}
          {"id" in mymemory && (
            <>
              <ShowQuiz /> <ShowResult />
            </>
          )}
          {viewTable && <ShowStatistics />}
          {"id" in mymemory && <ShowButtons />}
        </div>
      </>
    );
  };

  const PageContent = (
    <div className="text-center">
      <br />
      <h1 className="h3">Exercite sua Memória</h1>
      <br />
      <h2 className="h5">Veja se você se lembra do que mostramos abaixo:</h2>
      {"id" in user ? (
        ""
      ) : (
        <p className="red fs-6 bold">
          Estamos apenas mostrando memórias gerais. Se quiser exercitar com suas
          próprias memórias, cadastre-se e faça o login!!
        </p>
      )}
      <br />
      <ShowMemory />
    </div>
  );

  return (
    <>
      <Layout
        title="Memoria Test"
        content={PageContent}
        user={props.user}
        group1={true}
        group2={true}
        group3={true}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  // get user
  const TOKEN_SECRET = process.env.SECRET_COOKIE_PASSWORD;
  let user = {};
  const token = getTokenCookie(context.req);
  console.log("index - getServerSideProps  token=", token);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
    console.log("index - getServerSideProps  session=", session);
    user = session;
  }

  // get mymemory
  const res = await fetch(`${server}/api/mymemory/getnext`, {
    method: "POST",
    body: JSON.stringify({
      except: "0",
      user: user?.id ? user.id : 0,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const mymemory = await res.json();
  console.log("index - getServerSideProps  mymemory=", mymemory);
  console.log("index - getServerSideProps  user=", user);

  return {
    props: { user, mymemory }, // will be passed to the page component as props
  };
}

export default Index;

// nao vou usar o react-bootstrap pois o rendering é feito no cliente
// vou usar SSR - Server SIde Rendering e Static-site Generation (SSG) qdo possivel
// senao, uso SPA's (Single Page Application) em outros casos
//import {Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
