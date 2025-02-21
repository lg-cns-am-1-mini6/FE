import { useState } from "react";
import "./MypageKeyword.css";

function KeywordItem({ keyword, onDelete }) {
  // 만약 키워드 길이가 10자 이상이면 10자까지만 보여주고 "..." 추가
  const displayWord =
    keyword.length >= 10 ? keyword.slice(0, 10) + "..." : keyword;
  return (
    <div className="keyword-item">
      <span>{displayWord}</span>
      <button onClick={onDelete}>X</button>
    </div>
  );
}

export default function MypageKeyword() {
  const username = "hong"; // 현재 사용자 이름
  const initialKeywords = ["예시_키워드1", "예시_키워드2", "예시_키워드3"];
  const [keywords, setKeywords] = useState(initialKeywords);
  const [newKeyword, setNewKeyword] = useState("");

  // 입력창에 값을 입력 후 + 버튼을 누르면 새 키워드 추가
  const addKeyword = () => {
    if (newKeyword.trim() !== "") {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  // 각 키워드 옆의 X 버튼 클릭 시 해당 키워드 삭제
  const deleteKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // 원래대로 버튼 클릭 시 초기 키워드 목록 복원
  const resetKeywords = () => {
    setKeywords(initialKeywords);
  };

  // 수정사항 저장 버튼 클릭 시 변경된 키워드 목록을 서버 전송(여기서는 콘솔 출력)
  const saveChanges = () => {
    console.log("변경사항 저장:", keywords);
    // 추후 서버 API 연동 구현
  };

  return (
    <div className="mypage-body">
      <header className="mypage-header">
        <h1>마이페이지</h1>
        <p>{username}님, 안녕하세요</p>
      </header>
      <br />
      <div className="keyword-box">
        <div className="text-art">
          <span className="horizonalBar"></span>
          <h3>관심 키워드 목록</h3>
          <span className="horizonalBar"></span>
        </div>
        {/* 키워드 추가 입력창 */}
        <div className="keyword-add">
          <input
            type="text"
            placeholder="추가하실 키워드를 입력하세요"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
          <button onClick={addKeyword}>+</button>
        </div>
        {keywords.length === 0 && (
          <div className="no_contents">등록된 관심 키워드가 없습니다</div>
        )}
        {keywords.length > 0 && (
          <div className="keyword-keywords">
            {keywords.map((keyword, index) => (
              <KeywordItem
                key={index}
                keyword={keyword}
                onDelete={() => deleteKeyword(index)}
              />
            ))}
          </div>
        )}
        <div className="keyword-buttons">
          <button onClick={resetKeywords}>원래대로</button>
          <button onClick={saveChanges}>수정사항 저장</button>
        </div>
      </div>
    </div>
  );
}
