import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { reissueToken } from "./apiCommon";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    console.log(`로그아웃 요청: Bearer ${accesstoken}`);

    const signOut = (token) => {
      axios
        .post(`/auth/sign-out`, null, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => {
          setUserInfo({ username: null });
          localStorage.removeItem("accesstoken");
          nav("/");
        })
        .catch((err) => {
          console.log("로그아웃 요청 실패:");
          if (err.response && err.response.status === 401) {
            reissueToken()
              .then((newRes) => {
                const newToken = localStorage.getItem("accesstoken");
                console.log(
                  `새로운 토큰으로 로그아웃 재시도: Bearer ${newToken}`
                );
                signOut(newToken);
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          } else {
            console.log(err);
          }
        });
    };

    signOut(accesstoken);
  }, [nav, setUserInfo]);

  return (
    <div
      style={{
        height: "50%",
        marginTop: "20%",
        alignSelf: "center",
        color: "var(--main-color)",
        textAlign: "center",
      }}
    >
      <h1>로그아웃 중...</h1>
      <h2>잠시만 기다려주세요</h2>
    </div>
  );
}
