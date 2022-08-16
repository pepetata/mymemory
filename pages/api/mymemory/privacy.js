import React, { Component } from "react";
import Layout from "../components/Layout";

export default class Privacy extends Component {
  render() {
    return (
      <React.StrictMode>
        <Layout
          title="Política de Privaciadade do Sistem Memoria Test"
          content={pageContent}
          group1={false}  group2 = {false} group3={false}
        />
      </React.StrictMode>
    );
  }
}

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
              <h1 className="h3 text-center privacyTitle">
                Política de Privacidade da Sistema Memoria Test
              </h1>
              <br />
            </div>
            <div id="privacyText" className="privacyText">
              <p> </p>
              <p>
                Todas as suas informações pessoais recolhidas, serão usadas para
                ajudar a tornar a sua visita ao nosso site o mais produtiva e
                agradável possível.
              </p>
              <p> </p>
              <p>
                A garantia da confidencialidade dos dados pessoais dos
                utilizadores do nosso site é importante para o Sistema Memoria Test.
              </p>
              <p> </p>
              <p>
                Todas as informações pessoais relativas a membros, assinantes,
                clientes ou visitantes que usem o Sistema Memoria Test serão
                tratadas em concordância com a Lei da Proteção de Dados Pessoais
                de 26 de outubro de 1998 (Lei n.º 67/98).
              </p>
              <p> </p>
              <p>
                A informação pessoal recolhida pode incluir o seu nome, e-mail,
                número de telefone e/ou telemóvel, morada, data de nascimento
                e/ou outros.
              </p>
              <p> </p>
              <p>
                O uso do Sistema Memoria Test pressupõe a aceitação deste Acordo de
                privacidade. A equipa do Sistema Memoria Test reserva-se ao direito
                de alterar este acordo sem aviso prévio. Deste modo,
                recomendamos que consulte a nossa política de privacidade com
                regularidade de forma a estar sempre atualizado.
              </p>
              <p> </p>
              <p></p>
              <h2 className="h5 privacyTitle">Divulgação</h2>
              <p> </p>
              <p>
                Podemos divulgar suas informações pessoais caso sejamos
                obrigados pela lei para fazê-lo ou se você violar nossos Termos
                de Serviço.
              </p>
              <p> </p>
              <h2 className="h5 privacyTitle">Os anúncios</h2>
              <p>
                Tal como outros websites, coletamos e utilizamos informação
                contida nos anúncios. A informação contida nos anúncios, inclui
                o seu endereço IP (Internet Protocol), o seu ISP (Internet
                Service Provider, como o Sapo, Clix, ou outro), o browser que
                utilizou ao visitar o nosso website (como o Internet Explorer ou
                o Firefox), o tempo da sua visita e que páginas visitou dentro
                do nosso website.
              </p>
              <p> </p>
              <h2 className="h5 privacyTitle">Cookie DoubleClick Dart</h2>
              <p>
                O Google, como fornecedor de terceiros, utiliza cookies para
                exibir anúncios no nosso website;
              </p>
              <p> </p>
              <p>
                Com o cookie DART, o Google pode exibir anúncios com base nas
                visitas que o leitor fez a outros websites na Internet;
              </p>
              <p> </p>
              <p>
                Os utilizadores podem desativar o cookie DART visitando a
                Política de privacidade da rede de conteúdo e dos anúncios do
                Google.
              </p>
              <p> </p>
              <h2 className="h5 privacyTitle">Os Cookies e Web Beacons</h2>
              <p>
                Utilizamos cookies para armazenar informação, tais como as suas
                preferências pessoas quando visita o nosso website. Isto poderá
                incluir um simples popup, ou uma ligação em vários serviços que
                providenciamos, tais como fóruns.
              </p>
              <p> </p>
              <p>
                Em adição também utilizamos publicidade de terceiros no nosso
                website para suportar os custos de manutenção. Alguns destes
                publicitários, poderão utilizar tecnologias como os cookies e/ou
                web beacons quando publicitam no nosso website, o que fará com
                que esses publicitários (como o Google através do Google
                AdSense) também recebam a sua informação pessoal, como o
                endereço IP, o seu ISP, o seu browser, etc. Esta função é
                geralmente utilizada para geotargeting (mostrar publicidade de
                Lisboa apenas aos leitores oriundos de Lisboa por ex.) ou
                apresentar publicidade direcionada a um tipo de utilizador (como
                mostrar publicidade de restaurante a um utilizador que visita
                sites de culinária regularmente, por ex.).
              </p>
              <p> </p>
              <p>
                Você detém o poder de desligar os seus cookies, nas opções do
                seu browser, ou efetuando alterações nas ferramentas de
                programas Anti-Virus, como o Norton Internet Security. No
                entanto, isso poderá alterar a forma como interage com o nosso
                website, ou outros websites. Isso poderá afetar ou não permitir
                que faça logins em programas, sites ou fóruns da nossa e de
                outras redes.
              </p>
              <p> </p>
              <h2 className="h5 privacyTitle">Ligações a Sites de terceiros</h2>
              <p>
                O Sistema Memoria Test possui ligações para outros sites, os quais,
                a nosso ver, podem conter informações / ferramentas úteis para
                os nossos visitantes. A nossa política de privacidade não é
                aplicada a sites de terceiros, pelo que, caso visite outro site
                a partir do nosso deverá ler a politica de privacidade do mesmo.
              </p>
              <p> </p>
              <p>
                Não nos responsabilizamos pela política de privacidade ou
                conteúdo presente nesses mesmos sites.
              </p>
              <p> </p>
              <h2 className="h5 privacyTitle">Segurança</h2>
              <p>
                Para proteger suas informações pessoais, tomamos precauções
                razoáveis e seguimos as melhores práticas da indústria para nos
                certificar que elas não serão perdidas inadequadamente,
                usurpadas, acessadas, divulgadas, alteradas ou destruídas.
              </p>
              {/* <p> </p>
              <p>
                Se você nos fornecer as suas informações de cartão de crédito,
                essa informação é criptografada usando tecnologia "secure socket
                layer" (SSL) e armazenada com uma criptografia AES-256. Embora
                nenhum método de transmissão pela Internet ou armazenamento
                eletrônico é 100% seguro, nós seguimos todos os requisitos da
                PCI-DSS e implementamos padrões adicionais geralmente aceitos
                pela indústria.
              </p> */}
              <p> </p>
              <h2 className="h5 privacyTitle">
                Alterações para essa Política de Privacidade
              </h2>
              <p>
                Reservamos o direito de modificar essa política de privacidade a
                qualquer momento, então por favor, revise-a com frequência.
                Alterações e esclarecimentos vão surtir efeito imediatamente
                após sua publicação no site. Se fizermos alterações de materiais
                para essa política, iremos notificá-lo aqui que eles foram
                atualizados, para que você tenha ciência sobre quais informações
                coletamos, como as usamos, e sob que circunstâncias, se alguma,
                usamos e/ou divulgamos elas.
              </p>
              <p> </p>
              <p>
                Se nossa loja for adquirida ou fundida com outra empresa, suas
                informações podem ser transferidas para os novos proprietários
                para que possamos continuar a vender produtos para você.
              </p>
              <p> </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .privacyText {
          margin-left: 30px;
          margin-right: 30px;
        }

        .privacyTitle {
          font-weight: 600;
          color: #1650a1;
        }
      `}</style>
    </div>
  </>
);

// // getStaticProps : The page will be pre-rendered at build time
// export async function getStaticProps() {
//   return {props:{}}
//  }
