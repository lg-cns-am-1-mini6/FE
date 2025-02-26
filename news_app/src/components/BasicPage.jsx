import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BasicPage.css";
import ErrorPopup from "./Error";
import axios from "axios";
import { reissueToken } from "./apiCommon"; // 토큰 재발급 관련 유틸 (필요 시)

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

export default function BasicPage() {
  const [query, setQuery] = useState("");
  const [newsList, setNewsList] = useState([]); // 추천 뉴스 전체 데이터
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed 페이지 번호
  const [error, setError] = useState(null);
  const [noKeywords, setNoKeywords] = useState(false); // 키워드 없음 여부
  const [success, setSuccess] = useState(false); // 스크랩 성공 팝업
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
        .get("/articles/key-search", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accesstoken}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            if (response.data.data == "추천할 검색어 없음.") {
              setNoKeywords(true);
            } else {
              // Fisher-Yates 알고리즘으로 배열 섞기
              const articles = response.data.data.reduce((acc, curr) => {
                return acc.concat(curr.articles);
              }, []);
              const shuffled = shuffleArray(articles);
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
            // setError({ code: 500, message: "키워드를 불러올 수 없음" });
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

  // 검색어 입력 시 NewsSearch 페이지로 리다이렉션
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

  // 스크랩 기능: 뉴스 기사 스크랩 API 호출
  const handleScrap = (item) => {
    const payload = {
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    };
    const accesstoken = localStorage.getItem("accesstoken");
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
                console.log("토큰 재발급 후 처리:", newRes);
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
              console.log("토큰 재발급 후 처리:", newRes);
            })
            .catch((err) => {
              console.error("토큰 재발급 실패:", err);
            });
        }
        setError({ code: 500, message: "이미 스크랩한 기사입니다!" });
        console.error("Error scrapping article:", err);
      });
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
            {noKeywords ? (
              // 등록된 키워드가 없을 경우 안내 메시지 표시
              <div className="no-keywords">
                ✨ 검색 기록이 쌓이면, 딱 맞는 키워드를 추천해줄게요! ✨
              </div>
            ) : (
              newsList.length > 0 && (
                <>
                  {/* 추천 뉴스 상단에 피드백 버튼 그룹 */}
                  <div className="search-hashtags">
                    <span>#추천 뉴스 어때요?</span>
                    <button className="like-btn" onClick={handleNextPage}>
                      🔄 다시 추천!
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
                          <p className="pub-date">{item.pubDate}</p>
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
                </>
              )
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
      {/* 에러 팝업: 실제 에러가 발생한 경우에만 표시 */}
      {error && (
        <ErrorPopup
          code={error.code}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
      {/* 성공 팝업: 스크랩 성공 시 표시 */}
      {success && (
        <SuccessPopup
          message="스크랩 되었습니다!"
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
}
