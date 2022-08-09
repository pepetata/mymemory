import React, { Component } from "react";
import Image from "next/image";
import check from "../images/check.png";

const ApplyButton = (props) => {
  return (
    <button className="btn btn-light dropdown-button" style={{width: "150px", height: "30px", textAlign: "center"}} onClick={props.action}>
     <span style={{position: "relative", bottom: "4px"}}>Aplicar Filtro</span>
      <Image
        src={check}
        className="imgButton ps-2"
        alt="Gravar"
        width={30}
        height={20}
      />
    </button>
  );
};

export default ApplyButton;
