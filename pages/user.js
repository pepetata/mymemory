import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
// import { useCookies } from "react-cookie";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Iron from "@hapi/iron";

// import useUser from '../lib/useUser'
import { getTokenCookie } from "../lib/auth-cookies";
import Layout from "../components/Layout";
import SaveButton from "../containers/SaveButton";

import view30 from "../images/view30.png";
import view_not30 from "../images/view_not30.png";
import ReturnButton from "../containers/ReturnButton";

const UserPage = (props) => {
  // const [cookies, setCookie] = useCookies(["midu", "midt"]);
  const [user, setUser] = useState(props.user);
  const [showError, SetShowError] = useState({ display: "none" });
  const [formErrors, setFormErrors] = useState(null);
  const [viewPW, setViewPW] = useState(false);
  const router = useRouter();
  const idRef = useRef(null);
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  // useUser()

  let subtitle;

  useEffect(() => {
    // console.log("userPage - dentro do useEffect");
    // // setUser({ ...user, accept: true });
    // loadUser();
    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement("#userDiv");
    // oldEmail = props.user.email;
    // oldPW = props.user.pw;
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

  const saveUser = async (event) => {
    if (event) event.preventDefault();
    displayErrorMsg(false);
    var changedEmail = false;
    if (emailRef.current.value != user.oldemail &&  idRef.current.value != "") {
      changedEmail = confirm(
        "Voc?? alterou um email que estava confirmado, nesse caso vai precisar confirmar novamente. Confirma a altera????o do email?"
      );
      if (!changedEmail) return;
    }
    const pwWasChanged = pwRef.current.value !== user.oldPW && idRef.current.value !== ""
    // await setUser(previousState => {
    //   return { ...previousState, changePW: pwWasChanged }
    // });
    // setUser({ ...user, changeEmail: changedEmail, changePW: pwWasChanged });
    // setUser({
    //   ...user,
    //   changePW: pwWasChanged,
    // });
    // console.log(
    //   "saveuser",
    //   pwWasChanged,
    //   pwRef.current.value,
    //   user.oldPW,
    //   user
    // );
    // console.log('agora changepw=', user.changePW,pwWasChanged)
    const data = user
    data.changePW= pwWasChanged
    data.changeEmail = changedEmail
    const res = await fetch("/api/user/save", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.errors) {
      setFormErrors(json.errors);
      SetShowError({ display: "block" });
    } else {
      sessionStorage.setItem("user", JSON.stringify({ user }));
      SetShowError({ display: "none" });
      // save/update new user id
      if (idRef.current.value) {
        //update
        alert("Seus dados foram alterados com sucesso.");
      } else {
        idRef.current.value = json.id;
        alert(
          "Parab??ns!! Seu registro foi feito com sucesso. Ainda falta confirmar seu email. Leia a pr??xima tela com aten????o ..."
        );
        router.push("/welcome");
        // window.location.href = "/user/welcome?id=" + data.id;
      }
    }
  };

  const tooglePW = (event) => {
    if (event) event.preventDefault();
    setViewPW(!viewPW);
  };

  const handleChange = (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const id = event.target.id;
    setUser({ ...user, [id]: value });
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "blue";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // height: '80vh',
      overflow: "auto",
      Zindex: "3000",
      // "tabin/dex": "-1",
      overflowX: "hidden",
      overflowY: "hidden",
    },
  };

  const pageContent = (
    <div id="userDiv" className="container">
      <div className="row">
        <div className="col-lg-2 col-xs-0"></div>
        <div className="col-lg-8 col-xs-12">
          <br />
          <br />
          <h1 className="h4">Informe seus dados:</h1>
          <br />

          {/* {error ? ShowError : DontShowError} */}

          <form id="myForm">
            <input
              type="text"
              ref={idRef}
              id="id"
              value={user.id}
              className="d-none"
              onChange={handleChange}
            />
            <div className="mb-3">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                id="full_name"
                value={user.full_name}
                required=""
                maxLength="100"
                className="form-control form-control-sm"
                autoComplete="name"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Apelido</label>
              <input
                type="text"
                id="nickname"
                value={user.nickname}
                required=""
                aria-describedby="nickname_Help"
                maxLength="45"
                className="form-control form-control-sm"
                autoComplete="nickname"
                onChange={handleChange}
              />
              <div id="nickname_Help" className="form-text">
                Como voce quer ser chamado em nosso sistema?
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Correio Eletr??nico</label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={handleChange}
                ref={emailRef}
                required=""
                aria-describedby="email_Help"
                maxLength="150"
                className="form-control form-control-sm"
                autoComplete="email"
              />
              <div id="email_Help" className="form-text">
                N??s nunca iremos compartilhar seu email com ningu??m.
              </div>
            </div>
            <div className="mb-3 input-group">
              <label className="input-group">Senha</label>
              <input
                type={viewPW ? "text" : "password"}
                id="pw"
                value={user.pw}
                ref={pwRef}
                aria-describedby="passwordHelpBlock"
                maxLength="20"
                className="form-control form-control-sm"
                autoComplete="current-password"
                onChange={handleChange}
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
                    style={{ zIndex: "3" }}
                  />
                </button>
              </span>
              <div id="passwordHelpBlock" className="form-text">
                Use no m??nimo 4 caracteres. Sua senha estar?? segura com a gente.
                Mesmo assim recomendamos usar uma senha diferente das outras que
                j?? possui. Depois de informada sua senha, n??o vamos mostr??-la
                para sua seguran??a.
              </div>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="accept"
                value={user.accept}
                checked={user.accept}
                // defaultChecked={true}
                className="form-check-input form-check-input-sm"
                onChange={handleChange}
              />
              <label htmlFor="accept" className="form-check-label">
                Aceito receber emails do Memoria Test
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="agreement"
                value={user.agreement}
                checked={user.agreement}
                className="form-check-input form-check-input-sm"
                onChange={handleChange}
              />
              <label htmlFor="agreement" className="form-check-label">
                Li e concordo com os termos do Acordo de Usu??rios
              </label>
            </div>
            <div className="mb-3">
              <a onClick={openModal}>
                Clique aqui para ler o Acordo de Usu??rios
              </a>
            </div>
          </form>

          <div className="row text-center">
            <div className="col-lg-3 col-xs-0"></div>
            <div className="col-lg-3 col-xs-4">
              <SaveButton fun={saveUser} />
            </div>
            <div className="col-lg-3 col-xs-4">
              <ReturnButton
                action={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              />
            </div>
          </div>
          {ShowError}
        </div>

        <div className="col-lg-2 col-xs-0"></div>
      </div>

      <style jsx>{`
        .privacyTitle {
          font-weight: 600;
          color: #1650a1;
        }
      `}</style>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={modalStyles}
          contentLabel="Example Modal"
        >
          <h4 ref={(_subtitle) => (subtitle = _subtitle)}>
            {" "}
            Acordo de Usu??rios
          </h4>

          <div className="modal-dialog">
            <div className="modal-content">
              <div
                style={{ height: "50vh", overflow: "auto" }}
                className="modal-body"
              >
                <p>
                  1. Ao utilizar o site de qualquer forma, incluindo, por??m n??o
                  limitando, a visita ou navega????o pelo site, voc?? concorda com
                  este Acordo do Usu??rio e todas as outras normas, pol??ticas e
                  procedimentos operacionais que poder??o ser publicados de
                  tempos em tempos no site, sendo que cada um deles ??
                  incorporado por refer??ncia e cada um deles poder?? ser
                  atualizado de tempos em tempos sem aviso pr??vio.
                </p>
                <p>
                  2. Esteja certo de que os servi??os do site est??o sujeitos a
                  termos e condi????es adicionais especificada por n??s de tempos
                  em tempos; o seu uso de tais servi??os est?? sujeito a esses
                  termos e condi????es adicionais, os quais s??o incorporados neste
                  Acordo do Usu??rio por esta refer??ncia.
                </p>
                <p>
                  3. Este Acordo do Usu??rio se aplica a todos os usu??rios dos
                  servi??os, incluindo, por??m n??o limitando, os usu??rios que s??o
                  contribuidores de conte??do, informa????es e outros materiais ou
                  servi??os, registrados ou n??o.
                </p>
                <p>
                  4. AVISO DE ARBITRAGEM E REN??NCIA ?? A????O DE COLETIVA: COM
                  EXCE????O DE ALGUNS TIPOS DE DISPUTAS DESCRITAS NA SE????O DE
                  ARBITRAGEM ABAIXO, VOC?? CONCORDA QUE AS DISPUTAS ENTRE VOC?? E
                  N??S SER?? RESOLVIDA POR CONTRATO, ARBITRAGEM INDIVIDUAL E,
                  DESSA FORMA, RENUNCIA AO SEU DIREITO DE PARTICIPAR EM UM
                  PROCESSO DE A????O COLETIVA OU ARBITRAGEM PARA TODA A CLASSE.
                </p>
                <p></p>
                <p>
                  <strong>Elegibilidade</strong>
                </p>
                <p>
                  Voc?? reconhece e garante que tem pelo menos 18 anos de idade.
                  Se voc?? tiver menos de 18, n??o poder??, sob qualquer
                  circunst??ncias ou por qualquer motivo, usar os servi??os.
                  Poderemos, segundo nossa discri????o exclusiva, recusar a oferta
                  dos servi??os para qualquer pessoa ou entidade e alterar seu
                  crit??rio de elegibilidade a qualquer momento. Voc?? ?? o ??nico
                  respons??vel para garantir que este Acordo do Usu??rio esteja em
                  conformidade com todas as leis, normas e regulamentos
                  aplic??veis a voc?? e o direito de acessar os servi??os ??
                  revogado onde este Acordo do Usu??rio ou uso dos servi??os seja
                  proibido ou que a oferta, venda ou provis??o estendida dos
                  servi??os esteja em conflito com quaisquer leis, normas ou
                  regulamentos aplic??veis. Al??m disso, os servi??os s??o
                  oferecidos apenas para seu uso, e n??o para o uso ou benef??cios
                  de terceiros.
                </p>
                <p></p>
                <p>
                  <strong>Conte??do</strong>
                </p>
                <p>
                  <strong>Defini????o.</strong> Para fins deste Acordo do Usu??rio,
                  o termo ???Conte??do??? inclui, sem limita????es, informa????es, dados,
                  textos, fotografias, v??deos, clips de ??udio, postagens
                  escritas, artigos, coment??rios, software, scripts, gr??ficos e
                  recursos interativos gerados, fornecidos ou mesmo acess??veis
                  nos servi??os ou atrav??s destes. Para fins deste Acordo, o
                  ???Conte??do??? tamb??m inclui todo o Conte??do do Usu??rio (como
                  definido abaixo).
                </p>
                <p>
                  <strong>Conte??do do Usu??rio.</strong> Todo o Conte??do
                  adicionado, criado, uploaded, submetido, distribu??do ou
                  postado para o site pelos usu??rios (coletivamente ???Conte??do do
                  Usu??rio???), seja postado publicamente ou transmitido
                  privadamente, ?? responsabilidade exclusiva da pessoa que
                  originou tal Conte??do do Usu??rio. Voc?? reconhece que todo
                  Conte??do do Usu??rio fornecido por voc?? ?? preciso, completo,
                  atualizado e em conformidade com todas as leis, normas e
                  regulamenta????es aplic??veis. Voc?? reconhece que todo o
                  Conte??do, incluindo o Conte??do do Usu??rio, que voc?? acessou
                  usando os servi??os do site est?? por sua conta e risco e que ??
                  inteiramente respons??vel por qualquer dano ou perda a voc?? ou
                  qualquer outra pessoa que tenha resultado desta a????o. N??o
                  garantimos que qualquer Conte??do que voc?? acesse atrav??s do
                  site ?? preciso, ou continuar?? sendo.
                </p>
                <p>
                  <strong>Avisos e Restri????es.</strong> Os servi??os poder??o
                  conter Conte??do especificamente fornecido por n??s, nossos
                  parceiros ou nossos usu??rios e tal Conte??do ?? protegido pelos
                  direitos autorais, marcas registradas, marcas de servi??o,
                  patentes, segredos comerciais ou outro direitos e leis
                  propriet??rios. Voc?? dever?? cumprir e manter todos os avisos de
                  direitos autorais, informa????es e restri????es contidas em
                  qualquer Conte??do acessado pelos Servi??os.
                </p>
                <p>
                  <strong>Licen??a para Uso.</strong> Sujeito a este Acordo do
                  Usu??rio, concedemos a cada usu??rio dos Servi??os uma licen??a
                  mundial, n??o exclusiva, n??o sublicenci??vel e n??o transfer??vel
                  para usar (por exemplo, para fazer o download e mostrar
                  localmente) o Conte??do, uma vez que mantemos tais direitos,
                  exclusivamente para fins de uso dos Servi??os. O uso,
                  reprodu????o, modifica????o, distribui????o ou armazenagem de
                  qualquer Conte??do para outro uso al??m do uso dos servi??os, ??
                  expressamente proibido sem nossa permiss??o pr??via por escrito.
                  Voc?? n??o poder?? vender, licenciar, alugar ou at?? mesmo usar ou
                  explorar qualquer Conte??do para uso comercial ou de qualquer
                  forma a violar os direitos de terceiros.
                </p>
                <p>
                  <strong>Concess??o de Licen??a.</strong> Ao submeter o Conte??do
                  do Usu??rio atrav??s dos servi??os, voc??, por meio deste, nos
                  concede uma licen??a mundial, n??o exclusiva, perp??tua, sem
                  royalties, totalmente paga, sublicenci??vel e transfer??vel para
                  usar, editar, modificar, truncar, agregar, reproduzir,
                  distribuir, preparar os trabalhos derivativos, exibir,
                  realizar ou explorar por completo o Conte??do do Usu??rio em
                  conex??o com o Site, os Servi??os e nossos neg??cios (e os de
                  nossos sucessores e atribui????es), incluindo sem limita????o para
                  promover e redistribuir partes ou todo o Site ou Servi??os (e
                  trabalhos derivados deste) em qualquer formato de m??dia e
                  atrav??s de quaisquer canais de m??dia (incluindo, sem
                  limita????o, sites e feed de terceiros). Para fins de clareza, a
                  concess??o de licen??a precedente inclui nosso direito de
                  distribuir, exibir, realizar ou at?? mesmo usar o Conte??do do
                  Usu??rio em conex??o com o material fornecido pelos nossos
                  patrocinadores, e voc?? n??o ter?? o direito de receber qualquer
                  renumera????o por tal uso. Na medida em que qualquer Conte??do do
                  Usu??rio que voc?? submeta inclui seu nome, semelhan??a, voz ou
                  fotografia, voc?? reconhece e concorda que a licen??a precedente
                  desta Se????o 4(e) se aplica da mesma forma. Voc?? tamb??m, por
                  meio deste, far?? e conceder?? a cada usu??rio do Site e/ou dos
                  Servi??os uma licen??a n??o exclusiva e perp??tua para acessar seu
                  Conte??do do Usu??rio atrav??s do Site, e para usar, editar,
                  modificar, reproduzir, distribuir, preparar trabalhos
                  derivativos deste, exibir e realizar tal Conte??do do Usu??rio.
                  Para clareza, as concess??es de licen??as precedentes para n??s e
                  nossos usu??rios n??o afetam suas outras propriedades ou
                  direitos de licen??a em seu Conte??do do Usu??rio, incluindo o
                  direito de conceder licen??as adicionais para seu Conte??do do
                  Usu??rio, a menos que o contr??rio seja acordado por escrito.
                  Voc?? representa e garante que tem todos os direitos para
                  conceder tais licen??as para n??s sem infringir ou violar os
                  direitos de terceiros, incluindo sem limita????es, quaisquer
                  direitos de privacidade, direitos publicit??rios, direitos
                  autorais, marcas registradas, direitos de contatos ou qualquer
                  outra propriedade intelectual ou direitos propriet??rios.
                </p>
                <p>
                  A menos que o contr??rio seja acordado por escrito entre voc?? e
                  a Midiorama, voc?? n??o poder?? usar plataformas de terceiros,
                  al??m de seu pr??prio site na Internet ou suas pr??prias p??ginas
                  na m??dia social, para conectar ou distribuir o Conte??do do
                  Usu??rio.
                </p>
                <p>
                  <strong>Disponibilidade do Conte??do.</strong> N??o garantimos
                  que qualquer Conte??do ser?? disponibilizado no Site. Nos
                  reservamos no direito de, por??m n??o temos a obriga????o, (i)
                  remover, editar, modificar, ou mesmo manipular qualquer
                  Conte??do ?? nossa pr??pria discri????o, a qualquer hora, sem aviso
                  pr??vio e por qualquer motivo (incluindo, mas n??o limitando, no
                  recebimento de reivindica????es ou alega????es de terceiros ou
                  autoridades relacionadas com tal Conte??do ou se estivermos
                  preocupados de que voc?? tenha violado este Acordo do Usu??rio)
                  ou mesmo que n??o haja motivos e (ii) para remover ou bloquear
                  qualquer Conte??do dos Servi??os.
                </p>
                <p>
                  <strong>Regras de Conduta</strong>
                </p>
                <p>
                  Como condi????o de uso, voc?? promete n??o usar os servi??os para
                  qualquer fim que seja proibido por esses Termos de Uso. Voc?? ??
                  respons??vel por toda sua ativade em conex??o com os servi??os.
                </p>
                <p>
                  <strong>
                    Voc?? n??o poder?? (ou permitir?? que terceiros o fa??am)
                  </strong>{" "}
                  (a) tomar qualquer medida ou (b) fazer o upload, download,
                  postagem, submiss??o ou mesmo distribuir ou facilitar a
                  distribui????o de qualquer Conte??do no site ou pelos servi??os,
                  incluindo, sem limita????es, qualquer Conte??do do Usu??rio, que:
                </p>
                <p>
                  1. infrinja qualquer patente, marca registrada, segredo
                  comercial, direitos autoriais, direito de publicidade ou
                  outros direitos de qualquer pessoa ou entidade ou viole
                  qualquer lei ou dever contratual;
                </p>
                <p>
                  2. que voc?? saiba que ?? falso, enganador, mentiroso ou
                  impreciso;
                </p>
                <p>
                  3. seja contra a lei, amea??ador, abusivo, provocativo,
                  difamat??rio, caluniador, deceptivo, fraudulento, invasor da
                  privacidade de outros, torturante, obsceno, vulgar,
                  pornogr??fico, ofensivo, profano, contenha ou retrate nudez,
                  contenha ou retrate atividades sexuais ou seja impr??prio como
                  determinado por n??s ?? nossa discri????o exclusiva;
                </p>
                <p>
                  4. constitua publicidade n??o autorizada ou n??o solicitada,
                  lixo eletr??nico ou e-mails massivos (???spamming???);
                </p>
                <p>
                  5. contenha v??rus de software ou qualquer outro c??digo de
                  computador, arquivos ou programas que foram projetados para/ou
                  tenham a inten????o de interromper, danificar, limitar ou
                  interferir com o funcionamento adequado de qualquer software,
                  hardware ou equipamentos de telecomunica????es ou danificar ou
                  obter acesso n??o autorizado a qualquer sistema, dados, senhas
                  ou outras informa????es suas ou de terceiros;
                </p>
                <p>
                  6. personificar qualquer pessoa ou entidade, incluindo
                  qualquer um de nossos funcion??rios ou representantes; ou
                </p>
                <p>
                  7. incluir os documentos de identifica????o ou informa????es
                  financeiras suscet??veis de qualquer pessoa.
                </p>
                <p>
                  <strong>Voc?? n??o dever??:</strong> (i) tomar qualquer medida
                  que imponha ou possa impor (como determinado por n??s em nossa
                  discri????o exclusiva) uma carga insensata ou
                  desproporcionadamente grande em nossa infraestrutura (ou na de
                  nossos provedores terceiros); (ii) interferir ou tentar
                  interferir com a opera????o apropriada dos servi??os ou quaisquer
                  atividades conduzidas nos servi??os; (iii) desviar, contornar
                  ou tentar desviar ou contornar quaisquer medidas que possamos
                  usar para evitar ou restringir o acesso aos servi??os (ou
                  outras contas, sistemas de computadores ou redes conectadas
                  aos servi??os); (iv) rodar qualquer forma de resposta
                  autom??tica ou ???spam??? nos servi??os; (v) usar software,
                  dispositivos ou outros processos manuais ou autom??ticos para
                  ???arrastar??? ou ???spider??? qualquer p??gina do Site; (vi) colher ou
                  raspar qualquer Conte??do dos Servi??os; ou (vii) caso
                  contr??rio, tomar qualquer medida em viola????o das nossas
                  diretrizes e pol??ticas.
                </p>
                <p>
                  <strong> Voc?? n??o dever?? (direta ou indiretamente):</strong>{" "}
                  (i) decifrar, descompilar, desmontar, reverter a engenharia ou
                  outra tentativa para derivar qualquer c??digo de fonte ou ideia
                  b??sica ou algoritmos de qualquer parte do Site (incluindo sem
                  limita????es quaisquer aplicativos), exceto at?? a extens??o
                  limitada onde as leis aplic??veis especificamente pro??bem tais
                  restri????es, (ii) modificar, traduzir ou criar trabalhos
                  derivativos de qualquer parte dos servi??os ou (iii) copiar,
                  alugar, arrendar, distribuir ou transferir quaisquer dos
                  direitos recebidos sob este. Voc?? dever?? obedecer todas as
                  leis e regulamenta????es locais, estaduais, nacionais e
                  internacionais.
                </p>
                <p>
                  Tamb??m nos reservamos no direito de acessar, ler, preservar e
                  revelar quaisquer informa????es que achamos que seja necess??ria
                  para (i) satisfazer qualquer lei aplic??vel, regulamenta????o,
                  processo legal ou solicita????o governamental, (ii) refor??ar
                  este Acordo do Usu??rio, incluindo a investiga????o das
                  potenciais viola????es deste, (iii) detectar, prevenir ou mesmo
                  endere??ar as quest??es de fraude, seguran??a ou t??cnicas, (iv)
                  responder ??s solicita????es de suporte dos usu??rios ou (v)
                  proteger nossos direitos, propriedade ou seguran??a, assim como
                  de nossos usu??rios e do p??blico.
                </p>
                <p>
                  <strong>Servi??os de Terceiros.</strong> Os Servi??os lhe
                  permitir??o conectar-se a outros sites, servi??os ou recursos na
                  Internet, incluindo, mas n??o limitando, nossos patrocinadores
                  e Facebook, e a outros sites, servi??os ou recursos na Internet
                  que possam conter links para os Servi??os. Quando acessa os
                  recursos de terceiros na Internet, voc?? o faz ao seu pr??prio
                  risco. Esses outros recursos n??o est??o sob nosso controle e
                  voc?? reconhece que n??o somos respons??veis e n??o podemos ser
                  responsabilizados pelo conte??do, fun????es, precis??o,
                  legalidade, idoneidade ou qualquer outro aspectos de tais
                  sites ou recursos na Internet. A inclus??o desses links n??o
                  implica em nosso endosso ou qualquer associa????o entre n??s e os
                  operadores deles. Voc?? tamb??m reconhece and concorda que n??o
                  seremos respons??veis e nem devemos ser responsibilizados,
                  direta ou indiretamente, por quaisquer danos ou perdas
                  causados, ou supostamente causados, pelo, ou em conex??o com, o
                  uso ou depend??ncia de tais conte??dos, produtos ou servi??os
                  dispon??veis em ou atrav??s de tais sites ou recursos na
                  Internet.
                </p>
                <p>
                  <strong>Encerramento.</strong> Poderemos encerrar seu acesso a
                  toda e qualquer parte dos servi??os a qualquer hora, com ou sem
                  causa, com ou sem aviso, efetivo imediatamente, o que poder??
                  resultar na priva????o e destrui????o de todas as informa????es
                  associadas com sua participa????o no grupo. Todas as provis??es
                  sob este Acordo do Usu??rio, as quais pela sua natureza
                  deveriam sobreviver ao encerramento, dever??o sobreviver o
                  encerramento, incluindo, sem limita????es, as licen??as de
                  Conte??do do Usu??rio, as provis??es de propriedade, as ren??ncias
                  de garantias, as indeniza????es e as limita????es da
                  responsabilidade.
                </p>
                <p>
                  <strong>Ren??ncia de Garantias.</strong>
                </p>
                <p>
                  N??o temos um relacionamento especial nem dever fiduci??rio com
                  voc??. Voc?? reconhece que N??s n??o temos nenhum dever para tomar
                  qualquer medida a respeito de:
                </p>
                <p>1. quais usu??rios obt??m acesso aos Servi??os;</p>
                <p>2. qual Conte??do voc?? acessa via os Servi??os; ou</p>
                <p>3. como voc?? interpreta ou usa o Conte??do.</p>
                <p>
                  Voc?? nos libera de qualquer responsabilidade por ter adquirido
                  ou n??o adquirido Conte??do atrav??s dos Servi??os. N??o fazemos
                  qualquer representa????o a respeito de qualquer Conte??do contido
                  em ou acessado atrav??s dos servi??os, e n??o seremos
                  respons??veis nem responsabilizados pela precis??o, conformidade
                  com as leis de direitos autorais ou legalidade de materiais ou
                  Conte??do contido em ou acessado atrav??s dos Servi??os.
                </p>
                <p>
                  OS SERVI??OS E CONTE??DO S??O FORNECIDOS ???COMO EST??O???, ???COMO
                  DISPON??VEIS??? E SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU
                  SUGERIDA, INCLUINDO, MAS N??O LIMITANDO, AS GARANTIAS SUGERIDAS
                  DE T??TULO, N??O INFRA????O, COMERCIALIDADE E ADEQUA????O PARA UM
                  PROP??SITO ESPEC??FICO, E QUAISQUER GARANTIAS SUGERIDAS POR
                  QUALQUER CURSO OU DESEMPENHO OU UTILIZA????O COMERCIAL, OS QUAIS
                  FORAM EXPRESSAMENTE RENUNCIADOS. N??S E NOSSOS DIRETORES,
                  FUNCION??RIOS, AGENTES, FORNECEDORES, PARCEIROS E PROVEDORES DE
                  CONTE??DO N??O GARANTIMOS QUE: (I) OS SERVI??OS SER??O SEGUROS OU
                  DISPON??VEIS ?? QUALQUER HORA OU LOCAL ESPEC??FICO;(II) QUAISQUER
                  DEFEITOS OU ERROS SER??O CORRIGIDOS; (III) QUALQUER CONTE??DO OU
                  SOFTWARE DISPON??VEL NOS OU ATRAV??S DOS SERVI??OS ESTEJA LIVRE
                  DE V??RUS OU OUTROS COMPONENTES PREJUDICIAIS; OU (IV) OS
                  RESULTADOS DO USO DOS SERVI??OS SATISFAR??O SEUS REQUISITOS. SEU
                  USO DOS SERVI??OS ?? INTEIRAMENTE AO SEU PR??PRIO RISCO.
                </p>
                <p>
                  <strong>Indeniza????o.</strong> Voc?? dever?? nos defender,
                  indenizar e isentar, assim como nossos afiliados e cada um de
                  nossos contratados, diretores, fornecedores e representantes,
                  e seus respectivos funcion??rios, de todas as
                  responsabilidades, reivindica????es e despesas, incluindo os
                  honor??rios advocat??cios, que surgirem com ou que estejam
                  relacionadas ao seu uso, ou uso incorreto, ou acesso aos
                  Servi??os, Conte??do ou mesmo do Conte??do do Usu??rio, as
                  viola????es deste Acordo do Usu??rio ou infra????o da sua parte, ou
                  de terceiros usando sua identidade nos servi??os, de qualquer
                  propriedade intelectual ou outro direito de qualquer pessoa ou
                  entidade. Nos reservamos no direito de supor a defesa
                  exclusiva e controle de quaiquer quest??es sujeitas ??
                  indeniza????o por voc??, quando ent??o voc?? ir?? nos auxiliar e
                  cooperar conosco na declara????o de quaisquer defesas
                  dispon??veis.
                </p>
                <p>
                  <strong>Limita????o da Responsabilidade.</strong> EM NENHUMA
                  CIRCUNST??NCIA N??S, NOSSOS DIRETORES, FUNCION??RIOS, AGENTES,
                  PARCEIROS, FORNECEDORES OU PROVEDORES DE CONTE??DO SEREMOS
                  RESPONSABILIZADO SOB CONTRATO, ATO IL??CITO, OBRIGA????O ESTRITA,
                  NEGLIG??NCIA OU QUALQUER OUTRA FORMA LEGAL OU TEORIA
                  EQUIPAR??VEL COM RESPEITO AOS SERVI??OS (I) POR QUAISQUER LUCROS
                  PERDIDOS, PERDA DE DADOS, CUSTOS DE AQUISI????O DE PRODUTOS OU
                  SERVI??OS SUBSTITUTOS OU DANOS ESPECIAIS, INDIRETOS,
                  INCIDENTAIS, PUNITIVOS, COMPENSADORES OU CONSEQUENCIAIS DE
                  QUALQUER FORMA, DE PRODUTOS OU SERVI??OS SUBSTITUTOS (QUE
                  VENHAM A SURGIR), (II) POR QUAISQUER BUGS, V??RUS, CAVALOS DE
                  TROIA OU SIMILARES (INDEPENDENTE DA FONTE DE ORIGEM) OU (III)
                  POR QUAISQUER DANOS DIRETOS.
                </p>
                <p>
                  <strong>Modifica????es.</strong> Nos reservamos no direito, de
                  acordo com nossa discri????o exclusiva, de modificar ou
                  substituir qualquer parte deste Acordo do Usu??rio, ou alterar,
                  suspender ou descontinuar os Servi??os (incluindo sem
                  limita????es, a disponibilidade de qualquer recurso, banco de
                  dados ou conte??do) a qualquer hora ao postar um aviso no Site
                  ou algum outro meio de comunica????o eletr??nica apropriado.
                  Tamb??m poderemos impor limites em certos recursos e servi??os
                  ou retringir seu acesso ?? partes ou a todos os servi??os sem
                  aviso pr??vio ou responsabilidade. ?? responsabilidade sua
                  checar este Acordo do Usu??rio periodicamente para ver se houve
                  alguma mudan??a. O seu uso continuado dos Servi??os ap??s a
                  notifica????o de quaisquer altera????es a este Acordo do Usu??rio
                  constitui aceita????o dessas altera????es.
                </p>
                <p>
                  <strong>Miscel??neas</strong>
                </p>
                <p>
                  Todo o Acordo e Divisibilidade. Este Acordo do Usu??rio ?? todo
                  o acordo entre voc?? e n??s no que diz respeito aos Servi??os,
                  incluindo o uso do Site, e sobrep??e todas as comunica????es e
                  propostas anteriores ou contempor??neas (sejam elas orais, por
                  escrito ou eletr??nicas) entre voc?? e n??s no que diz respeito
                  aos Servi??os. Se for descoberto que qualquer provis??o deste
                  Acordo do Usu??rio n??o pode ser aplicada ou ?? inv??lida, esta
                  provis??o ser?? limitada ou eliminada ao ponto m??nimo
                  necess??rio, de forma que este Acordo do Usu??rio permanecer?? em
                  pleno vigor e efic??cia e aplic??vel. O fracasso de qualquer uma
                  das partes em exercitar, sob todos os aspectos, qualquer
                  direito previsto neste n??o dever?? ser considerado uma ren??ncia
                  de quaisquer outros direitos sob este.
                </p>
                <p>
                  <strong>For??a Maior.</strong> N??o devemos ser
                  responsabilizados por qualquer fracasso em realizar nossas
                  obriga????es sob este onde tais fracasos resultem de qualquer
                  causa al??m do nosso controle razo??vel, incluindo, sem
                  limita????o, defeitos ou degrada????es mec??nicos, eletr??nicos ou
                  de comunica????o.
                </p>
                <p>
                  <strong>Atribui????o.</strong> Este Acordo do Usu??rio ?? pessoal
                  para voc??, e n??o poder?? ser atribu??vel, transfer??vel ou
                  sublicenciado por voc??, exceto com nosso consentimento pr??vio
                  por escrito. Poderemos atribuir, transferir ou delegar
                  qualquer um dos nossos direitos e obriga????es sob este sem
                  consentimento.
                </p>
                <p>
                  <strong>Ag??ncia.</strong> Nenhuma ag??ncia, parceria, joint
                  venture ou relacionamento empregat??cio ?? criado como resultado
                  deste Acordo do Usu??rio e nenhuma parte tem autoridade de
                  qualquer tipo para obrigar a outra sob qualquer aspecto.
                </p>
                <p>
                  <strong>Avisos.</strong> A menos que o contr??rio seja
                  especificado neste Acordo do Usu??rio, todos os avisos sob este
                  Acordo do Usu??rio ser??o por escrito e ser??o considerados como
                  tendo sido devidamente recebidos, se forem entregues
                  pessoalmente ou enviados via correio certificado ou
                  registrado, com aviso de recebimento assinado e retornado;
                  quando o recebimento ?? eletronicamente confirmado, se
                  transmido por fax ou e-mail; ou no dia ap??s este ter sido
                  enviado, se foi enviado por entrega 24 horas por um servi??o de
                  entrega expresso (Sedex). Os avisos eletr??nicos devem ser
                  enviados para mediabox@midiorama.com.
                </p>
                <p>
                  <strong>Sem Ren??ncia.</strong> Nosso fracasso em aplicar
                  qualquer parte deste Acordo do Usu??rio n??o dever?? constituir
                  uma ren??ncia ao nosso direito de mais adiante aplicar aquela
                  ou qualquer outra parte deste Acordo do Usu??rio. A ren??ncia da
                  conformidade em qualquer inst??ncia espec??fica n??o significa
                  que renunciamos ?? conformidade no futuro. Para que qualquer
                  ren??ncia de conformidade com este Acordo do Usu??rio seja
                  validado, devemos te fornecer um aviso por escrito de tal
                  ren??ncia atrav??s de um dos nossos representantes autorizados.
                </p>
                <p>
                  <strong>T??tulos.</strong> Os t??tulos da se????o e dos par??grafos
                  neste Acordo do Usu??rio s??o para conveni??ncia apenas e n??o
                  devem afetar sua interpreta????o.
                </p>
                {/* <!--p Data de Efetiva????o do Acordo do Usu??rio: 15-09-2021--> */}
              </div>
              <div className="modal-footer">
                <div className="row">
                  <div className="col-sm-2">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="otbutton btn btn-default"
                      onClick={closeModal}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );

  return (
      <Layout
        title="Usu??rio do Sistema Memoria Test"
        content={pageContent}
        user={props.user}
        group1={false}
        group2={false}
        group3={false}
      />
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

  user.oldPW=user.pw
  user.oldemail=user.email
  user.changePW=false
  user.changeEmail=false

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default UserPage;
