import React from "react";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import Login from "./components/Login.jsx";
import BasicPage from "./components/basicPage.jsx";
import Mypage from "./components/Mypage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-contents">
      <Header />
      {/* <Mypage /> */}
      {/* {<NewsSearch />} */}
      <BasicPage />
      {/* {<Login />} */}
    </div>
  );
}

export default App;
