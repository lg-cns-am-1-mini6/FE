import React from "react";
import "./NewsDetail.css";

const NewsDetail = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {news.image_url && (
          <img src={news.image_url} alt={news.title} className="news-image" />
        )}
        <h2 className="news-title">{news.title}</h2>
        <p className="news-meta">
          <span className="news-creator">{news.creator}</span> |{" "}
          <span className="news-date">{news.pubDate}</span>
        </p>
        <div className="news-content">{news.content}</div>
        <p className="news-article-id">Article ID: {news.article_id}</p>
      </div>
    </div>
  );
};

export default NewsDetail;
