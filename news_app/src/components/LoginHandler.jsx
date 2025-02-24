// import axios from "axios";

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
        // 로그인 성공 후 동작해야 할 코드
        // userInfo가 아니라 토큰인가...?
        const { setUserInfo } = useContext(UserContext);
        const userData = { name: "고길동", email: "mrgo@example.com" };
        setUserInfo(userData);
        window.location.href = "/";
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
