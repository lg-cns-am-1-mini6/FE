import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPopup from "./Error";
import "./MypageScrap.css";

function ScrapCard({ articleId, title, content, link, onDelete }) {
  return (
    <div className="card-box">
      <div className="card-text">
        <h2>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h2>
        <p>{content}</p>
      </div>
      <button className="card-delete-btn" onClick={() => onDelete(articleId)}>
        X
      </button>
    </div>
  );
}

export default function MypageScrap() {
  const [username, setUsername] = useState("");
  const [newslist, setNewslist] = useState([]);
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const currentUserId = "member1";

  const fetchScrapData = () => {
    axios
      .get("/api/article/scrap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_access_token",
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setUsername(data.data.username);
          setNewslist(data.data.articles);
          // 만약 스크랩한 기사가 없으면 404 오류 (스크랩 기사 없음)
          if (data.data.articles.length === 0) {
            setError({ code: 404, message: "스크랩한 기사가 없습니다!" });
          }
        } else {
          // 예시: 로그인 안 한 경우(404) 혹은 권한 부족(401)
          if (data.code === 401) {
            setError({ code: 401, message: "관리자 권한이 필요합니다." });
          } else if (data.code === 404 && data.data?.reason === "NotLoggedIn") {
            setError({
              code: 404,
              message: "로그인 해주세요",
              redirect: true,
              redirectUrl: "/login",
            });
          } else {
            setError({
              code: data.code || 500,
              message: data.data?.reason || "알 수 없는 오류가 발생했습니다.",
            });
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setError({ code: 401, message: "관리자 권한이 필요합니다." });
          } else if (error.response.status === 404) {
            // 예시로 로그인 에러와 스크랩 기사 없음 두 경우를 구분
            // (실제 상황에서는 백엔드 응답에 따라 분기)
            if (!currentUserId) {
              setError({
                code: 404,
                message: "로그인 해주세요",
                redirect: true,
                redirectUrl: "/login",
              });
            } else {
              setError({ code: 404, message: "스크랩한 기사가 없습니다!" });
            }
          } else {
            setError({ code: error.response.status, message: "서버 오류" });
          }
        } else {
          setError({ code: 500, message: "알 수 없는 오류가 발생했습니다." });
        }
        console.error("스크랩 데이터 로드 중 오류 발생", error);
      });
  };

  useEffect(() => {
    fetchScrapData();
  }, []);

  const handleDelete = (articleId) => {
    axios
      .delete("/api/article/scrap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_access_token",
        },
        data: { articleId },
      })
      .then((response) => {
        if (response.data.success) {
          setNewslist(newslist.filter((item) => item.articleId !== articleId));
        } else {
          setError({
            code: 500,
            message: response.data.data?.reason || "스크랩 삭제에 실패했습니다.",
          });
          console.error("스크랩 삭제에 실패했습니다.");
        }
      })
      .catch((error) => {
        setError({ code: 500, message: "스크랩 삭제 중 오류 발생" });
        console.error("스크랩 삭제 중 오류 발생", error);
      });
  };

  const resetList = () => {
    console.log("원래대로 버튼 클릭");
    fetchScrapData();
  };

  const saveChanges = () => {
    const updatedArticleIds = newslist.map((item) => item.articleId);
    axios
      .put(
        "/api/article/scrap",
        { articleId: updatedArticleIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer your_access_token",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          console.log("수정사항이 저장되었습니다.");
        } else {
          setError({
            code: 500,
            message: response.data.data?.reason || "수정사항 저장에 실패했습니다.",
          });
          console.error("수정사항 저장에 실패했습니다.");
        }
      })
      .catch((error) => {
        setError({ code: 500, message: "수정사항 저장 중 오류 발생" });
        console.error("수정사항 저장 중 오류 발생", error);
      });
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
        <h3>스크랩한 기사 목록</h3>
        <span className="horizonalBar"></span>
      </div>

      <div className="card-list">
        {newslist.length > 0 ? (
          newslist.map((news) => (
            <ScrapCard
              key={news.articleId}
              articleId={news.articleId}
              title={news.title}
              content={news.content}
              link={news.link}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div style={{ textAlign: "center" }}>스크랩한 기사가 없습니다</div>
        )}
      </div>

      <div className="custom-btn-container">
        <button
          className="custom-btn"
          onClick={() => {
            navigate("/");
          }}
        >
          맞춤 추천 기사 보러 가기
        </button>
      </div>

      <div className="scrap-buttons">
        <button onClick={resetList}>원래대로</button>
        <button onClick={saveChanges}>수정사항 저장</button>
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
