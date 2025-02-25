import { useState, useEffect, useContext } from "react";
import "./MypageProfile.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";
import axios from "axios";
import { handleApiResponse } from "./apiCommon"; // 공통 로직 import

export default function MypageProfile() {
  const { userInfo } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(userInfo.username);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(userInfo.email);
  const accesstoken = localStorage.getItem("accesstoken");

  // 로그인 여부 체크
  useEffect(() => {
    if (!accesstoken) {
      setError({
        code: 404,
        message: "로그인 해주세요",
        redirect: true,
        redirectUrl: "/login",
      });
    }
  }, [accesstoken]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 파일 선택 시, 로컬 미리보기를 위해 URL을 생성
      console.log(URL.createObjectURL(file));
      setImage(URL.createObjectURL(file));
    } else {
      console.log("파일 선택 오류");
    }
  };

  const handleSave = () => {
    console.log("변경사항 저장");
    // 서버로 전송할 데이터
    const userData = { username, email };

    axios
      .post(`/user`, userData, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      })
      .then((res) => {
        console.log("응답 데이터:", res.data);
        handleApiResponse(res); // 공통 로직으로 처리
      })
      .catch((err) => console.log("요청 에러:", err));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <header className="mypage-header">
        <h1>MY PAGE</h1>
        <p>{userInfo.username && `${userInfo.username}님, 안녕하세요`}</p>
      </header>
      <br />
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>개인정보 수정</h3>
        <span className="horizonalBar"></span>
      </div>
      <div className="profile-container">
        <div className="profile-image-area">
          <div
            className="profile-image"
            style={{
              backgroundImage: userInfo.image
                ? `url(${userInfo.image})`
                : "none",
            }}
          ></div>
        </div>
        <div className="profile-info">
          <div className="profile-content">
            <div>
              <span>유저ID</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <span>e-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="fileInput" className="profile-button">
              사진 업로드
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button className="profile-button" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      </div>
      {/* 오류 팝업 */}
      {error && (
        <ErrorPopup
          code={error.code}
          message={error.message}
          onClose={() => setError(null)}
          redirect={error.redirect}
          redirectUrl={error.redirectUrl}
        />
      )}
    </>
  );
}
