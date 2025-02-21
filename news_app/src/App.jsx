import React from "react";
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
