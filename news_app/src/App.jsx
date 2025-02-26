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
import { reissueToken } from "./components/apiCommon.js";

function App() {
  const [userInfo, setUserInfo] = useState({ username: null });

  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    if (accesstoken !== null) {
      axios
        .get(`http://localhost:8080/user`, { headers: { Authorization: `Bearer ${accesstoken}` } })
        .then((res) => {
          console.log("응답 데이터:", res.data);
          if (res.data.success) {
            setUserInfo({
              username: res.data.data.name,
              email: res.data.data.email,
              imageUrl: res.data.data.imageUrl,
            });
          } else {
            // 응답은 왔으나 success가 false인 경우 토큰 재발급 시도
            reissueToken()
              .then((newRes) => {
                console.log("재발급 후 처리:", newRes);
                // 필요시 원래 요청 재시도 로직 추가 가능
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          }
        })
        .catch((err) => {
          console.log("유저 정보 조회 실패:", err);
          if (err.response && err.response.status === 401) {
            reissueToken()
              .then((newRes) => {
                console.log("재발급 후 처리:", newRes);
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          }
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
            {/* 에러 페이지 등 추가 */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
