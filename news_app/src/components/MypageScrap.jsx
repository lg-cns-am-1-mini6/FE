import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorPopup from "./Error";
import "./MypageScrap.css";
import { UserContext } from "./UserContext";

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
  const { userInfo } = useContext(UserContext);
  const [newslist, setNewslist] = useState([]);
  const [error, setError] = useState(null); // 오류 상태
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchScrapData = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("/api/article/scrap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setNewslist(data.data.articles);
          if (data.data.articles.length === 0) {
            setError({ code: 404, message: "스크랩한 기사가 없습니다!" });
          }
        } else {
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
    // 지금은 하드코딩...
    setNewslist(userInfo.articles);
    //fetchScrapData();
  }, []);

  const handleDelete = (articleId) => {
    const token = localStorage.getItem("accessToken");
    axios
      .delete("/api/article/scrap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { articleId },
      })
      .then((response) => {
        if (response.data.success) {
          setNewslist(newslist.filter((item) => item.articleId !== articleId));
        } else {
          setError({
            code: 500,
            message:
              response.data.data?.reason || "스크랩 삭제에 실패했습니다.",
          });
          console.error("스크랩 삭제에 실패했습니다.");
        }
      })
      .catch((error) => {
        setError({ code: 500, message: "스크랩 삭제 중 오류 발생" });
        console.error("스크랩 삭제 중 오류 발생", error);
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
