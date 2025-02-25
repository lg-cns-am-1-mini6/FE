import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer className="footer-body">
        <p>footer example</p>
        <p>footer example</p>
        <p>footer example</p>
        <p>footer example</p>
        <Link to="/admin">DO NOT TOUCH ME !!</Link>
      </footer>
    </>
  );
}
