import React, { Component } from "react";
import { useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = (props) => {
  const dispatch = useDispatch();
  //   const user = useSelector((state) => state.loading.value);
  // console.log("LoadingModal render ");

  return (
    <>
      <div className="loading centered">
        <Spinner animation="border" style={{ color: "#1f5088" ,           display: 'inline-block',
          width: '10rem',
          height: '10rem',
          verticalAlign: '-0.125em',
          border: '2em solid currentColor',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          WebkitAnimation: '0.75s linear infinite spinner-border',
          animation: '0.75s linear infinite spinner-border'
          }} />
      </div>
      <style jsx>{`
        .centered {
          position: fixed;
          top: 50%;
          left: 50%;
          /* bring your own prefixes */
          transform: translate(-50%, -50%);
          z-index: 3001;
        }

        .spinner-border {
          display: inline-block;
          width: 10rem;
          height: 10rem;
          vertical-align: -0.125em;
          border: 2em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          -webkit-animation: 0.75s linear infinite spinner-border;
          animation: 0.75s linear infinite spinner-border;
        }
        .loaderOpacity {
          background-color: transparent;
          width: 150px;
          border: none;
        }
        .loader {
          border: 16px solid $logoO;
          border-radius: 50%;
          border-top: 16px solid $logoB;
          width: 120px;
          height: 120px;
          -webkit-animation: spin 2s linear infinite; /* Safari */
          animation: spin 2s linear infinite;
        }

        .loading {
          .modal-dialog {
            width: 150px;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingSpinner;
