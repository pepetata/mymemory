import React, { Component } from "react";
import Image from "next/image";
import Link from "next/link";

import cancel from "../images/cancel.png";

const CancelButton = (props) => {
  return (
    <Link href={props.href} passHref>
      <button
        className="btn btn-light otbutton"
        // onClick={this.props.fun}
      >
        <span style={{position: "relative", bottom: "5px"}}>Cancelar</span>
        <Image
          src={cancel}
          className="imgButton  ps-2"
          alt="Cancelar"
          width={30}
          height={20}
        />
      </button>
    </Link>
  );
};

export default CancelButton
