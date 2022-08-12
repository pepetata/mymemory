import React, { Component } from "react";
import Image from "next/image";

import user from "../images/user.png";

export default class SigninButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="btn btn-warning otbutton"
        style={{backgroundColor:"#fff4e5", borderColor:"#fff4e5"}}
        onClick={this.props.fun}
        title="Clique para se registrar no sistema."
      >
         <span style={{position: "relative",  bottom: "5px", color:"#1f5088"}}><strong>Entrar</strong></span>
        <Image
          src={user}
          className="imgButton ps-2"
          alt="Entrar"
          width={30}
          height={20}
        />
      </button>
    );
  }
}
