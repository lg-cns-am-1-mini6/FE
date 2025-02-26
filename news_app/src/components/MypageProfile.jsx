import { useState, useEffect, useContext, useRef } from "react";
import "./MypageProfile.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";
import axios from "axios";
import { reissueToken } from "./apiCommon"; // 공통 로직 import
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

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
  const [renderKey, setRenderKey] = useState(0);

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

  // 이미지 변하면...
  useEffect(() => {
    //console.log(file);
    //console.log("이미지 URL", image);
  }, [image]);

  // 마운트 될 때 한 번
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
          // 성공시
          setScrapLength(response.data.data.length);
        } else if (response.data.status == 401) {
          reissueToken(response);
        } else {
          console.log("알 수 없는 오류");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const downloadProfile = async () => {
    if (!captureRef.current) return;
    console.log("다운로드 버튼 클릭");

    document.querySelectorAll(".profile-button").forEach((btn) => {
      btn.style.display = "none";
    });

    const replaceInputsWithDivs = () => {
      document.querySelectorAll(".profile-content input").forEach((input) => {
        const div = document.createElement("div");
        div.textContent = input.value;
        div.style.cssText = window.getComputedStyle(input).cssText;
        div.style.borderBottom = "none";
        div.style.padding = "5px 0";
        div.style.display = "inline-block";
        div.style.width = input.offsetWidth + "px";
        div.style.color = "var(--main-color)";
        div.style.marginLeft = "1rem";

        input.dataset.prevElement = input.outerHTML; // 나중에 되돌리기 위해 저장
        input.parentNode.replaceChild(div, input);
      });
    };

    try {
      replaceInputsWithDivs();
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        scale: window.devicePixelRatio,
        backgroundColor: null,
        logging: false,
        useClassList: true,
      });

      if (!(canvas instanceof HTMLCanvasElement)) {
        console.error("html2canvas가 캔버스를 반환하지 않음", canvas);
        return;
      }

      const image = canvas.toDataURL("image/png"); // 이미지 URL 변환
      const link = document.createElement("a");
      link.href = image;
      link.download = "mypage-profile.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setRenderKey((prev) => prev + 1);
    } catch (err) {
      console.error("이미지 캡처 실패:", err);
    }
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

    // 이미지 s3에 저장하기...
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
          } else if (res.data.status == 401) {
            reissueToken(res);
          } else {
            console.log("알 수 없는 오류: presigned-url로의 요청 실패 ");
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
          return image; // 실패 시 기존 이미지 유지하기
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
          } else if (res.data.status == 401) {
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
      <div className="profile-container" ref={captureRef} key={renderKey}>
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
            <div>
              <span>스크랩한 수</span>{" "}
              <span
                style={{
                  color: "var(--main-color)",
                }}
              >
                {scrapLength}
              </span>
            </div>
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
