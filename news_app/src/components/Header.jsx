import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [login, setLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">NEWjeanS</Link>
      </div>
      <nav className="header-btn">
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
        <div class="menu-container">
          <span onClick={() => setIsOpen((prev) => !prev)}>MY MENU</span>
          {isOpen && (
            <ul class="dropdown-menu">
              <li>
                <Link to="/mypage">MY PAGE</Link>
              </li>
              <li>
                <Link to="/mypage">관심 주제</Link>
              </li>
              <li>
                <Link to="/mypage">스크랩한 뉴스</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
