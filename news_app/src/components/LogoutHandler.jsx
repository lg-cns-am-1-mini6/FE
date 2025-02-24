import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutHandler() {
  const nav = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    setUserInfo({ name: null });
  }, []);

  // 테스트 중이라 밖으로 뺐음
  console.log("로그아웃");
  localStorage.removeItem("accessToken");

  // 로그아웃 요청
  axios
    .post(`http://localhost:8080/auth/sign-out`)
    .then((res) => {
      console.log(res.data.message);
      // 로그아웃 후 해야 할 일...
      localStorage.removeItem("accessToken");
    })
    .catch((err) => {
      console.log(err);
    });

  nav("/");
}
