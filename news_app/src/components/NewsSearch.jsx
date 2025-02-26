import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import ErrorPopup from "./Error";
import "./NewsSearch.css";
import { reissueToken } from "./apiCommon";

// 성공 팝업 컴포넌트 (에러팝업 CSS와 동일한 스타일 사용)
function SuccessPopup({ message, onClose }) {
  return (
    <div className="success-overlay">
      <div className="success-popup">
        <p>{message}</p>
        <div className="success-buttons">
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}

const NewsSearch = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // 성공 팝업을 위한 state
  const articlesPerPage = 10;
  const accesstoken = localStorage.getItem("accesstoken");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (initialQuery.trim() !== "") {
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim() === "") {
      setError({ code: 400, message: "검색어를 입력해주세요!" });
      return;
    }

    if (accesstoken) {
      console.log("서치 - 유저가 함");
      axios
        .get("https://newjeans.site/articles/search", {
          params: { query },
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              setError({ code: 404, message: "검색된 기사가 없습니다." });
            } else {
              setNews(response.data.data);
              setCurrentPage(1);
              console.log("검색어:", query);
            }
          } else {
            if (response.data.code === 401) {
              reissueToken()
                .then((newRes) => {
                  console.log("재발급 후 처리:", newRes);
                })
                .catch((err) => {
                  console.error("토큰 재발급 실패:", err);
                });
            } else {
              setError({
                code: 500,
                message: response.data.data?.reason || "서버 오류",
              });
            }
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            reissueToken()
              .then((newRes) => {
                console.log("재발급 후 처리:", newRes);
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          } else if (err.response && err.response.status === 500) {
            setError({ code: 500, message: "서버 오류" });
          } else {
            setError({ code: 500, message: "알 수 없는 오류가 발생했습니다." });
          }
          console.error("Error loading search results:", err);
        });
    } else {
      console.log("서치 - 유저 아님");
      axios
        .get("https://newjeans.site/articles/search", { params: { query } })
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              setError({ code: 404, message: "검색된 기사가 없습니다." });
            } else {
              setNews(response.data.data);
              setCurrentPage(1);
              console.log("검색어:", query);
            }
          } else {
            if (response.data.code === 401) {
              reissueToken()
                .then((newRes) => {
                  console.log("재발급 후 처리:", newRes);
                })
                .catch((err) => {
                  console.error("토큰 재발급 실패:", err);
                });
            } else {
              setError({
                code: 500,
                message: response.data.data?.reason || "서버 오류",
              });
            }
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            reissueToken()
              .then((newRes) => {
                console.log("재발급 후 처리:", newRes);
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          } else if (err.response && err.response.status === 500) {
            setError({ code: 500, message: "서버 오류" });
          } else {
            setError({ code: 500, message: "알 수 없는 오류가 발생했습니다." });
          }
          console.error("Error loading search results:", err);
        });
    }
  };

  const handleScrap = (item) => {
    const payload = {
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    };
    console.log(payload);
    axios
      .post("/articles/scrap", payload, {
        headers: { Authorization: `Bearer ${accesstoken}` },
      })
      .then((response) => {
        if (response.data.success) {
          console.log("Scrap success:", response.data);
          setSuccess(true);
        } else {
          if (response.data.code === 401) {
            reissueToken()
              .then((newRes) => {
                console.log("재발급 후 처리:", newRes);
              })
              .catch((err) => {
                console.error("토큰 재발급 실패:", err);
              });
          } else {
            setError({
              code: 500,
              message: response.data.data?.reason || "스크랩 중 오류 발생",
            });
            console.error(
              "Scrap error:",
              response.data.data?.reason || "알 수 없는 오류"
            );
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          reissueToken()
            .then((newRes) => {
              console.log("재발급 후 처리:", newRes);
            })
            .catch((err) => {
              console.error("토큰 재발급 실패:", err);
            });
        }
        setError({ code: 500, message: "이미 스크랩한 기사입니다!" });
        console.error("Error scrapping article:", err);
      });
  };

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
              <button
                className="scrap-button"
                onClick={() => handleScrap(item)}
              >
                스크랩
              </button>
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
      {error && (
        <ErrorPopup
          code={error.code}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <SuccessPopup
          message="스크랩 되었습니다!"
          onClose={() => setSuccess(false)}
        />
      )}
    </>
  );
};

export default NewsSearch;
