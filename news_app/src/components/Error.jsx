import React from "react";
import "./Error.css";

const ErrorPopup = ({ code, message, onClose, redirect, redirectUrl }) => {
  return (
    <div className="error-overlay">
      <div className="error-popup">
        <h2>Error {code}</h2>
        <p>{message}</p>
        <div className="error-buttons">
          {redirect ? (
            <button onClick={() => window.location.assign(redirectUrl)}>
              로그인 하러가기
            </button>
          ) : (
            <button onClick={onClose}>닫기</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
