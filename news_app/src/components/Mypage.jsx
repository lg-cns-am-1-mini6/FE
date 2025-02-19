import { useState } from "react";
import "./Mypage.css";

function KeywordButton() {
  return (
    <div>
      <span>키워드으으으으으</span>
      <button>X</button>
    </div>
  );
}

function Newscard() {
  return (
    <div className="card-box">
      <h2>
        <a>뉴스 제목</a>
      </h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore
        exercitationem ad adipisci architecto dolorum essedelectus ullam veniam
        perspiciatis! Voluptatem impedit laudantium tempora est quia totam
        quaerat in eum?
      </p>
    </div>
  );
}

export default function Mypage() {
  const [username, setUsername] = useState("hong");
  return (
    <>
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>{username}님, 안녕하세요</p>
      </header>
      <br></br>

      <div className="keyword-box">
        <h3>관심 키워드 목록</h3>
        <div>
          <div className="keyword-keywords">
            <KeywordButton />
            <KeywordButton />
            <KeywordButton />
            <KeywordButton />
          </div>
          <div className="keyword-buttons">
            <button>원래대로</button>
            <button>수정사항 저장</button>
          </div>
        </div>
      </div>
      <br></br>
      <div className="card-list">
        <h3>스크랩한 기사 목록</h3>
        <div>
          <Newscard />
          <Newscard />
          <Newscard />
        </div>
      </div>
    </>
  );
}
