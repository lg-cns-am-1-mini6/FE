import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [login, setLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="header">
      <span className="header-btn header-logo" style={{fontSize: "2rem"}}>
        <Link to="/">NEWjeanS</Link>
      </span>
      <nav className="header-btn">
        {login && (
          <button onClick={() => setLogin(!login)}>
            Logout
          </button>
        )}
        {!login && (
          <Link to="/login" className="header-btn">
            LOG IN
          </Link>
        )}
        <div className="menu-container">
          <span className="header-btn" onClick={() => setIsOpen((prev) => !prev)}>MY MENU</span>
          {isOpen && (
            <ul class="dropdown-menu">
              <li>
                <Link to="/MypageProfile">MY PAGE</Link>
              </li>
              <li>
                <Link to="/MypageKeyword">관심 주제</Link>
              </li>
              <li>
                <Link to="/MypageScrap">스크랩한 뉴스</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
