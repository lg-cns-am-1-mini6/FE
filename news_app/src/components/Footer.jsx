import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer-body">
        <div className="footer-contents">
          <div className="admin-link">
            <Link to="/admin">DO NOT TOUCH ME !!</Link>
          </div>
          <div>
            <a
              href="https://link.coupang.com/a/cgtL9H"
              target="_blank"
              referrerpolicy="unsafe-url"
            >
              <img
                src="https://ads-partners.coupang.com/banners/835088?subId=&traceId=V0-301-bae0f72e5e59e45f-I835088&w=728&h=90"
                alt=""
              />
            </a>
          </div>
          <br></br>
        </div>
      </footer>
    </>
  );
}
