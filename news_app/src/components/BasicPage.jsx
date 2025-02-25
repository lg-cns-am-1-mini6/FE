import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BasicPage.css";
import ErrorPopup from "./Error";
import axios from "axios";

export default function BasicPage() {
  const [query, setQuery] = useState("");
  const [newsList, setNewsList] = useState([]); // 추천 뉴스 전체 데이터
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed 페이지 번호
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const accesstoken = localStorage.getItem("accesstoken");

  // 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 로그인 사용자인 경우 추천 뉴스 API 호출
  useEffect(() => {
    if (accesstoken) {
      axios
        .get("/article/recommend")
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              setError({ code: 404, message: "추천 뉴스를 찾을 수 없습니다." });
            } else {
              // Fisher-Yates 알고리즘으로 배열 섞기
              const shuffled = shuffleArray(response.data.data);
              setNewsList(shuffled);
              setCurrentPage(0);
            }
          } else {
            setError({
              code: 500,
              message: response.data.data?.reason || "서버 오류",
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 500) {
            setError({ code: 500, message: "서버 오류" });
          } else {
            setError({ code: 500, message: "알 수 없는 오류가 발생했습니다." });
          }
          console.error("Error loading recommended news:", err);
        });
    }
  }, [accesstoken]);

  // Fisher-Yates 알고리즘: 안전하게 배열을 섞는 유틸 함수
  const shuffleArray = (array) => {
    const newArr = array.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // 검색어 입력 시 무조건 NewsSearch 페이지로 리다이렉션
  const handleSearch = () => {
    if (query.trim() === "") {
      setError({ code: 400, message: "검색어를 입력해주세요!" });
      return;
    }
    navigate(`/NewsSearch?query=${encodeURIComponent(query)}`);
  };

  // "다시 추천해주세요" 버튼: 전체 뉴스 데이터 중 다음 10개 뉴스로 페이지 업데이트
  const handleNextPage = () => {
    const totalPages = Math.ceil(newsList.length / 10);
    const nextPage = (currentPage + 1) % totalPages; // 마지막 페이지 이후에는 처음으로
    setCurrentPage(nextPage);
  };

  // "마음에 들어요" 버튼 (추가 기능 구현 가능)
  const handleLike = () => {
    console.log("사용자가 현재 추천 뉴스를 마음에 들어합니다.");
    // 예: 긍정 피드백 API 호출 등을 구현할 수 있음
  };

  // 현재 페이지에 해당하는 10개의 뉴스 기사
  const displayedNews = newsList.slice(currentPage * 10, currentPage * 10 + 10);

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

        {accesstoken ? (
          <>
            {newsList.length > 0 && (
              <>
                {/* 추천 뉴스 상단에 피드백 버튼 그룹 */}
                <div className="search-hashtags">
                  <span>#추천 뉴스 어때요?</span>
                  <button className="like-btn" onClick={handleLike}>
                    ✔️ 마음에 들어요
                  </button>
                  <button className="like-btn" onClick={handleNextPage}>
                    ❌ 다시 추천해주세요
                  </button>
                </div>
                {/* 카드뉴스 형식의 추천 뉴스 리스트 */}
                <div className="news-list">
                  {displayedNews.map((item, index) => (
                    <div key={index} className="news-card">
                      <div className="news-card-text">
                        <h2>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        </h2>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      </div>
                      <button
                        className="scrap-button"
                        onClick={() => {
                          // 필요 시 스크랩 기능 구현
                        }}
                      >
                        스크랩
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // 비로그인 사용자는 해시태그 안내 메시지 표시
          <div className="basic-hashtags">
            <p>#로그인_시_다양한_기능을_이용할_수_있습니다</p>
            <p>#로그인_버튼은_우측_상단에_있어요!</p>
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
    </div>
  );
}
