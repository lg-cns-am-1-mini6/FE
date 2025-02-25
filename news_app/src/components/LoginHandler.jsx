import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { reissueToken } from "./apiCommon";

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
      .post(`/auth/${domain}/sign-in?code=${code}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        const accesstoken = res.headers.accesstoken;
        localStorage.setItem("accesstoken", accesstoken);
        axios
          .get(`/user`, { headers: { Authorization: `Bearer ${accesstoken}` } })
          .then((res) => {
            if (res.data.success) {
              setUserInfo({
                username: res.data.data.name,
                email: res.data.data.email,
                imageUrl: res.data.data.imageUrl,
              });
            } else if (res.data.status == 401) {
              reissueToken(res);
            } else {
              console.log("알 수 없는 오류");
              console.log(res);
            }
          })
          .catch((err) => {
            console.log("유저 정보 조회 실패", err);
          });

        nav("/");
      })
      .catch((err) => console.log(`코드 전송 실패 ${err}`));
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
      <h1>로그인 중 ... </h1>
      <h2>잠시만 기다려주세요</h2>
    </div>
  );
}
