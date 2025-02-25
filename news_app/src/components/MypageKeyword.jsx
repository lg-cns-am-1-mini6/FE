import { useState, useEffect, useContext } from "react";
import "./MypageKeyword.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";

function KeywordItem({ keyword, onDelete }) {
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
  const { userInfo } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const accesstoken = localStorage.getItem("accesstoken");

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

  // 현재 로그인한 사용자의 id (추후 인증 로직에 따라 변경 가능)
  const currentUserId = "member1";

  // mock 데이터에서 사용자 정보와 키워드를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/result_mock.json"); // mock 데이터 경로
        const data = await response.json();

        // 예시로 첫 번째 멤버의 username을 사용
        const member = data.members[0];
        setUsername(member.username);

        // 해당 멤버의 키워드 데이터를 가져옴
        const memberKeywords = data.recommendedKeywords.find(
          (kw) => kw.id === member.id
        );
        if (memberKeywords) {
          setKeywords(memberKeywords.keyword);
        }
      } catch (error) {
        console.error("Error fetching mock data:", error);
      }
    };

    fetchData();
  }, []);

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
    const fetchInitialKeywords = async () => {
      try {
        const response = await fetch("/path/to/result_mock.json"); // mock 데이터 경로
        const data = await response.json();

        // 예시로 첫 번째 멤버의 키워드 데이터를 가져옴
        const member = data.members[0];
        const memberKeywords = data.recommendedKeywords.find(
          (kw) => kw.id === member.id
        );
        if (memberKeywords) {
          setKeywords(memberKeywords.keyword);
        }
      } catch (error) {
        console.error("Error fetching initial keywords:", error);
      }
    };

    fetchInitialKeywords();
  };

  // 수정사항 저장 버튼 클릭 시 변경된 키워드 목록을 서버 전송(여기서는 콘솔 출력)
  const saveChanges = () => {
    console.log("변경사항 저장:", keywords);
    // 추후 서버 API 연동 구현
  };

  return (  
    <>
      <header className="mypage-header">
        <h1>MY PAGE</h1>
        <p>{userInfo.username}님, 안녕하세요</p>
      </header>
      <br />
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>관심 키워드 목록</h3>
        <span className="horizonalBar"></span>
      </div>

      <div className="keyword-box">
        {/* 키워드 추가 입력창 */}
        <div>
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
        </div>
        <div className="keyword-buttons">
          <button onClick={resetKeywords}>원래대로</button>
          <button onClick={saveChanges}>저장</button>
        </div>
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
