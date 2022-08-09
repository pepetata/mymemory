import React, { Component } from "react";
import Image from "next/image";

import cancel from "../images/cancel.png";

const CancelAddIdolButton = (props) => {
  return (
      <button
        className="btn btn-light otbutton"
        onClick={props.action}
      >
         <span style={{position: "relative", bottom: "5px"}}>Cancelar</span>
        <Image
          src={cancel}
          className="imgButton ps-2"
          alt="Gravar"
          width={30}
          height={20}
        />
      </button>
  );
};

export default CancelAddIdolButton
