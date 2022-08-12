import React, { Component } from "react";
import Image from "next/image";

import logo20 from "../images/logo20.png";

export default class NewMemoryButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="btn btn-warning otbutton"
        style={{backgroundColor:"#fff4e5", borderColor:"#fff4e5", width: "125px"}}
        onClick={this.props.fun}
        title="Clique para criar sua própria memória."
      >
         <span style={{position: "relative", bottom: "5px", color:"#1f5088"}}><strong>Nova Memória</strong></span>
         <Image
          src={logo20}
          className="imgButton ps-2"
          alt="Gravar"
          width={30}
          height={20}
        />
      </button>
    );
  }
}
