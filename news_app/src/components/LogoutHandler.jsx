import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function LogoutHandler() {
  console.log("로그아웃");
  // 로그아웃 기능
  const { setUserInfo } = useContext(UserContext);

  useEffect(() => {
    setUserInfo({ name: null, email: null });
  }, []);

  window.location.href = "/";
}
