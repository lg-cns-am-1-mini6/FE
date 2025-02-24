import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function LogoutHandler() {
  const nav = useNavigate();
  console.log("로그아웃");
  // 로그아웃 기능
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    setUserInfo({ name: null, email: null });
  }, []);

  //window.location.href = "/";
  nav("/");
}
