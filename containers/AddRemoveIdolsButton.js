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
      id='newIdol'
        className="feedBtn btn btn-warning otbutton fw-bold blue"
        onClick={this.props.action}
      >
        Adicionar/Remover Ídolos 
      </button>
    );
  }
}
