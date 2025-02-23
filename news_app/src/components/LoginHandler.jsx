// import axios from "axios";

export default function LoginHandler() {
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log({ code });
    // axios
    //   .post("/auth/google/sign-in", { code })
    //   .then((res) => {
    //     console.log(res);
    //     // 코드 보내고 이제 해야 되는 게....
    //   })
    //   .catch((err) => console.log(`코드 전송 실패 ${err}`));
  } catch (error) {
    console.log(`로그인 실패: {error}`);
  }

  window.location.href = "/";

  return (
    <div style={{ height: "50%", marginTop: "20%" }}>
      <h1>로그인 리다이렉션 중 ... </h1>
    </div>
  );
}
