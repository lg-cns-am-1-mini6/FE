import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function LoginHandler() {
  try {
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

    console.log(
      `POST 요청 URL : http://localhost:8080/auth/${domain}/sign-in?code=${code}`
    );

    axios
      .post(`http://localhost:8080/auth/${domain}/sign-in?code=${code}`)
      // .post(`/auth/${domain}/sign-in?code=${code}`)
      .then((res) => {
        console.log(`코드 전송 완료: ${res.data.message}`);
        // 토큰 저장
        const accessToken = res.headers.accessToken;
        localStorage.setItem("accessToken", accessToken);
        // TODO : 토큰으로 유저 정보 가져오기
        // 일단은 하드코딩
        const { setUserInfo } = useContext(UserContext);
        setUserInfo({ username: "팜하니" });

        nav("/");
      })
      .catch((err) => console.log(`코드 전송 실패 ${err}`));
  } catch (error) {
    console.log(`로그인 실패: ${error}`);
  }

  // 안보이겠지만 혹시나...
  return (
    <div style={{ height: "50%", marginTop: "20%" }}>
      <h1>로그인 리다이렉션 중 ... </h1>
    </div>
  );
}
