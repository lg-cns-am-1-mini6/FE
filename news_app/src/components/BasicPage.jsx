import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BasicPage.css";
import { UserContext } from "./UserContext";
import ErrorPopup from "./Error";

export default function BasicPage() {
  const { userInfo } = useContext(UserContext);
  const [query, setQuery] = useState("");
  // TODO: username 등으로 해시태그 가져오기
  const [hashtags, setHashtags] = useState([
    "예시키워드",
    "예시키워드",
    "예시키워드",
  ]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearch = () => {
    // 빈 검색어일 경우 오류 팝업 (400 오류)
    if (query.trim() === "") {
      setError({ code: 400, message: "검색어를 입력해주세요!" });
      return;
    }
    // NewsSearch 페이지로 query 값을 URL 쿼리스트링으로 전달하며 리다이렉션
    navigate(`/NewsSearch?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="basic-page">
      <div className="news-container">
        <h1 className="basic-title">
          NEW<span>jean</span>S
        </h1>
        <div className="search-box basic-search-box">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        <div className="basic-hashtags">
          {!userInfo.name && (
            <>
              <p>#로그인_시_다양한_기능을_이용할_수_있습니다</p>
              <p>#로그인_버튼은_우측_상단에_있어요!</p>
            </>
          )}
          {userInfo.name && (
            <>
              <p>{userInfo.name}님은 이런 검색어를 #가장_많이 찾아보셨어요!</p>
              <p>
                {hashtags.map((tag, i) => (
                  <span key={i}>#{tag} </span>
                ))}
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <ErrorPopup
          code={error.code}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
