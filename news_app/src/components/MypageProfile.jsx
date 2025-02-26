import { useState, useEffect, useContext, useRef } from "react";
import "./MypageProfile.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";
import axios from "axios";
import { reissueToken } from "./apiCommon";
// html2canvas 라이브러리 추가
import html2canvas from "html2canvas";

export default function MypageProfile() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(userInfo.username);
  const [image, setImage] = useState(userInfo.imageUrl);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const accesstoken = localStorage.getItem("accesstoken");
  const [scrapLength, setScrapLength] = useState("로딩중");
  const captureRef = useRef(null);

  // 화면 맨 위로 올리기
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  // 마운트 될 때 스크랩한 수 가져오기
  useEffect(() => {
    axios
      .get("/articles/scrap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setScrapLength(response.data.data.length);
        } else if (response.data.status === 401) {
          reissueToken(response);
        } else {
          console.log("알 수 없는 오류");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // 프로필 영역 캡처 및 이미지 다운로드
  const downloadProfile = () => {
    if (!captureRef.current) return;
    console.log("다운로드 버튼 클릭");
    html2canvas(captureRef.current, { useCORS: true })
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageData;
        downloadLink.download = "profile-image.png";
        // 링크를 DOM에 추가한 후 클릭하고 제거하여 다운로드 트리거
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((err) => console.error("프로필 이미지 캡처 오류:", err));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file0 = e.target.files[0];
      const fileUrl = URL.createObjectURL(file0);
      setFile(file0);
      setPreview(fileUrl);
    } else {
      console.log("파일 선택 오류");
    }
  };

  const handleSave = () => {
    console.log("변경사항 저장");
    let uploadPromise = Promise.resolve(image);

    // 이미지 S3에 저장하기
    if (file) {
      console.log("파일 업로드 시도 중");
      uploadPromise = axios
        .post(
          `/image/presigned-url`,
          { imageName: userInfo.email.replace(".", "") },
          {
            headers: { Authorization: `Bearer ${accesstoken}` },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success) {
            const presigned = res.data.data.imageUrl;
            const parsed = presigned.split("?")[0];
            console.log("pre-signed url: ", presigned);

            return axios
              .put(presigned, file, {
                headers: {
                  "Content-Type": "application/octet-stream",
                },
              })
              .then(() => parsed);
          } else if (res.data.status === 401) {
            reissueToken(res);
          } else {
            console.log("알 수 없는 오류: presigned-url 요청 실패");
          }
        })
        .then((parsed) => {
          console.log("parsed:", parsed);
          setImage(parsed);
          setPreview(null);
          return parsed;
        })
        .catch((err) => {
          console.log("파일 업로드 실패", err);
          return image; // 실패 시 기존 이미지 유지
        });
    }

    uploadPromise.then((updatedImageUrl) => {
      const userData = { name: username, imageUrl: updatedImageUrl };
      console.log("유저 정보 업데이트:", { userData });
      axios
        .patch(`/user`, userData, {
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            console.log(
              `변경사항 전송 완료: ${res.data.data.email}, ${res.data.data.name}, ${res.data.data.imageUrl}`
            );
            setUserInfo({
              email: res.data.data.email,
              username: res.data.data.name,
              imageUrl: res.data.data.imageUrl,
            });
          } else if (res.data.status === 401) {
            reissueToken(res);
          }
        })
        .catch((err) => console.log(err));
    });
  };

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
      {/* 캡처할 영역 */}
      <div className="profile-container" ref={captureRef}>
        <div className="profile-image-area">
          <div
            className="profile-image"
            style={{
              backgroundImage: `url(${preview || image})`,
            }}
          ></div>
        </div>
        <div className="profile-info">
          <div className="profile-content">
            <div>
              <span>닉네임</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <span>e-mail</span>
              <input readOnly type="email" value={userInfo.email} />
            </div>
            <span>스크랩한 수</span>{" "}
            <span style={{ color: "var(--main-color)" }}>
              {scrapLength}
            </span>
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
      <div>
        <button className="profile-download" onClick={downloadProfile}>
          내 프로필 다운로드
        </button>
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
