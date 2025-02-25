import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    console.log(`로그아웃 요청: Bearer ${accesstoken}`);
    axios
      .post(`/auth/sign-out`, null, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setUserInfo({ username: null });
        localStorage.removeItem("accesstoken");
        nav("/");
      })
      .catch((err) => {
        console.log(`로그아웃 요청 실패:`);
        console.log(err);
      });
  }, []);

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
      <h1>로그아웃 중... </h1>
      <h2>잠시만 기다려주세요</h2>
    </div>
  );
}
