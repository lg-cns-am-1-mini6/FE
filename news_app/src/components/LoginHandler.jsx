import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginHandler() {
  const { setUserInfo } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    let domain = "";
    if (url.pathname.includes("google")) {
      domain = "google";
    } else if (url.pathname.includes("kakao")) {
      domain = "kakao";
    } else {
      console.log("로그인 오류");
    }
    console.log(`POST 요청 URL : /auth/${domain}/sign-in?code=${code}`);
    axios
      .post(`/auth/${domain}/sign-in?code=${code}`, {
        withCredentials: true,
      })
      .then((res) => {
        const accesstoken = res.headers.accesstoken;
        localStorage.setItem("accesstoken", accesstoken);

        axios
          .get(`/user`, { headers: { Authorization: `Bearer ${accesstoken}` } })
          .then((res) => {
            // TODO: 토큰 유효성, 재요청

            console.log(res.data.data);
            setUserInfo({
              username: res.data.data.name
                ? res.data.data.name
                : res.data.data.email,
              email: res.data.data.email,
            });
          })
          .catch((err) => {
            console.log("유저 정보 조회 실패", err);
          });

        nav("/");
      })
      .catch((err) => console.log(`코드 전송 실패 ${err}`));
  }, []);

  return (
    <div style={{ height: "50%", marginTop: "20%" }}>
      <h1>로그인 리다이렉션 중 ... </h1>
    </div>
  );
}
