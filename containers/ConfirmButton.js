import React, { Component } from "react";
import Image from "next/image";

import save from "../images/save.png";

export default class extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="btn btn-warning otbutton"
        onClick={this.props.action}
      >
        <span style={{position: "relative", bottom: "4px"}}>Confirmar</span> 
        <Image
          src={save}
          className="imgButton ps-2"
          alt="Gravar"
          width={30}
          height={20}
        />
      </button>
    );
  }
}
