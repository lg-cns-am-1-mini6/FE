import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import "./NewsSearch.css";

const NewsSearch = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 페이징을 위한 현재 페이지 상태
  const articlesPerPage = 10; // 한 페이지당 표시할 기사 개수

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // mock 데이터 로드 (result_mock.json)
  useEffect(() => {
    axios
      .get("/result_mock.json")
      .then((response) => {
        // 응답 성공 여부 확인 후 데이터 설정
        if (response.data.success) {
          setNews(response.data.data);
        } else {
          // response.data.data가 없을 수 있으므로 안전하게 접근
          // data형식이 맞지 않을 때 나는 오류
          console.error("Error loading news:", response.data.data?.reason || "알 수 없는 오류");
        }
      })
      .catch((err) => console.error("Error loading news:", err));
  }, []);

  const handleSearch = () => {
    // 빈 검색어 체크 (백엔드에서 400 에러를 반환하므로 미리 체크할 수도 있음)
    if (query.trim() === "") {
      console.error("검색어가 비어 있습니다.");
      return;
    }
    // 테스트를 위해 mock 데이터를 사용하도록 URL을 변경 (실제 API 사용 시엔 원래 URL을 사용 "/api/article/search")
    axios
      .get("/result_mock.json", { params: { query } })
      .then((response) => {
        if (response.data.success) {
          setNews(response.data.data);
          setCurrentPage(1); // 새 검색 시 페이지를 1로 리셋
          console.log("검색어:", query); // 검색 성공 시 검색어 출력
        } else {
          console.error("Search error:", response.data.data?.reason || "알 수 없는 오류");
        }
      })
      .catch((err) => console.error("Error loading search results:", err));
  };

  // 스크랩 버튼 로직 구현
  const handleScrap = (item) => {
    const payload = {
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate
    };
    axios
      .post("/api/article/scrap", payload)
      .then((response) => {
        if (response.data.success) {
          console.log("Scrap success:", response.data);
        } else {
          console.error("Scrap error:", response.data.data?.reason || "알 수 없는 오류");
        }
      })
      .catch((err) => console.error("Error scrapping article:", err));
  };

  // 페이징 로직
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(news.length / articlesPerPage);

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
          {currentArticles.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-card-text">
                <h2>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    "{item.title}"
                  </a>
                </h2>
                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
              </div>
              <button className="scrap-button" onClick={() => handleScrap(item)}>스크랩</button>
            </div>
          ))}
        </div>
        {news.length > articlesPerPage && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsSearch;
