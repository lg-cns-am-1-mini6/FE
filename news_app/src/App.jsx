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
import { useEffect, useState } from "react";
import LogoutHandler from "./components/LogoutHandler.jsx";
import axios from "axios";
import Admin from "./components/Admin.jsx";

function App() {
  const [userInfo, setUserInfo] = useState({ username: null });

  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    if (accesstoken !== null) {
      axios
        .get(`/user`, { headers: { Authorization: `Bearer ${accesstoken}` } })
        .then((res) => {
          setUserInfo({
            username: res.data.data.name,
            email: res.data.data.email,
            imageUrl: res.data.data.imageUrl,
          });
        })
        .catch((err) => {
          console.log("유저 정보 조회 실패", err);
        });
    }
  }, []);

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
            <Route path="/admin" element={<Admin />} />
            {/* 에러 페이지 : 잘못된 경로도 포함해야 */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
