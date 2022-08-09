import React, { Component } from "react";
import Image from "next/image";

import goBack from "../images/go_back20.png";

const ReturnButton = (props) => {
  return (
      <button
        className="btn btn-light otbutton"
        onClick={props.action}
      >
         <span style={{position: "relative", bottom: "4px"}}>Voltar</span>
        <Image
          src={goBack}
          className="imgButton ps-2"
          alt="Retornar"
          width={30}
          height={20}
        />
      </button>
  );
};

export default ReturnButton
