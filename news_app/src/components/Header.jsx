import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [login, setLogin] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">NEWjeanS</Link>
      </div>
      <nav className="header-btn">
        <Link to="/mypage">MYPAGE</Link>
        {login && (
          <button className="logout-btn" onClick={() => setLogin(!login)}>
            Logout
          </button>
        )}
        {!login && (
          <Link to="/login" className="logout-btn">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
