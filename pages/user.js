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
const server = process.env.SERVER;

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
        "Você alterou um email que estava confirmado, nesse caso vai precisar confirmar novamente. Confirma a alteração do email?"
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
          "Parabéns!! Seu registro foi feito com sucesso. Ainda falta confirmar seu email. Leia a próxima tela com atenção ..."
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
              <label className="form-label">Correio Eletrônico</label>
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
                Nós nunca iremos compartilhar seu email com ninguém.
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
                Use no mínimo 4 caracteres. Sua senha estará segura com a gente.
                Mesmo assim recomendamos usar uma senha diferente das outras que
                já possui. Depois de informada sua senha, não vamos mostrá-la
                para sua segurança.
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
                Li e concordo com os termos do Acordo de Usuários
              </label>
            </div>
            <div className="mb-3">
              <a onClick={openModal}>
                Clique aqui para ler o Acordo de Usuários
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
            Acordo de Usuários
          </h4>

          <div className="modal-dialog">
            <div className="modal-content">
              <div
                style={{ height: "50vh", overflow: "auto" }}
                className="modal-body"
              >
                <p>
                  1. Ao utilizar o site de qualquer forma, incluindo, porém não
                  limitando, a visita ou navegação pelo site, você concorda com
                  este Acordo do Usuário e todas as outras normas, políticas e
                  procedimentos operacionais que poderão ser publicados de
                  tempos em tempos no site, sendo que cada um deles é
                  incorporado por referência e cada um deles poderá ser
                  atualizado de tempos em tempos sem aviso prévio.
                </p>
                <p>
                  2. Esteja certo de que os serviços do site estão sujeitos a
                  termos e condições adicionais especificada por nós de tempos
                  em tempos; o seu uso de tais serviços está sujeito a esses
                  termos e condições adicionais, os quais são incorporados neste
                  Acordo do Usuário por esta referência.
                </p>
                <p>
                  3. Este Acordo do Usuário se aplica a todos os usuários dos
                  serviços, incluindo, porém não limitando, os usuários que são
                  contribuidores de conteúdo, informações e outros materiais ou
                  serviços, registrados ou não.
                </p>
                <p>
                  4. AVISO DE ARBITRAGEM E RENÚNCIA À AÇÃO DE COLETIVA: COM
                  EXCEÇÃO DE ALGUNS TIPOS DE DISPUTAS DESCRITAS NA SEÇÃO DE
                  ARBITRAGEM ABAIXO, VOCÊ CONCORDA QUE AS DISPUTAS ENTRE VOCÊ E
                  NÓS SERÁ RESOLVIDA POR CONTRATO, ARBITRAGEM INDIVIDUAL E,
                  DESSA FORMA, RENUNCIA AO SEU DIREITO DE PARTICIPAR EM UM
                  PROCESSO DE AÇÃO COLETIVA OU ARBITRAGEM PARA TODA A CLASSE.
                </p>
                <p></p>
                <p>
                  <strong>Elegibilidade</strong>
                </p>
                <p>
                  Você reconhece e garante que tem pelo menos 18 anos de idade.
                  Se você tiver menos de 18, não poderá, sob qualquer
                  circunstâncias ou por qualquer motivo, usar os serviços.
                  Poderemos, segundo nossa discrição exclusiva, recusar a oferta
                  dos serviços para qualquer pessoa ou entidade e alterar seu
                  critério de elegibilidade a qualquer momento. Você é o único
                  responsável para garantir que este Acordo do Usuário esteja em
                  conformidade com todas as leis, normas e regulamentos
                  aplicáveis a você e o direito de acessar os serviços é
                  revogado onde este Acordo do Usuário ou uso dos serviços seja
                  proibido ou que a oferta, venda ou provisão estendida dos
                  serviços esteja em conflito com quaisquer leis, normas ou
                  regulamentos aplicáveis. Além disso, os serviços são
                  oferecidos apenas para seu uso, e não para o uso ou benefícios
                  de terceiros.
                </p>
                <p></p>
                <p>
                  <strong>Conteúdo</strong>
                </p>
                <p>
                  <strong>Definição.</strong> Para fins deste Acordo do Usuário,
                  o termo ”Conteúdo” inclui, sem limitações, informações, dados,
                  textos, fotografias, vídeos, clips de áudio, postagens
                  escritas, artigos, comentários, software, scripts, gráficos e
                  recursos interativos gerados, fornecidos ou mesmo acessíveis
                  nos serviços ou através destes. Para fins deste Acordo, o
                  “Conteúdo” também inclui todo o Conteúdo do Usuário (como
                  definido abaixo).
                </p>
                <p>
                  <strong>Conteúdo do Usuário.</strong> Todo o Conteúdo
                  adicionado, criado, uploaded, submetido, distribuído ou
                  postado para o site pelos usuários (coletivamente “Conteúdo do
                  Usuário”), seja postado publicamente ou transmitido
                  privadamente, é responsabilidade exclusiva da pessoa que
                  originou tal Conteúdo do Usuário. Você reconhece que todo
                  Conteúdo do Usuário fornecido por você é preciso, completo,
                  atualizado e em conformidade com todas as leis, normas e
                  regulamentações aplicáveis. Você reconhece que todo o
                  Conteúdo, incluindo o Conteúdo do Usuário, que você acessou
                  usando os serviços do site está por sua conta e risco e que é
                  inteiramente responsável por qualquer dano ou perda a você ou
                  qualquer outra pessoa que tenha resultado desta ação. Não
                  garantimos que qualquer Conteúdo que você acesse através do
                  site é preciso, ou continuará sendo.
                </p>
                <p>
                  <strong>Avisos e Restrições.</strong> Os serviços poderão
                  conter Conteúdo especificamente fornecido por nós, nossos
                  parceiros ou nossos usuários e tal Conteúdo é protegido pelos
                  direitos autorais, marcas registradas, marcas de serviço,
                  patentes, segredos comerciais ou outro direitos e leis
                  proprietários. Você deverá cumprir e manter todos os avisos de
                  direitos autorais, informações e restrições contidas em
                  qualquer Conteúdo acessado pelos Serviços.
                </p>
                <p>
                  <strong>Licença para Uso.</strong> Sujeito a este Acordo do
                  Usuário, concedemos a cada usuário dos Serviços uma licença
                  mundial, não exclusiva, não sublicenciável e não transferível
                  para usar (por exemplo, para fazer o download e mostrar
                  localmente) o Conteúdo, uma vez que mantemos tais direitos,
                  exclusivamente para fins de uso dos Serviços. O uso,
                  reprodução, modificação, distribuição ou armazenagem de
                  qualquer Conteúdo para outro uso além do uso dos serviços, é
                  expressamente proibido sem nossa permissão prévia por escrito.
                  Você não poderá vender, licenciar, alugar ou até mesmo usar ou
                  explorar qualquer Conteúdo para uso comercial ou de qualquer
                  forma a violar os direitos de terceiros.
                </p>
                <p>
                  <strong>Concessão de Licença.</strong> Ao submeter o Conteúdo
                  do Usuário através dos serviços, você, por meio deste, nos
                  concede uma licença mundial, não exclusiva, perpétua, sem
                  royalties, totalmente paga, sublicenciável e transferível para
                  usar, editar, modificar, truncar, agregar, reproduzir,
                  distribuir, preparar os trabalhos derivativos, exibir,
                  realizar ou explorar por completo o Conteúdo do Usuário em
                  conexão com o Site, os Serviços e nossos negócios (e os de
                  nossos sucessores e atribuições), incluindo sem limitação para
                  promover e redistribuir partes ou todo o Site ou Serviços (e
                  trabalhos derivados deste) em qualquer formato de mídia e
                  através de quaisquer canais de mídia (incluindo, sem
                  limitação, sites e feed de terceiros). Para fins de clareza, a
                  concessão de licença precedente inclui nosso direito de
                  distribuir, exibir, realizar ou até mesmo usar o Conteúdo do
                  Usuário em conexão com o material fornecido pelos nossos
                  patrocinadores, e você não terá o direito de receber qualquer
                  renumeração por tal uso. Na medida em que qualquer Conteúdo do
                  Usuário que você submeta inclui seu nome, semelhança, voz ou
                  fotografia, você reconhece e concorda que a licença precedente
                  desta Seção 4(e) se aplica da mesma forma. Você também, por
                  meio deste, fará e concederá a cada usuário do Site e/ou dos
                  Serviços uma licença não exclusiva e perpétua para acessar seu
                  Conteúdo do Usuário através do Site, e para usar, editar,
                  modificar, reproduzir, distribuir, preparar trabalhos
                  derivativos deste, exibir e realizar tal Conteúdo do Usuário.
                  Para clareza, as concessões de licenças precedentes para nós e
                  nossos usuários não afetam suas outras propriedades ou
                  direitos de licença em seu Conteúdo do Usuário, incluindo o
                  direito de conceder licenças adicionais para seu Conteúdo do
                  Usuário, a menos que o contrário seja acordado por escrito.
                  Você representa e garante que tem todos os direitos para
                  conceder tais licenças para nós sem infringir ou violar os
                  direitos de terceiros, incluindo sem limitações, quaisquer
                  direitos de privacidade, direitos publicitários, direitos
                  autorais, marcas registradas, direitos de contatos ou qualquer
                  outra propriedade intelectual ou direitos proprietários.
                </p>
                <p>
                  A menos que o contrário seja acordado por escrito entre você e
                  a Midiorama, você não poderá usar plataformas de terceiros,
                  além de seu próprio site na Internet ou suas próprias páginas
                  na mídia social, para conectar ou distribuir o Conteúdo do
                  Usuário.
                </p>
                <p>
                  <strong>Disponibilidade do Conteúdo.</strong> Não garantimos
                  que qualquer Conteúdo será disponibilizado no Site. Nos
                  reservamos no direito de, porém não temos a obrigação, (i)
                  remover, editar, modificar, ou mesmo manipular qualquer
                  Conteúdo à nossa própria discrição, a qualquer hora, sem aviso
                  prévio e por qualquer motivo (incluindo, mas não limitando, no
                  recebimento de reivindicações ou alegações de terceiros ou
                  autoridades relacionadas com tal Conteúdo ou se estivermos
                  preocupados de que você tenha violado este Acordo do Usuário)
                  ou mesmo que não haja motivos e (ii) para remover ou bloquear
                  qualquer Conteúdo dos Serviços.
                </p>
                <p>
                  <strong>Regras de Conduta</strong>
                </p>
                <p>
                  Como condição de uso, você promete não usar os serviços para
                  qualquer fim que seja proibido por esses Termos de Uso. Você é
                  responsável por toda sua ativade em conexão com os serviços.
                </p>
                <p>
                  <strong>
                    Você não poderá (ou permitirá que terceiros o façam)
                  </strong>{" "}
                  (a) tomar qualquer medida ou (b) fazer o upload, download,
                  postagem, submissão ou mesmo distribuir ou facilitar a
                  distribuição de qualquer Conteúdo no site ou pelos serviços,
                  incluindo, sem limitações, qualquer Conteúdo do Usuário, que:
                </p>
                <p>
                  1. infrinja qualquer patente, marca registrada, segredo
                  comercial, direitos autoriais, direito de publicidade ou
                  outros direitos de qualquer pessoa ou entidade ou viole
                  qualquer lei ou dever contratual;
                </p>
                <p>
                  2. que você saiba que é falso, enganador, mentiroso ou
                  impreciso;
                </p>
                <p>
                  3. seja contra a lei, ameaçador, abusivo, provocativo,
                  difamatório, caluniador, deceptivo, fraudulento, invasor da
                  privacidade de outros, torturante, obsceno, vulgar,
                  pornográfico, ofensivo, profano, contenha ou retrate nudez,
                  contenha ou retrate atividades sexuais ou seja impróprio como
                  determinado por nós à nossa discrição exclusiva;
                </p>
                <p>
                  4. constitua publicidade não autorizada ou não solicitada,
                  lixo eletrônico ou e-mails massivos (“spamming”);
                </p>
                <p>
                  5. contenha vírus de software ou qualquer outro código de
                  computador, arquivos ou programas que foram projetados para/ou
                  tenham a intenção de interromper, danificar, limitar ou
                  interferir com o funcionamento adequado de qualquer software,
                  hardware ou equipamentos de telecomunicações ou danificar ou
                  obter acesso não autorizado a qualquer sistema, dados, senhas
                  ou outras informações suas ou de terceiros;
                </p>
                <p>
                  6. personificar qualquer pessoa ou entidade, incluindo
                  qualquer um de nossos funcionários ou representantes; ou
                </p>
                <p>
                  7. incluir os documentos de identificação ou informações
                  financeiras suscetíveis de qualquer pessoa.
                </p>
                <p>
                  <strong>Você não deverá:</strong> (i) tomar qualquer medida
                  que imponha ou possa impor (como determinado por nós em nossa
                  discrição exclusiva) uma carga insensata ou
                  desproporcionadamente grande em nossa infraestrutura (ou na de
                  nossos provedores terceiros); (ii) interferir ou tentar
                  interferir com a operação apropriada dos serviços ou quaisquer
                  atividades conduzidas nos serviços; (iii) desviar, contornar
                  ou tentar desviar ou contornar quaisquer medidas que possamos
                  usar para evitar ou restringir o acesso aos serviços (ou
                  outras contas, sistemas de computadores ou redes conectadas
                  aos serviços); (iv) rodar qualquer forma de resposta
                  automática ou “spam” nos serviços; (v) usar software,
                  dispositivos ou outros processos manuais ou automáticos para
                  “arrastar” ou “spider” qualquer página do Site; (vi) colher ou
                  raspar qualquer Conteúdo dos Serviços; ou (vii) caso
                  contrário, tomar qualquer medida em violação das nossas
                  diretrizes e políticas.
                </p>
                <p>
                  <strong> Você não deverá (direta ou indiretamente):</strong>{" "}
                  (i) decifrar, descompilar, desmontar, reverter a engenharia ou
                  outra tentativa para derivar qualquer código de fonte ou ideia
                  básica ou algoritmos de qualquer parte do Site (incluindo sem
                  limitações quaisquer aplicativos), exceto até a extensão
                  limitada onde as leis aplicáveis especificamente proíbem tais
                  restrições, (ii) modificar, traduzir ou criar trabalhos
                  derivativos de qualquer parte dos serviços ou (iii) copiar,
                  alugar, arrendar, distribuir ou transferir quaisquer dos
                  direitos recebidos sob este. Você deverá obedecer todas as
                  leis e regulamentações locais, estaduais, nacionais e
                  internacionais.
                </p>
                <p>
                  Também nos reservamos no direito de acessar, ler, preservar e
                  revelar quaisquer informações que achamos que seja necessária
                  para (i) satisfazer qualquer lei aplicável, regulamentação,
                  processo legal ou solicitação governamental, (ii) reforçar
                  este Acordo do Usuário, incluindo a investigação das
                  potenciais violações deste, (iii) detectar, prevenir ou mesmo
                  endereçar as questões de fraude, segurança ou técnicas, (iv)
                  responder às solicitações de suporte dos usuários ou (v)
                  proteger nossos direitos, propriedade ou segurança, assim como
                  de nossos usuários e do público.
                </p>
                <p>
                  <strong>Serviços de Terceiros.</strong> Os Serviços lhe
                  permitirão conectar-se a outros sites, serviços ou recursos na
                  Internet, incluindo, mas não limitando, nossos patrocinadores
                  e Facebook, e a outros sites, serviços ou recursos na Internet
                  que possam conter links para os Serviços. Quando acessa os
                  recursos de terceiros na Internet, você o faz ao seu próprio
                  risco. Esses outros recursos não estão sob nosso controle e
                  você reconhece que não somos responsáveis e não podemos ser
                  responsabilizados pelo conteúdo, funções, precisão,
                  legalidade, idoneidade ou qualquer outro aspectos de tais
                  sites ou recursos na Internet. A inclusão desses links não
                  implica em nosso endosso ou qualquer associação entre nós e os
                  operadores deles. Você também reconhece and concorda que não
                  seremos responsáveis e nem devemos ser responsibilizados,
                  direta ou indiretamente, por quaisquer danos ou perdas
                  causados, ou supostamente causados, pelo, ou em conexão com, o
                  uso ou dependência de tais conteúdos, produtos ou serviços
                  disponíveis em ou através de tais sites ou recursos na
                  Internet.
                </p>
                <p>
                  <strong>Encerramento.</strong> Poderemos encerrar seu acesso a
                  toda e qualquer parte dos serviços a qualquer hora, com ou sem
                  causa, com ou sem aviso, efetivo imediatamente, o que poderá
                  resultar na privação e destruição de todas as informações
                  associadas com sua participação no grupo. Todas as provisões
                  sob este Acordo do Usuário, as quais pela sua natureza
                  deveriam sobreviver ao encerramento, deverão sobreviver o
                  encerramento, incluindo, sem limitações, as licenças de
                  Conteúdo do Usuário, as provisões de propriedade, as renúncias
                  de garantias, as indenizações e as limitações da
                  responsabilidade.
                </p>
                <p>
                  <strong>Renúncia de Garantias.</strong>
                </p>
                <p>
                  Não temos um relacionamento especial nem dever fiduciário com
                  você. Você reconhece que Nós não temos nenhum dever para tomar
                  qualquer medida a respeito de:
                </p>
                <p>1. quais usuários obtém acesso aos Serviços;</p>
                <p>2. qual Conteúdo você acessa via os Serviços; ou</p>
                <p>3. como você interpreta ou usa o Conteúdo.</p>
                <p>
                  Você nos libera de qualquer responsabilidade por ter adquirido
                  ou não adquirido Conteúdo através dos Serviços. Não fazemos
                  qualquer representação a respeito de qualquer Conteúdo contido
                  em ou acessado através dos serviços, e não seremos
                  responsáveis nem responsabilizados pela precisão, conformidade
                  com as leis de direitos autorais ou legalidade de materiais ou
                  Conteúdo contido em ou acessado através dos Serviços.
                </p>
                <p>
                  OS SERVIÇOS E CONTEÚDO SÃO FORNECIDOS “COMO ESTÃO”, “COMO
                  DISPONÍVEIS” E SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU
                  SUGERIDA, INCLUINDO, MAS NÃO LIMITANDO, AS GARANTIAS SUGERIDAS
                  DE TÍTULO, NÃO INFRAÇÃO, COMERCIALIDADE E ADEQUAÇÃO PARA UM
                  PROPÓSITO ESPECÍFICO, E QUAISQUER GARANTIAS SUGERIDAS POR
                  QUALQUER CURSO OU DESEMPENHO OU UTILIZAÇÃO COMERCIAL, OS QUAIS
                  FORAM EXPRESSAMENTE RENUNCIADOS. NÓS E NOSSOS DIRETORES,
                  FUNCIONÁRIOS, AGENTES, FORNECEDORES, PARCEIROS E PROVEDORES DE
                  CONTEÚDO NÃO GARANTIMOS QUE: (I) OS SERVIÇOS SERÃO SEGUROS OU
                  DISPONÍVEIS À QUALQUER HORA OU LOCAL ESPECÍFICO;(II) QUAISQUER
                  DEFEITOS OU ERROS SERÃO CORRIGIDOS; (III) QUALQUER CONTEÚDO OU
                  SOFTWARE DISPONÍVEL NOS OU ATRAVÉS DOS SERVIÇOS ESTEJA LIVRE
                  DE VÍRUS OU OUTROS COMPONENTES PREJUDICIAIS; OU (IV) OS
                  RESULTADOS DO USO DOS SERVIÇOS SATISFARÃO SEUS REQUISITOS. SEU
                  USO DOS SERVIÇOS É INTEIRAMENTE AO SEU PRÓPRIO RISCO.
                </p>
                <p>
                  <strong>Indenização.</strong> Você deverá nos defender,
                  indenizar e isentar, assim como nossos afiliados e cada um de
                  nossos contratados, diretores, fornecedores e representantes,
                  e seus respectivos funcionários, de todas as
                  responsabilidades, reivindicações e despesas, incluindo os
                  honorários advocatícios, que surgirem com ou que estejam
                  relacionadas ao seu uso, ou uso incorreto, ou acesso aos
                  Serviços, Conteúdo ou mesmo do Conteúdo do Usuário, as
                  violações deste Acordo do Usuário ou infração da sua parte, ou
                  de terceiros usando sua identidade nos serviços, de qualquer
                  propriedade intelectual ou outro direito de qualquer pessoa ou
                  entidade. Nos reservamos no direito de supor a defesa
                  exclusiva e controle de quaiquer questões sujeitas à
                  indenização por você, quando então você irá nos auxiliar e
                  cooperar conosco na declaração de quaisquer defesas
                  disponíveis.
                </p>
                <p>
                  <strong>Limitação da Responsabilidade.</strong> EM NENHUMA
                  CIRCUNSTÂNCIA NÓS, NOSSOS DIRETORES, FUNCIONÁRIOS, AGENTES,
                  PARCEIROS, FORNECEDORES OU PROVEDORES DE CONTEÚDO SEREMOS
                  RESPONSABILIZADO SOB CONTRATO, ATO ILÍCITO, OBRIGAÇÃO ESTRITA,
                  NEGLIGÊNCIA OU QUALQUER OUTRA FORMA LEGAL OU TEORIA
                  EQUIPARÁVEL COM RESPEITO AOS SERVIÇOS (I) POR QUAISQUER LUCROS
                  PERDIDOS, PERDA DE DADOS, CUSTOS DE AQUISIÇÃO DE PRODUTOS OU
                  SERVIÇOS SUBSTITUTOS OU DANOS ESPECIAIS, INDIRETOS,
                  INCIDENTAIS, PUNITIVOS, COMPENSADORES OU CONSEQUENCIAIS DE
                  QUALQUER FORMA, DE PRODUTOS OU SERVIÇOS SUBSTITUTOS (QUE
                  VENHAM A SURGIR), (II) POR QUAISQUER BUGS, VÍRUS, CAVALOS DE
                  TROIA OU SIMILARES (INDEPENDENTE DA FONTE DE ORIGEM) OU (III)
                  POR QUAISQUER DANOS DIRETOS.
                </p>
                <p>
                  <strong>Modificações.</strong> Nos reservamos no direito, de
                  acordo com nossa discrição exclusiva, de modificar ou
                  substituir qualquer parte deste Acordo do Usuário, ou alterar,
                  suspender ou descontinuar os Serviços (incluindo sem
                  limitações, a disponibilidade de qualquer recurso, banco de
                  dados ou conteúdo) a qualquer hora ao postar um aviso no Site
                  ou algum outro meio de comunicação eletrônica apropriado.
                  Também poderemos impor limites em certos recursos e serviços
                  ou retringir seu acesso à partes ou a todos os serviços sem
                  aviso prévio ou responsabilidade. É responsabilidade sua
                  checar este Acordo do Usuário periodicamente para ver se houve
                  alguma mudança. O seu uso continuado dos Serviços após a
                  notificação de quaisquer alterações a este Acordo do Usuário
                  constitui aceitação dessas alterações.
                </p>
                <p>
                  <strong>Miscelâneas</strong>
                </p>
                <p>
                  Todo o Acordo e Divisibilidade. Este Acordo do Usuário é todo
                  o acordo entre você e nós no que diz respeito aos Serviços,
                  incluindo o uso do Site, e sobrepõe todas as comunicações e
                  propostas anteriores ou contemporâneas (sejam elas orais, por
                  escrito ou eletrônicas) entre você e nós no que diz respeito
                  aos Serviços. Se for descoberto que qualquer provisão deste
                  Acordo do Usuário não pode ser aplicada ou é inválida, esta
                  provisão será limitada ou eliminada ao ponto mínimo
                  necessário, de forma que este Acordo do Usuário permanecerá em
                  pleno vigor e eficácia e aplicável. O fracasso de qualquer uma
                  das partes em exercitar, sob todos os aspectos, qualquer
                  direito previsto neste não deverá ser considerado uma renúncia
                  de quaisquer outros direitos sob este.
                </p>
                <p>
                  <strong>Força Maior.</strong> Não devemos ser
                  responsabilizados por qualquer fracasso em realizar nossas
                  obrigações sob este onde tais fracasos resultem de qualquer
                  causa além do nosso controle razoável, incluindo, sem
                  limitação, defeitos ou degradações mecânicos, eletrônicos ou
                  de comunicação.
                </p>
                <p>
                  <strong>Atribuição.</strong> Este Acordo do Usuário é pessoal
                  para você, e não poderá ser atribuível, transferível ou
                  sublicenciado por você, exceto com nosso consentimento prévio
                  por escrito. Poderemos atribuir, transferir ou delegar
                  qualquer um dos nossos direitos e obrigações sob este sem
                  consentimento.
                </p>
                <p>
                  <strong>Agência.</strong> Nenhuma agência, parceria, joint
                  venture ou relacionamento empregatício é criado como resultado
                  deste Acordo do Usuário e nenhuma parte tem autoridade de
                  qualquer tipo para obrigar a outra sob qualquer aspecto.
                </p>
                <p>
                  <strong>Avisos.</strong> A menos que o contrário seja
                  especificado neste Acordo do Usuário, todos os avisos sob este
                  Acordo do Usuário serão por escrito e serão considerados como
                  tendo sido devidamente recebidos, se forem entregues
                  pessoalmente ou enviados via correio certificado ou
                  registrado, com aviso de recebimento assinado e retornado;
                  quando o recebimento é eletronicamente confirmado, se
                  transmido por fax ou e-mail; ou no dia após este ter sido
                  enviado, se foi enviado por entrega 24 horas por um serviço de
                  entrega expresso (Sedex). Os avisos eletrônicos devem ser
                  enviados para mediabox@midiorama.com.
                </p>
                <p>
                  <strong>Sem Renúncia.</strong> Nosso fracasso em aplicar
                  qualquer parte deste Acordo do Usuário não deverá constituir
                  uma renúncia ao nosso direito de mais adiante aplicar aquela
                  ou qualquer outra parte deste Acordo do Usuário. A renúncia da
                  conformidade em qualquer instância específica não significa
                  que renunciamos à conformidade no futuro. Para que qualquer
                  renúncia de conformidade com este Acordo do Usuário seja
                  validado, devemos te fornecer um aviso por escrito de tal
                  renúncia através de um dos nossos representantes autorizados.
                </p>
                <p>
                  <strong>Títulos.</strong> Os títulos da seção e dos parágrafos
                  neste Acordo do Usuário são para conveniência apenas e não
                  devem afetar sua interpretação.
                </p>
                {/* <!--p Data de Efetivação do Acordo do Usuário: 15-09-2021--> */}
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
        title="Usuário do Sistema Memoria Test"
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
  console.log("index - getServerSideProps  token=", token);
  if (token) {
    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
    console.log("index - getServerSideProps  session=", session);
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
