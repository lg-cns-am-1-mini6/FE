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
}
