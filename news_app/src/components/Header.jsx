import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [login, setLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="header">
      <span
        className="header-btn header-logo"
        style={{ fontSize: "2rem" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Link to="/">
          NEW<span>jean</span>S
        </Link>
      </span>
      <nav className="header-btn">
        {login && <button onClick={() => setLogin(!login)}>Logout</button>}
        {!login && (
          <Link
            to="/login"
            className="header-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            LOG IN
          </Link>
        )}
        <div className={`menu-container ${isOpen ? "open" : "closed"}`}>
          <span
            className="header-btn"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            MY MENU
          </span>
          <ul
            class="dropdown-menu"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <li>
              <Link to="/MypageProfile">내 정보</Link>
            </li>
            <li>
              <Link to="/MypageKeyword">관심 주제</Link>
            </li>
            <li>
              <Link to="/MypageScrap">스크랩한 뉴스</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
