import { useEffect } from "react";
import "./Login.css";
import { useLocation, useSearchParams } from "react-router-dom";

export default function Login() {
  const googleLogin = () => {
    const redirectUrl = `http://localhost:5173/login/oauth2/code/google`;
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=811961721537-tkh0nscnnca6jimfl8n6t39ocgulaq4o.apps.googleusercontent.com&redirect_uri=${redirectUrl}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    window.location.href = loginUrl;
  };

  const kakaoLogin = () => {
    const redirectUrl = `http://localhost:5173/login/oauth2/code/kakao`;
    const loginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=cde8f9b64bcac0cefbfc787a71278ca0&redirect_uri=${redirectUrl}`;
    window.location.href = loginUrl;
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
            <button onClick={googleLogin}>구글 계정 로그인</button>
          </div>
        </div>
      </div>
    </>
  );
}
