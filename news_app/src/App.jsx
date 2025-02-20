import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import Login from "./components/Login.jsx";
import BasicPage from "./components/basicPage.jsx";
import Mypage from "./components/Mypage.jsx";
import "./App.css";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
