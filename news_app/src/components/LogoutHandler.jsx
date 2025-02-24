import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    setUserInfo({ name: null });
    localStorage.removeItem("accessToken");
    nav("/");

    axios
      .post(`http://localhost:8080/auth/sign-out`)
      .then((res) => {
        console.log(res.data.message);
        // 로그아웃 후 해야 할 일...
        localStorage.removeItem("accessToken");
      })
      .catch((err) => {
        console.log(`로그아웃 요청 실패: ${err}`);
      });
  }, []);
}
