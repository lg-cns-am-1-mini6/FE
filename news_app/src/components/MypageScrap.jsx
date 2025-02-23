import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageScrap.css";

function ScrapCard({ title, content, onDelete }) {
  return (
    <div className="card-box">
      <div className="card-text">
        <h2><a>{title}</a></h2>
        <p>{content}</p>
      </div>
      <button className="card-delete-btn" onClick={onDelete}>
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

  // mock data에서 현재 사용자의 스크랩 기사 목록을 불러오는 함수
  const fetchScrapData = () => {
    fetch("/result_mock.json")
      .then((res) => res.json())
      .then((data) => {
        // members 배열에서 현재 사용자 정보 추출
        const currentUser = data.members.find((m) => m.id === currentUserId);
        if (currentUser) {
          setUsername(currentUser.username);
        }
        // newsScraps에서 현재 사용자의 스크랩 데이터 필터링
        const userScraps = data.newsScraps.filter(
          (scrap) => scrap.user_id === currentUserId
        );
        // 각 스크랩에 대해 newsArticles에서 일치하는 기사를 찾아 title과 description을 추출
        const scrapArticles = userScraps
          .map((scrap) => {
            const article = data.newsArticles.find(
              (art) => art.news_id === scrap.news_id
            );
            if (article) {
              return {
                title: article.title,
                content: article.description,
              };
            }
            return null;
          })
          .filter((item) => item !== null);
        setNewslist(scrapArticles);
      })
      .catch((err) => console.error("Error loading mock data", err));
  };

  // 컴포넌트 마운트 시 데이터 fetch
  useEffect(() => {
    fetchScrapData();
  }, []);

  // 카드 삭제 처리
  const handleDelete = (index) => {
    setNewslist(newslist.filter((_, i) => i !== index));
  };

  // "원래대로" 버튼 클릭 시 mock data 재요청
  const resetList = () => {
    console.log("원래대로 버튼 클릭");
    fetchScrapData();
  };

  // "수정사항 저장" 버튼: 변경된 스크랩 기사 목록 저장 (서버 전송 시뮬레이션)
  const saveChanges = () => {
    console.log("변경사항 저장 및 서버 전송");
    // 서버 전송 로직 추가 가능
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
          newslist.map((news, index) => (
            <ScrapCard
              key={index}
              title={news.title}
              content={news.content}
              onDelete={() => handleDelete(index)}
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
