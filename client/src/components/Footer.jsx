import { Link } from "react-router-dom";
import { useEffect } from "react";

function Footer() {
  useEffect(() => {
      document.title = "O nama";
    }, []);

  return (
    <footer
      className="text-dark text-center bg-light py-3 mt-4 w-100"
      style={{ left: 0 }}
    >
      <p className="mb-0">
        <Link 
          to="/about" 
          className="text-dark text-decoration-none footer-link"
        >
          O nama
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
