import React from "react";
import Image from "next/image";
import Link from "next/link";

import backToTop from "../images/back-to-top40.png";

const BackToTopButton = (props) => {
  return (
    <>
      <div className="backDiv">
        <Link href="#header">
          <a>
            <Image
              src={backToTop}
              className="ps-2 childDiv"
              alt="Voltar ao inicio"
              width={50}
              height={40}
            />
          </a>
        </Link>
      </div>
      <style global jsx>{`
        .backDiv {
          position: fixed;
          bottom: 40px;
          right: 10px;
          z-index: 3;
          }
        }
        .childDiv {
          width: 130px;
          height: 130px;
          position: absolute;
          background-color: green;
        }
      `}</style>
    </>
  );
};

export default BackToTopButton;
