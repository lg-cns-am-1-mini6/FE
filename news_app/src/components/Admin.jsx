export default function Admin() {
  return (
    <>
      <header className="mypage-header">
        <h1 style={{ fontFamily: "Gowun Dodum, serif" }}>관리자 페이지</h1>
      </header>
      <br />
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>검색어 순위</h3>
        <span className="horizonalBar"></span>
      </div>
      <div className="admin-container">아무튼 뭔 내용</div>
      <div className="text-art">
        <span className="horizonalBar"></span>
        <h3>유저별 통계</h3>
        <span className="horizonalBar"></span>
      </div>
      <div className="admin-container">우와아ㅏ</div>
    </>
  );
}
