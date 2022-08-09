import React, { Component } from "react";
import Image from "next/image";

import save from "../images/save.png";

export default class SaveButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="btn btn-warning otbutton"
        onClick={this.props.fun}
      >
         <span style={{position: "relative", bottom: "5px"}}>Gravar</span>
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
