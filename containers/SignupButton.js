import React, { Component } from "react";
import Image from "next/image";

export default class SignupButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="btn btn-warning otbutton"
        onClick={this.props.fun}
        title="Clique para se cadastrar no sistema."
      >
         <span style={{position: "relative", color:"#1f5088"}}><strong>Cadastre-se</strong></span>
      </button>
    );
  }
}
