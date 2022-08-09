import React from "react";
import Image from "next/image";

import send from "../images/send.png";

const SendButton = (props) => {
  return (
    <button className="btn btn-warning otbutton" onClick={props.send}>
      <span style={{ position: "relative", bottom: "5px" }}>Enviar</span>
      <Image
        src={send}
        className="imgButton ps-2"
        alt="Enviar Mensagem"
        width={30}
        height={20}
      />
    </button>
  );
};

export default SendButton;
