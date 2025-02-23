import { useState, useEffect } from "react";
import "./MypageProfile.css";

export default function MypageProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  // 현재 로그인한 사용자의 id (추후 인증 로직에 따라 변경 가능)
  const currentUserId = "member1";

  // mock data에서 현재 사용자의 프로필 정보를 가져오는 함수
  const fetchProfileData = () => {
    fetch("/result_mock.json")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.members.find(
          (member) => member.id === currentUserId
        );
        if (currentUser) {
          setUsername(currentUser.username);
          setEmail(currentUser.user_email);
          // image가 null이 아닌 경우에만 설정 (null이면 기본 이미지 등 처리 가능)
          if (currentUser.image) {
            setImage(currentUser.image);
          }
        }
      })
      .catch((err) =>
        console.error("프로필 데이터를 불러오는 중 오류 발생:", err)
      );
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 파일 선택 시, 로컬 미리보기를 위해 URL을 생성
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("변경사항 저장", { username, email, image });
    // 여기에 서버로 변경사항을 전송하는 로직 추가 가능
  };

  return (
    <>
      <header className="mypage-header">
        <h1>MY PAGE</h1>
        <p>{username && `${username}님, 안녕하세요`}</p>
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
            style={{ backgroundImage: image ? `url(${image})` : "none" }}
          ></div>
        </div>
        <div className="profile-info">
          <div className="profile-content">
            <p>{username}</p>
            <p>{email}</p>
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
    </>
  );
}
