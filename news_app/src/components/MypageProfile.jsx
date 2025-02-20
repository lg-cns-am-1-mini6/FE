import { useState } from "react";
import "./MypageProfile.css";

export default function MypageProfile() {
  const [username] = useState("hong");
  const [email] = useState("hong@example.com");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("변경사항 저장", image);
    // 여기서 서버로 변경사항 전송하는 로직 구현
  };

  return (
    <>
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>{username}님, 안녕하세요</p>
      </header>
      <br></br>
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>개인정보 수정</h3>
        <span className="horizonalBar"></span>
      </div>
      <div className="profile-container">
        <div className="profile-image-area">
          <div
            className="profile-image"
            style={{ backgroundImage: image ? `url(${image})` : "none" }}
          ></div>
          <label htmlFor="fileInput" className="upload-button">
            사진 업로드
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-info">
          <p className="profile-name">{username}</p>
          <p className="profile-email">{email}</p>
        </div>
        <button className="save-button" onClick={handleSave}>
          저장
        </button>
      </div>
    </>
  );
}
