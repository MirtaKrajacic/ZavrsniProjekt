import { Link, useNavigate } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-dark text-center bg-light py-3 mt-4 w-100"
      style={{ left: 0 }}
    >
      <p className="mb-0">
        <Link 
          to="/" 
          className="text-dark text-decoration-none footer-link"
        >
          O nama
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
