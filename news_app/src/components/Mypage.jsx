import { useEffect, useState } from "react";
import "./Mypage.css";

function KeywordButton({ word }) {
  const [deleted, setDeleted] = useState(false);
  if (word.length >= 10) {
    word = word.slice(0, 10) + "...";
  }
  if (!deleted) {
    return (
      <div>
        <span>{word}</span>
        <button
          onClick={() => {
            setDeleted((prev) => !prev);
          }}
        >
          X
        </button>
      </div>
    );
  }
}

function Newscard({ title, content }) {
  return (
    <div className="card-box">
      <h2>
        <a>{title}</a>
      </h2>
      <p>{content}</p>
    </div>
  );
}

export default function Mypage() {
  const [username, setUsername] = useState("hong");
  const [newslist, setNewslist] = useState([
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
  ]);
  const [keywords, setKeywords] = useState([
    { word: "예시_키워드1", deleted: true },
    { word: "예시_키워드2", deleted: false },
    { word: "예시_키워드3", deleted: false },
  ]);
  const [reset, setReset] = useState(false);

  const clickReset = () => {
    console.log("리셋버튼 클릭");
    setReset(!reset);
  };

  const saveChanges = () => {
    console.log("변경사항 저장");
  };

  return (
    <>
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>{username}님, 안녕하세요</p>
      </header>
      <br></br>
      <div className="keyword-box">
        <div className="text-art">
          <span className="horizonalBar"></span>
          <h3>관심 키워드 목록</h3>
          <span className="horizonalBar"></span>
        </div>
        {keywords.length == 0 && (
          <div className="no_contents">등록된 관심 키워드가 없습니다</div>
        )}
        {keywords.length != 0 && (
          <div>
            <div className="keyword-keywords">
              {keywords.map((keyword, index) => (
                <KeywordButton word={keyword.word} key={index} />
              ))}
            </div>
            <div className="keyword-buttons">
              <button onClick={clickReset}>원래대로</button>
              <button onClick={saveChanges}>수정사항 저장</button>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <div className="card-list">
        <div className="text-art">
          <span className="horizonalBar"></span>
          <h3>스크랩한 기사 목록</h3>
          <span className="horizonalBar"></span>
        </div>
        <div>
          {newslist.length != 0 &&
            newslist.map((news, index) => (
              <Newscard title={news.title} content={news.content} key={index} />
            ))}
          {newslist.length == 0 && (
            <div style={{ textAlign: "center" }}>스크랩한 기사가 없습니다</div>
          )}
        </div>
      </div>
    </>
  );
}