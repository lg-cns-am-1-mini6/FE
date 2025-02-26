import { useState, useEffect, useContext } from "react";
import "./MypageKeyword.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";

// accesstoken을 상단에서 정의
const accesstoken = localStorage.getItem("accesstoken");

function KeywordItem({ keyword, onDelete }) {
  if (!keyword || typeof keyword.keyword !== "string") return null;
  const displayWord =
    keyword.keyword.length >= 10
      ? keyword.keyword.slice(0, 10) + "..."
      : keyword.keyword;
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
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

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
  }, []);

  // 백엔드 API를 통해 키워드 조회 (GET /keywords/)
  const fetchKeywords = async () => {
    try {
      const response = await fetch("/keywords/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
      });
      if (!response.ok) {
        throw new Error("키워드 조회 실패");
      }
      const data = await response.json();
      // 백엔드에서 반환된 데이터의 구조에 맞게 추출합니다.
      setKeywords(data.data.tagList || []);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setError({ code: 500, message: "키워드 로딩 실패" });
    }
  };

  useEffect(() => {
    if (accesstoken) {
      fetchKeywords();
    }
  }, [accesstoken]);

  // 키워드 추가 (POST /keywords/)
  // request body: { "keyword": "입력값" }
  const addKeyword = async () => {
    if (newKeyword.trim() !== "") {
      try {
        const response = await fetch("/keywords/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accesstoken}`,
          },
          body: JSON.stringify({ keyword: newKeyword.trim() }),
        });
        if (!response.ok) {
          throw new Error("키워드 추가 실패");
        }
        // 백엔드에서 새로 생성된 키워드 객체를 아래와 같이 반환한다고 가정:
        // { success: true, status: 200, data: { id: <id>, keyword: <keyword>, ... } }
        const createdKeywordResponse = await response.json();
        const newKeywordObject = createdKeywordResponse.data;
        setKeywords([...keywords, newKeywordObject]);
        setNewKeyword("");
      } catch (error) {
        console.error("Error adding keyword:", error);
        setError({ code: 500, message: "키워드 추가 실패" });
      }
    }
  };

  // 키워드 삭제 (DELETE /keywords/{id})
  const deleteKeyword = async (id) => {
    try {
      const response = await fetch(`/keywords/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
      });
      if (!response.ok) {
        throw new Error("키워드 삭제 실패");
      }
      setKeywords(keywords.filter((kw) => kw.id !== id));
    } catch (error) {
      console.error("Error deleting keyword:", error);
      setError({ code: 500, message: "키워드 삭제 실패" });
    }
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
              {keywords.map((kw, index) => (
                <KeywordItem
                  key={kw.id || index}
                  keyword={kw}
                  onDelete={() => deleteKeyword(kw.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
