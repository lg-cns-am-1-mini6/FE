import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import NewsSearch from "./components/NewsSearch.jsx";
import Login from "./components/Login.jsx";
import BasicPage from "./components/BasicPage.jsx";
import "./App.css";
import MypageProfile from "./components/MypageProfile.jsx";
import MypageKeyword from "./components/MypageKeyword.jsx";
import MypageScrap from "./components/MypageScrap.jsx";
import Footer from "./components/Footer.jsx";
import LoginHandler from "./components/LoginHandler.jsx";
import { UserContext } from "./components/UserContext.jsx";
import { useState } from "react";
import LogoutHandler from "./components/LogoutHandler.jsx";

function App() {
  const [userInfo, setUserInfo] = useState({ name: null });
  if (localStorage.getItem("accessToken") !== null) {
    // TODO: 액세스 토큰으로 유저 정보 가져오기

    // 일단은 mock data 활용
    fetch("/scrap_mock.json")
      .then((res) => res.json())
      .then((data) => setUserInfo(data.data));
  }

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <Router>
        <div className="app-contents">
          <Header />
          <Routes>
            <Route path="/" element={<BasicPage />} />
            <Route path="/NewsSearch" element={<NewsSearch />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/MypageProfile" element={<MypageProfile />} />
            <Route path="/MypageKeyword" element={<MypageKeyword />} />
            <Route path="/MypageScrap" element={<MypageScrap />} />

            {/* 로그인용 */}
            <Route
              path="/login/oauth2/code/google"
              element={<LoginHandler />}
            />
            <Route path="/login/oauth2/code/kakao" element={<LoginHandler />} />
            <Route path="/login/oauth2/code/test" element={<LoginHandler />} />
            <Route path="/logout" element={<LogoutHandler />} />

            {/* 에러 페이지 : 잘못된 경로도 포함해야 */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
