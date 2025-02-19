import React from "react";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import BasicPage from "./components/basicPage.jsx";
import Login from "./components/Login.jsx";

function App() {
  return (
    <div>
      <Header />
      {/* {<NewsSearch />} */}
      {/* <BasicPage /> */}
      {<Login />}
    </div>
  );
}

export default App;
