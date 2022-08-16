import React, { Component } from "react";
import Image from "next/image";

import logo from "../images/logo20.png";

export default class AddMemoryButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button className="btn btn-warning otbutton" onClick={this.props.fun}>
      <span style={{ position: "relative", bottom: "5px" }}>
        Nova Memória
      </span>
      <Image
        src={logo}
        className="imgButton ps-2"
        alt="Nova Memória"
        width={30}
        height={20}
      />
    </button>
    );
  }
}
