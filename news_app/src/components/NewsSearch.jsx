import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./NewsSearch.css";

const NewsSearch = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch("/result_mock.json")
      .then((res) => res.json())
      .then((data) => setNews(data.newsApiResponse.items))
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  const handleSearch = () => {
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setNews(data.newsApiResponse.items))
      .catch((err) => console.error("Error loading search results:", err));
  };

  return (
    <>
      <Header />
      <div className="search-container">
        <h1 className="site-title">
          NEW<span>jean</span>S
        </h1>
        <div className="result-search-box">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        <div className="search-hashtags">
          <span>#검색 결과가 어떤가요?</span>
          <button className="like-btn">✔️ 마음에 들어요</button>
          <button className="like-btn">❌ 다시 추천해주세요</button>
        </div>
        <div className="news-list">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-card-text">
                {/* <button className="summary-btn">📝 AI 요약 사용 가능</button> */}
                <h2>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    "{item.title}"
                  </a>
                </h2>
                <p>#요약_해시태그 #요약_해시태그 #요약_해시태그</p>
                {/* <p>
                #요약을_원하면 <span>#여기</span> <span>#를_눌러주세요</span>
              </p> */}
              </div>
              <button className="scrap-button">스크랩</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsSearch;
