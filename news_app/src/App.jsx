import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import Login from "./components/Login.jsx";
import BasicPage from "./components/basicPage.jsx";
import Mypage from "./components/Mypage.jsx";
import "./App.css";
import MypageProfile from "./components/MypageProfile.jsx";
import MypageKeyword from "./components/MypageKeyword.jsx";
import MypageScrap from "./components/MypageScrap.jsx";
import Footer from "./components/Footer.jsx";
import LoginHandler from "./components/LoginHandler.jsx";

const loginContext = createContext();
const loginProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
};

function App() {
  return (
    <Router>
      <div className="app-contents">
        <Header />
        <Routes>
          <Route path="/" element={<BasicPage />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/NewsSearch" element={<NewsSearch />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/MypageProfile" element={<MypageProfile />} />
          <Route path="/MypageKeyword" element={<MypageKeyword />} />
          <Route path="/MypageScrap" element={<MypageScrap />} />
          {/* 로그인용 */}
          <Route path="/login/oauth2/code/google" element={<LoginHandler />} />
          <Route path="/login/oauth2/code/kakao" element={<LoginHandler />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
