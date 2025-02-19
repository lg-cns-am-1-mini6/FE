import React from "react";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import Login from "./components/Login.jsx";
import BasicPage from "./components/basicPage.jsx";
import Mypage from "./components/Mypage.jsx";

function App() {
  return (
    <div>
      <Header />
      {/* {<NewsSearch />} */}
      {/* <BasicPage /> */}
      {/* {<Login />} */}
      <Mypage />
    </div>
  );
}

export default App;
