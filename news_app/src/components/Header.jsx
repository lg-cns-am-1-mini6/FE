import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">(LOGO)</div>
      <nav>
        <a href="/mypage">MYPAGE</a>
        <button className="logout-btn">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
