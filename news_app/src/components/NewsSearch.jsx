import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import ErrorPopup from "./Error";
import "./NewsSearch.css";

const NewsSearch = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // 오류 상태
  const articlesPerPage = 10;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // mock 데이터 로드
  useEffect(() => {
    axios
      .get("/result_mock.json")
      .then((response) => {
        if (response.data.success) {
          setNews(response.data.data);
        } else {
          // 서버에서 전달한 오류 코드에 따라 팝업 표시 (예: 500 오류)
          setError({
            code: 500,
            message: response.data.data?.reason || "서버 오류",
          });
        }
      })
      .catch((err) => {
        // 네트워크 등 기타 오류 발생 시 500 오류로 처리
        setError({ code: 500, message: "서버 오류" });
        console.error("Error loading news:", err);
      });
  }, []);

  const handleSearch = () => {
    // 빈 검색어 체크 (400 오류)
    if (query.trim() === "") {
      setError({ code: 400, message: "검색어를 입력해주세요!" });
      return;
    }
    axios
      .get("/result_mock.json", { params: { query } })
      .then((response) => {
        if (response.data.success) {
          if (response.data.data.length === 0) {
            // 검색 결과가 없을 경우 404 오류
            setError({ code: 404, message: "검색된 기사가 없습니다." });
          } else {
            setNews(response.data.data);
            setCurrentPage(1);
            console.log("검색어:", query);
          }
        } else {
          // 백엔드에서 success가 false로 온 경우
          // 오류 코드에 따라 처리 (예를 들어 500)
          setError({
            code: 500,
            message: response.data.data?.reason || "서버 오류",
          });
        }
      })
      .catch((err) => {
        // 에러 객체에서 status를 확인하여 500 오류 처리
        if (err.response && err.response.status === 500) {
          setError({ code: 500, message: "서버 오류" });
        } else {
          setError({ code: 500, message: "알 수 없는 오류가 발생했습니다." });
        }
        console.error("Error loading search results:", err);
      });
  };

  // 스크랩 버튼 로직 (필요 시 오류 처리 추가 가능)
  const handleScrap = (item) => {
    const payload = {
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    };
    axios
      .post("/api/article/scrap", payload)
      .then((response) => {
        if (response.data.success) {
          console.log("Scrap success:", response.data);
        } else {
          setError({
            code: 500,
            message: response.data.data?.reason || "스크랩 중 오류 발생",
          });
          console.error("Scrap error:", response.data.data?.reason || "알 수 없는 오류");
        }
      })
      .catch((err) => {
        setError({ code: 500, message: "스크랩 중 오류 발생" });
        console.error("Error scrapping article:", err);
      });
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
              <button className="scrap-button" onClick={() => handleScrap(item)}>
                스크랩
              </button>
            </div>
          ))}
        </div>
        {news.length > articlesPerPage && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
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
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
      {/* 오류 팝업 */}
      {error && (
        <ErrorPopup
          code={error.code}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
};

export default NewsSearch;
