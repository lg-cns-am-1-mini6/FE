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
      .post(`https://newjeans.site/auth/${domain}/sign-in?code=${code}`)
      .then((res) => {
        console.log(`코드 전송 완료 : ${res.data.data.message}`);
        console.log(res.headers);

        // 토큰 저장
        const accesstoken = res.headers.accesstoken;
        localStorage.setItem("accesstoken", accesstoken);

        console.log("유저 정보 가져오기");

        // 유저 정보 가져오기
        console.log(`accesstoken: Bearer ${accesstoken}`);
        axios
          .get(`/user`, { headers: { Authorization: `Bearer ${accesstoken}` } })
          .then((res) => {
            console.log(res.data.data);
            setUserInfo({
              username: res.data.data.email,
              email: res.data.data.email,
            });
          })
          .catch((err) => {
            console.log("유저 정보 조회 실패", err);
          });

        // 일단 하드코딩...
        setUserInfo({ username: "test-account" });

        nav("/");
      })
      .catch((err) => console.log(`코드 전송 실패 ${err}`));
  }, []);
  // axios
  //   .post(`https://newjeans.site//auth/${domain}/sign-in?code=${code}`)
  //   .then((res) => {
  //     console.log(`코드 전송 완료: ${res.data.message}`);
  //     // 토큰 저장
  //     const accessToken = res.headers.accessToken;
  //     localStorage.setItem("accessToken", accessToken);

  //     // 유저 정보 가져오기
  //     // axios.get(`/api/user`).then(res=>console.log(data));

  //     // 일단 하드코딩...
  //     setUserInfo({ username: "test-account" });

  //     nav("/");
  //   })
  //   .catch((err) => console.log(`코드 전송 실패 ${err}`));

  // 안보이겠지만 혹시나...
  return (
    <div style={{ height: "50%", marginTop: "20%" }}>
      <h1>로그인 리다이렉션 중 ... </h1>
    </div>
  );
}
