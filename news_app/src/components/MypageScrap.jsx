import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 현재 로그인한 사용자 id (추후 인증 방식에 따라 동적으로 변경 가능)
  const currentUserId = "member1";

  // 백엔드 API (/api/article/scrap)로부터 스크랩 기사 조회
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
        } else {
          console.error("스크랩 데이터를 불러오지 못했습니다.");
        }
      })
      .catch((error) =>
        console.error("스크랩 데이터 로드 중 오류 발생", error)
      );
  };

  useEffect(() => {
    fetchScrapData();
  }, []);

  // 카드 삭제 처리 (articleId를 기준으로 삭제)
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
          console.error("스크랩 삭제에 실패했습니다.");
        }
      })
      .catch((error) =>
        console.error("스크랩 삭제 중 오류 발생", error)
      );
  };

  // "원래대로" 버튼 클릭 시 백엔드에서 최신 스크랩 데이터 재요청
  const resetList = () => {
    console.log("원래대로 버튼 클릭");
    fetchScrapData();
  };

  // "수정사항 저장" 버튼 클릭 시 현재 남아있는 스크랩의 articleId들을 백엔드에 전달
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
          console.error("수정사항 저장에 실패했습니다.");
        }
      })
      .catch((error) =>
        console.error("수정사항 저장 중 오류 발생", error)
      );
  };

  return (
    <>
      {/* 상단 헤더 */}
      <header className="mypage-header">
        <h1>MY PAGE</h1>
        <p>{username && `${username}님, 안녕하세요`}</p>
      </header>
      <br />

      {/* 스크랩한 기사 목록 타이틀 */}
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>스크랩한 기사 목록</h3>
        <span className="horizonalBar"></span>
      </div>

      {/* 기사 카드 리스트 */}
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

      {/* 맞춤 추천 기사 보러 가기 버튼 */}
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

      {/* 페이지 하단 우측의 원래대로 / 수정사항 저장 버튼 */}
      <div className="scrap-buttons">
        <button onClick={resetList}>원래대로</button>
        <button onClick={saveChanges}>수정사항 저장</button>
      </div>
    </>
  );
}

// 원래대로 버튼, 수정사항 저장 버튼 어떻게 할지 정하기