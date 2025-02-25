import { useContext, useEffect } from "react";
import "./Login.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUserInfo } = useContext(UserContext);
  const nav = useNavigate();

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

  const testLogin = () => {
    fetch("/scrap_mock.json")
      .then((res) => {
        console.log(res.headers);
        const accessToken = `MY_TEST_TOKEN`;
        localStorage.setItem("accessToken", accessToken);
        return res.json();
      })
      .then((data) => {
        console.log(data.data);
        setUserInfo(data.data);
      });
    nav("/");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <header className="mypage-header">
        <h1>LOG IN</h1>
        <p>소셜 계정으로 로그인할 수 있습니다</p>
      </header>
      <div className="loginbox">
        <div className="login-buttons">
          <button onClick={kakaoLogin}>카카오 계정 로그인</button>
          <button onClick={googleLogin}>구글 계정 로그인</button>
        </div>
      </div>
    </>
  );
}
