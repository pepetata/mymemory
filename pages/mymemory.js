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


import view_not30 from "../images/view_not30.png";
import ReturnButton from "../containers/ReturnButton";
import DeleteButton from "../containers/DeleteButton";
import AddMemoryButton from "../containers/AddMemoryButton";

const newMyMemory = {
  id: 0,
  name: "",
  text: "",
  link: "",
  href: "",
  private: false,
  user: 0,
  picture: "",
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
  const name = useRef()
  const [showImg, SetShowImg] = useState(false);
  const [changed, setChanged] = useState(false);
  const [oldName, setOldName] = useState("");
  const [myFile, setMyFile] = useState({ selectedFile: null });
  const [newImage, setNewImage] = useState(
    mymemory.picture ? mymemory.picture : ""
  );

//  console.log("MyMemory mymeory=", mymemory);

  useEffect(() => {
    if (!props.user?.id > 0) router.push("/login?needlogin=true&r=/mymemory");
    // console.log("Feed useEffect");
  });

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
//    console.log("validateData", mymemory, mm.name.trim() == "");
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

//    console.log("formerrors", formErrors);
    if (errors.length) {
      setFormErrors(errors);
      SetShowError({ display: "block" });
      return true;
    }

    return false;
  };

  const saveMyMemory = async (event) => {
//    console.log("idRef.current.value   ====", idRef.current.value);
    if (event) event.preventDefault();
    displayErrorMsg(false);
    setShowMsg(false);

    // validate data
    const mm = mymemory;
    if (validateData(mm)) return;

    // sanitize inputs
    mm.name = titleCase(mm.name.trim());
    mm.newImage = newImage;
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
//    console.log("saveMyMemory json==================================", json);
//    console.log("idRef.current.value", idRef.current.value);
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
        setNewImage("");
        setFormMsgs([{ msg: "Sua nova memória foi gravada com sucesso." }]);
      }
      setMyMemory({
        ...mymemory,
        id: json.id,
        picture: json.picture,
        newImage: "",
      });
      setNewImage("");
      setMyFile({ selectedFile: null });
      setShowMsg(true);
      setChanged(false);
      await sleep(3);
      setShowMsg(false);
    }
  };

  const deleteMyMemory = async (event) => {
//    console.log("deleteMyMemory   ====");
    if (event) event.preventDefault();
    displayErrorMsg(false);
    setShowMsg(false);

    if (!confirm("Você realmente deseja apagar esta memória?")) return;
    const res = await fetch("/api/mymemory/delete", {
      method: "POST",
      body: JSON.stringify({ data: mymemory.id }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
//    console.log("deleteMyMemory json==================================", json);
    if (json.errors) {
      setFormErrors(json.errors);
      SetShowError({ display: "block" });
    } else {
      SetShowError({ display: "none" });
      // save/update new user id
      setFormMsgs([{ msg: "Sua memória foi apagada com sucesso." }]);
      setMyMemory(newMyMemory);
      setNewImage("");
      setMyFile({ selectedFile: null });
      setShowMsg(true);
      await sleep(3);
      setShowMsg(false);
      setChanged(false);
    }
  };

  const findName = async (event) => {
//    console.log("findName", mymemory);
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
//    console.log(json);
    if ("id" in json) {
//      console.log("achou a memoria", json);
      setMyMemory(json);
      setNewImage(json.picture);
    }
  };

  const newMemory = (e) => {
    e.preventDefault();
    if (changed) {
      if (
        !confirm(
          "Você ainda não gravou suas últimas alterações! Deseja realmente começar outra memória?"
        )
      )
        return;
    }
    setMyMemory(newMyMemory);
    setChanged(false)
    document.getElementById("name").focus();
    name.current.focus();
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
//    console.log("changed");
    router.push("/");
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

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    setMyFile({ selectedFile: event.target.files[0] });
    onFileUpload(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = async (file) => {
//    console.log("onFileUpload  =myFile.selectedFile", myFile.selectedFile);
    // Create an object of formData
    const formData = new FormData();
    // formData.append("data", JSON.stringify(content));
    // formData.append("profile_picture", e.target.files[0]);
    // Update the formData object
    formData.append("myFile", file);
    formData.append("user", JSON.stringify(props.user.id));

    // Details of the uploaded file

    try {
      // Request made to the backend api
      // Send formData object
      const res = await fetch("/api/mymemory/file", {
        method: "PUT",
        body: formData,
        // headers: { "Content-Type": "multipart/form-data" },
      });
      const json = await res.json();
//      console.log(
//        "onFileUpload res==========================",
//        json.result.file
//      );
      setNewImage(json.result.file);
      // if (json.errors) {
      //   setFormErrors(json.errors);
      //   SetShowError({ display: "block" });
      // } else {
      //   SetShowError({ display: "none" });
      //   // save/update new user id
      //   if (idRef.current.value > 0) {
      //     //update
      //     setFormMsgs([{ msg: "Seus dados foram alterados com sucesso." }]);
      //   } else {
      //     //idRef.current.value = json.id;
      //     setMyMemory({ ...mymemory, id: json.id });
      //     setFormMsgs([{ msg: "Sua nova memória foi gravada com sucesso." }]);
      //   }
      //   setShowMsg(true);
      //   await sleep(3);
      //   setShowMsg(false);
      //   setChanged(false);
      // }
    } catch (error) {
//      console.log("onFileChange error", error);
    }
  };

  const ShowPicture = () => {
//    console.log("mymemory.link", mymemory.link);
    if (mymemory.link == "") return "";
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

  const ShowLocalPicture = () => {
//    console.log(
//      "ShowLocalPicture picture=",
//      mymemory.picture,
//      "newImage",
//      newImage
//    );
    if (!mymemory.picture && !newImage) return "";
    else
      return (
        <div className="text-center">
          <picture>
            <img
              src={newImage ? newImage : mymemory.picture}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "/images/logobig.png";
              }}
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
    if (mymemory.href && mymemory.href.search(/http[s]:\/\//) > -1)
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
    <div   className="container">
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
              <label className="form-label bold">Resposta</label>
              <input
                key="11"
                type="text"
                id="name"
                ref={name}
                value={mymemory.name}
                required
                maxLength="100"
                className="form-control form-control-sm"
                onChange={handleChange}
                onBlur={findName}
              />
              <div className="form-text">
                Está é a resposta que vai ser mostrada para conferir se a pessoa
                realmente acertou.
              </div>
            </div>
            <div className="mb-3">
              <br />
              <label className="form-label bold">Texto</label>
              <input
                key="110"
                type="text"
                id="text"
                value={mymemory.text}
                maxLength="150"
                className="form-control form-control-sm"
                onChange={handleChange}
              />
            <div className="form-text">
              Se não for usar uma foto, escreva um texto com uma pergunta, ou
              então alguma informação completamentar à foto.
            </div>
            </div>
            <div className="mb-3">
              <br />
              <label className="form-label bold">Foto na Internet</label>
              <input
                key="12"
                type="text"
                id="link"
                value={mymemory.link}
                required=""
                aria-describedby="link_Help"
                maxLength="250"
                className="form-control form-control-sm"
                onChange={handleChange}
                placeholder="https://xxxxx.com/yyyy.jpeg"
              />
              <div id="link_Help" className="form-text">
                Informe o endereço de internet onde podemos encontrar a foto de
                sua memoria. o endereço internet deve começar com http://.
                Exemplo:
                https://placar.abril.com.br/wp-content/uploads/2021/09/alx_esporte-futebol-memoria-pele-20140501-03_original.jpeg
              </div>
            </div>

            <ShowPicture />

            <div className="mb-3">
              <br />
              <label className="form-label bold">
                Foto no seu computador/telefone&nbsp;&nbsp;
              </label>
              <input
                key="120"
                type="file"
                accept="image/*"
                id="file"
                // value={mymemory.link}
                // required=""
                aria-describedby="file_Help"
                // maxLength="250"
                // className="form-control form-control-sm"
                onChange={onFileChange}
                // placeholder="https://xxxxx.com/yyyy.jpeg"
              />
              <div id="file_Help" className="form-text">
                Informe uma foto de sua memória que se encontra em seu
                computador ou telefone celular.
              </div>
            </div>
{/* <!--            {myFile.selectedFile &&
              console.log("myFile.selectedFile", myFile.selectedFile)}--> */}

            <ShowLocalPicture />

            <div className="mb-3">
              <br />
              <label className="form-label bold">Referência</label>
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
              <div id="href_Help" className="form-text">
                Informe o endereço de internet onde podemos encontrar uma
                matéria sobre sua memoria. o endereço internet deve começar com
                http://. Exemplo: https://pt.wikipedia.org/wiki/Pelé
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
                aria-describedby="private_Help"
              />
              <label htmlFor="private" className="form-check-label">
                <strong>Privado</strong>
              </label>
              <div id="private_Help" className="form-text">
                Selecione caso esta memória seja uma situação particular sua
                (parentes, amigos, etc). Se não selecionar aqui, esta memória
                será mostrada para outras pessoas.
              </div>
            </div>

            <br />
            <br />
          </form>

          <div className="row text-center">
            <div className="col-lg-0 col-xs-0"></div>
            <div className="col-lg-3 col-xs-4">
              <SaveButton fun={saveMyMemory} />
            </div>
            <div className="col-lg-3 col-xs-4">
            <AddMemoryButton fun={newMemory} />
              {/* <button className="btn btn-warning otbutton" onClick={newMemory}>
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
              </button> */}
            </div>
            <div className="col-lg-3 col-xs-4">
              <DeleteButton action={deleteMyMemory} active={mymemory.id} />
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
//  console.log("index - getServerSideProps  token=", token);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
//    console.log("index - getServerSideProps  session=", session);
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
