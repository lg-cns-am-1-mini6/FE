import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    // 테스트 때문에 밖으로 뺌
    setUserInfo({ name: null });
    localStorage.removeItem("accesstoken");
    nav("/");

    axios
      .post(`/auth/sign-out`)
      .then((res) => {
        console.log(res.data.message);
        // 로그아웃 후 해야 할 일...
        setUserInfo({ name: null });
        localStorage.removeItem("accesstoken");
        // 리프레시 토큰 (쿠키) 삭제
        nav("/");
      })
      .catch((err) => {
        console.log(`로그아웃 요청 실패: ${err}`);
      });
  }, []);
}
