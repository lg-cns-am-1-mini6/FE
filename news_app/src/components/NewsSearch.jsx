import React, { useState, useEffect } from "react";
import Header from "./Header";
import NewsDetail from "./NewsDetail";
import "./NewsSearch.css";

const NewsSearch = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetch("/result_mock.json")
      .then((res) => res.json())
      .then((data) => setNews(data.items))
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  const handleSearch = () => {
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setNews(data.items))
      .catch((err) => console.error("Error loading search results:", err));
  };

  return (
    <>
      <Header />
      <div className="news-container">
        <h1 className="site-title">NEWjeanS</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        <div className="search-hashtags">
          <span>#OO이가_뉴스를_정리했어요!</span>
          <span>#결과가 어떤가요?</span>
          <button className="like-btn">✔️ 마음에 들어요</button>
          <button className="retry-btn">❌ 다시 추천해주세요</button>
        </div>
        <div className="news-list">
          {news.map((item, index) => (
            <div
              key={index}
              className="news-card"
              onClick={() => setSelectedNews(item)}
            >
              <button className="summary-btn">📝 AI 요약 사용 가능</button>
              <h2>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedNews(item);
                  }}
                >
                  "{item.title}"
                </a>
              </h2>
              <p>#AI가_뉴스를_요약해줄게요!</p>
              <p>
                #요약을_원하면 <span>#여기</span> <span>#를_눌러주세요</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedNews && (
        <NewsDetail news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
};

export default NewsSearch;