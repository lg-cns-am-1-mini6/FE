import "./Login.css";

export default function Login() {
  const googleLogin = () => {
    console.log("구글 로그인");
  };

  const kakaoLogin = () => {
    console.log("카카오 로그인");
  };

  return (
    <>
      <div className="login-container">
        <div className="loginbox">
          <div className="text-art">
            <span className="horizonalBar"></span>
            <span>소셜 로그인</span>
            <span className="horizonalBar"></span>
          </div>
          <br></br>
          <div className="login-buttons">
            <button onClick={kakaoLogin}>카카오 계정 로그인</button>
            <button onClick={googleLogin}>구글 계정 로그인!</button>
          </div>
        </div>
      </div>
    </>
  );
}
