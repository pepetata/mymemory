import React from "react";
// import Image from "next/image";
// import cancel from "../images/cancel.png";

const DeleteButton = (props) => {
  if (props.active)
  return (
      <button
        className="btn btn-danger otbutton"
        onClick={props.action}
      >
         <span style={{position: "relative"}}>Apagar memória</span>
      </button>
  );
  else return (      <button
    className="btn btn-danger otbutton"
    onClick={props.action}
    disabled
  >
     <span style={{position: "relative"}}>Apagar memória</span>
  </button>)
};

export default DeleteButton
