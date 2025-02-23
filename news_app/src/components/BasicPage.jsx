import { useEffect, useState } from "react";
import "./BasicPage.css";
import Footer from "./Footer";

export default function BasicPage() {
  const [username, setUsername] = useState("hong");
  const [login, setLogin] = useState(false);
  const [query, setQuery] = useState("");
  const [hashtags, setHashtags] = useState([
    "예시키워드",
    "예시키워드",
    "예시키워드",
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>🔍</button>
        </div>
        <div className="basic-hashtags">
          {!login && (
            <>
              <p>#로그인_시_다양한_기능을_이용할_수_있습니다</p>
              <p>#로그인_버튼은_우측_상단에_있어요!</p>
            </>
          )}

          {login && (
            <>
              <p>{username}님은 이런 검색어를 #가장_많이 찾아보셨어요!</p>
              <p>
                {hashtags.map((tag, i) => (
                  <span>#{tag} </span>
                ))}
              </p>
            </>
          )}
          {/* <button onClick={() => setLogin(!login)}>
            로그인 여부 토글 (테스트용)
          </button> */}
        </div>
      </div>
    </div>
  );
}
