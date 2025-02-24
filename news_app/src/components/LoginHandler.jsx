// import axios from "axios";

import axios from "axios";

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
        console.log(`코드 전송 완료: ${res}`);
      })
      .catch((err) => console.log(`코드 전송 실패 ${err}`));
  } catch (error) {
    console.log(`로그인 실패: ${error}`);
  }

  //window.location.href = "/";

  return (
    <div style={{ height: "50%", marginTop: "20%" }}>
      <h1>로그인 리다이렉션 중 ... </h1>
    </div>
  );
}
