import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    // 테스트 때문에 밖으로 뺌
    // setUserInfo({ username: null });
    // localStorage.removeItem("accesstoken");
    // nav("/");
    const accesstoken = localStorage.getItem("accesstoken");
    console.log(`로그아웃 요청: Bearer ${accesstoken}`);
    axios
      .post(`/auth/sign-out`, null, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        // 로그아웃 후 해야 할 일...
        setUserInfo({ username: null });
        localStorage.removeItem("accesstoken");
        // 리프레시 토큰 (쿠키) 삭제
        nav("/");
      })
      .catch((err) => {
        console.log(`로그아웃 요청 실패:`);
        console.log(err);
      });
  }, []);
}