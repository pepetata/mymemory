import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
// import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Iron from "@hapi/iron";
import validator from "validator";

import { getTokenCookie } from "../lib/auth-cookies";
import { sleep, titleCase } from "../lib/common";

import Layout from "../components/Layout";
import SaveButton from "../containers/SaveButton";

import logo from "../images/logo20.png";
import view_not30 from "../images/view_not30.png";
import ReturnButton from "../containers/ReturnButton";

const newMyMemory = {
  id: 0,
  name: "",
  link: "",
  href: "",
  private: false,
  user: 0,
};

const MyMemory = (props) => {
  // const [cookies, setCookie] = useCookies(["midu", "midt"]);
  const [mymemory, setMyMemory] = useState(newMyMemory);
  const [showError, SetShowError] = useState({ display: "none" });
  const [formErrors, setFormErrors] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [formMsgs, setFormMsgs] = useState(null);
  const router = useRouter();
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const [showImg, SetShowImg] = useState(false);
  const [changed, setChanged] = useState(false);
  const [oldName, setOldName] = useState("");

  console.log('MyMemory', props, props.user?.id>0)

  useEffect(() => {
    if (!props.user?.id > 0 ) router.push("/login?needlogin=true&r=/mymemory");
    // console.log("Feed useEffect");
  }, [props]);

  const displayErrorMsg = (val) => {
    if (val) SetShowError({ display: "block" });
    else SetShowError({ display: "none" });
  };

  const ShowError = (
    <div
      role="alert"
      id="error-group"
      style={showError}
      className="alert alert-danger"
    >
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
              return <li key={idx}>{e.msg}</li>;
            })
          : null}
      </ul>
    </div>
  );

  const ShowMsg = (
    <div
      role="alert"
      id="error-group"
      style={showMsg ? { display: "block" } : { display: "none" }}
      className="alert alert-danger"
    >
      <ul id="msgs">
        {formMsgs
          ? formMsgs.map((e, idx) => {
              return <li key={idx}>{e.msg}</li>;
            })
          : null}
      </ul>
    </div>
  );

  const validateData = (mm) => {
    const errors = [];
    console.log("validateData", mymemory, mm.name.trim() == "");
    if (mm.name.trim() == "") {
      errors.push({ msg: "Informe o nome da memória." });
    }

    if (mm.link.trim())
      if (!validator.isURL(mm.link.trim(), { protocols: ["http", "https"] })) {
        errors.push({ msg: "O endereço da foto não é válido." });
      }

    if (mm.href.trim())
      if (!validator.isURL(mm.href.trim(), { protocols: ["http", "https"] })) {
        errors.push({ msg: "O endereço da referência não é válido." });
      }

    console.log("formerrors", formErrors);
    if (errors.length) {
      setFormErrors(errors);
      SetShowError({ display: "block" });
      return true;
    }

    return false;
  };
  
  const saveMyMemory = async (event) => {
    console.log('idRef.current.value   ====',idRef.current.value)
    if (event) event.preventDefault();
    displayErrorMsg(false);
    setShowMsg(false);

    // validate data
    const mm = mymemory;
    if (validateData(mm)) return;

    // sanitize inputs
    mm.name = titleCase(mm.name.trim());
    validator.escape(mm.name.trim());
    // mm.link=encodeURI(mm.link)
    // mm.href=encodeURI(mm.href)
    // validator.toBoolean(mm.private)

    const res = await fetch("/api/mymemory/save", {
      method: "POST",
      body: JSON.stringify({ data: mm, user: props.user }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    console.log('idRef.current.value',idRef.current.value)
    if (json.errors) {
      setFormErrors(json.errors);
      SetShowError({ display: "block" });
    } else {
      SetShowError({ display: "none" });
      // save/update new user id
      if (idRef.current.value > 0) {
        //update
        setFormMsgs([{ msg: "Seus dados foram alterados com sucesso." }]);
      } else {
        //idRef.current.value = json.id;
        setMyMemory({...mymemory, id: json.id});
        setFormMsgs([{ msg: "Sua nova memória foi gravada com sucesso." }]);
      }
      setShowMsg(true);
      await sleep(3);
      setShowMsg(false);
      setChanged(false);
    }
  };

  const findName = async (event) => {
    console.log("findName", mymemory);
    // do not try to find if no change on name or empty
    if (mymemory.name === oldName && mymemory.name === "") return;
    setOldName = mymemory.name;
    if (event) event.preventDefault();
    const res = await fetch("/api/mymemory/name", {
      method: "POST",
      body: JSON.stringify({ name: mymemory.name, user: props.user?.id }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    console.log(json);
    if ("id" in json) {
      console.log("achou a memoria", json);
      setMyMemory(json);
    }
  };

  const newMemory = (e) => {
    e.preventDefault();
    if (changed) {
      if (
        !confirm(
          "Você ainda não gravou suas últimas alterações. Deseja realmente começar outra memória?"
        )
      )
        return;
    }
    setMyMemory(newMyMemory);
  };

  const goBack = (e) => {
    e.preventDefault();
    if (changed) {
      if (
        !confirm(
          "Você ainda não gravou suas últimas alterações. Deseja realmente sair?"
        )
      )
        return;
    }
    console.log("changed");
    router.back();
  };

  const handleChange = (event) => {
    setChanged(true);
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const id = event.target.id;
    setMyMemory({ ...mymemory, [id]: value });
    if (id === "link") {
      SetShowImg(true);
    }
  };

  const ShowPicture = () => {
    console.log('mymemory.link',mymemory.link)
    if (mymemory.link == "") return "" 
    else
    return (
      <div className="text-center">
        <p>A foto será mostrada aqui caso seja encontrada:</p>
        <picture>
          <img
            src={mymemory.link || "/images/logobig.png"}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/images/logobig.png";
            }}
            // onError={SetShowImg(false)}
            // onError={e => {
            //   console.log(e.onerror)
            //   // "this.onerror=null;this.src='http:localhost:3000/images/logobig.png'"
            // }}
            className="img-fluid"
            alt="Foto"
            width={300}
            height={200}
          />
        </picture>
        <br />
        <br />
        <br />
      </div>
    );
  };

  const ShowRef = () => {
    if (mymemory.href)
      return (
        <div className="text-center">
          <br />
          <p>Esta é a referência informada:</p>
          <iframe src={mymemory.href} width="100%" height="300"></iframe>
          <br />
          <br />
          <br />
        </div>
      );
    else return "";
  };

  const MyMemoryContent = (
      <div id="userDiv" className="container">
        <div className="row">
          <div className="col-lg-2 col-xs-0"></div>
          <div className="col-lg-8 col-xs-12">
            <br />
            <br />
            {/* <h1 className="h4">Informe seus dados:</h1>
          <br /> */}

            {/* {error ? ShowError : DontShowError} */}

            <form id="myForm">
              <input
                type="text"
                ref={idRef}
                id="id"
                value={mymemory.id}
                className="d-none"
                onChange={handleChange}
                key="10"
              />
              <div className="mb-3">
                <label className="form-label">Resposta</label>
                <input
                  key="11"
                  type="text"
                  id="name"
                  value={mymemory.name}
                  required
                  maxLength="100"
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  onBlur={findName}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Texto</label>
                <input
                  key="110"
                  type="text"
                  id="text"
                  value={mymemory.text}
                  maxLength="150"
                  className="form-control form-control-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Foto</label>
                <input
                  key="12"
                  type="text"
                  id="link"
                  ref={nameRef}
                  value={mymemory.link}
                  required=""
                  aria-describedby="link_Help"
                  maxLength="250"
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  placeholder="https://xxxxx.com/yyyy.jpeg"
                />
                <div id="link_Help" className="form-text">
                  Informe o endereço de internet onde podemos encontrar a foto
                  de sua memoria. o endereço internet deve começar com http://.
                  Exemplo:
                  https://placar.abril.com.br/wp-content/uploads/2021/09/alx_esporte-futebol-memoria-pele-20140501-03_original.jpeg
                </div>
              </div>

              <ShowPicture />

              <div className="mb-3">
                <label className="form-label">Referência</label>
                <input
                  key="13"
                  type="text"
                  id="href"
                  value={mymemory.href}
                  onChange={handleChange}
                  required=""
                  aria-describedby="href_Help"
                  maxLength="250"
                  className="form-control form-control-sm"
                  placeholder="https://xxxxx.com/yyyy"
                />
                <div id="email_Help" className="form-text">
                  Informe o endereço de internet onde podemos encontrar uma
                  matéria sobre sua memoria. o endereço internet deve começar
                  com http://. Exemplo: https://pt.wikipedia.org/wiki/Pelé
                </div>
              </div>
              <ShowRef />

              <div className="mb-3 form-check">
                <input
                  key="14"
                  type="checkbox"
                  id="private"
                  value={mymemory.private}
                  checked={mymemory.private}
                  // defaultChecked={true}
                  className="form-check-input form-check-input-sm"
                  onChange={handleChange}
                />
                <label htmlFor="private" className="form-check-label">
                  <strong>Privado</strong>: Selecione caso esta memória seja uma
                  situação particular sua (parentes, amigos, etc). Caso não
                  selecione aqui, esta memória poderá ser mostrada para outras
                  pessoas.
                </label>
              </div>

              <br />
              <br />
            </form>

            <div className="row text-center">
              <div className="col-lg-1 col-xs-0"></div>
              <div className="col-lg-3 col-xs-4">
                <SaveButton fun={saveMyMemory} />
              </div>
              <div className="col-lg-3 col-xs-4">
                <button
                  className="btn btn-warning otbutton"
                  onClick={newMemory}
                >
                  <span style={{ position: "relative", bottom: "5px" }}>
                    Nova Memória
                  </span>
                  <Image
                    src={logo}
                    className="imgButton ps-2"
                    alt="Nova Memória"
                    width={30}
                    height={20}
                  />
                </button>
              </div>
              <div className="col-lg-3 col-xs-4">
                <ReturnButton action={goBack} />
              </div>
            </div>
            {ShowError}
            {ShowMsg}
          </div>

          <div className="col-lg-2 col-xs-0"></div>
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
        title="Minha Memória"
        content={MyMemoryContent}
        user={props.user}
        group1={false}
        group2={false}
        group3={false}
      />
    </React.StrictMode>
  );
};

export async function getServerSideProps(context) {
  const TOKEN_SECRET = process.env.SECRET_COOKIE_PASSWORD;
  let user = {
    accept: false,
    agreement: true,
    email: "",
    full_name: "",
    id: "",
    nickname: "",
    pw: "",
  };

  const token = getTokenCookie(context.req);
  console.log("index - getServerSideProps  token=", token);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
    console.log("index - getServerSideProps  session=", session);
    user = session;
    user.agreement = true;
  }

  if (user.accept_emails === "0") user.accept = false;
  else user.accept = true;

  user.oldPW = user.pw;
  user.oldemail = user.email;
  user.changePW = false;
  user.changeEmail = false;

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default MyMemory;
