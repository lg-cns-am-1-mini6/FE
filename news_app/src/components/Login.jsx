import "./Login.css";

export default function Login() {
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
            <button>카카오 계정 로그인</button>
            <button>구글 계정 로그인</button>
          </div>
        </div>
      </div>
    </>
  );
}
