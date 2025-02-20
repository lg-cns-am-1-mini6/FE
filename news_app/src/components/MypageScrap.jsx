import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageScrap.css";

function ScrapCard({ title, content, onDelete }) {
  return (
    <div className="card-box">
      {/* 삭제버튼: 카드 우측 상단에 위치 */}
      <button className="card-delete-btn" onClick={onDelete}>
        X
      </button>
      <h2>
        <a>{title}</a>
      </h2>
      <p>{content}</p>
    </div>
  );
}

export default function MypageScrap() {
  const [username] = useState("hong");

  // 예시 스크랩 기사 목록 (서버 연동 전)
  const initialNewsList = [
    {
      title: "title_example",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita veniam iusto quas dolorem itaque rerum explicabo officia aut placeat cupiditate ex excepturi velit, magni molestiae reprehenderit provident repellendus asperiores maxime!",
    },
    { title: "title_example", content: "content_example" },
    { title: "title_example", content: "content_example" },
    { title: "title_example", content: "content_example" },
    { title: "title_example", content: "content_example" },
    { title: "title_example", content: "content_example" },
    { title: "title_example", content: "content_example" },
  ];

  const [newslist, setNewslist] = useState(initialNewsList);
  const navigate = useNavigate();

  // 카드 삭제 처리
  const handleDelete = (index) => {
    setNewslist(newslist.filter((_, i) => i !== index));
  };

  // "원래대로" 버튼: 원본 기사 목록으로 reset
  const resetList = () => {
    console.log("원래대로 버튼 클릭");
    setNewslist(initialNewsList);
  };

  // "수정사항 저장" 버튼: 변경된 스크랩 기사 목록 저장 (서버 전송 시뮬레이션)
  const saveChanges = () => {
    console.log("변경사항 저장 및 서버 전송");
    // 서버 전송 로직 추가 가능
  };

  return (
    <>
      {/* 상단 헤더 (Mypage와 동일) */}
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>{username}님, 안녕하세요</p>
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
      <div className="keyword-buttons">
        <button onClick={resetList}>원래대로</button>
        <button onClick={saveChanges}>수정사항 저장</button>
      </div>
    </>
  );
}
