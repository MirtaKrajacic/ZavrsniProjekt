import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const auth = localStorage.getItem("user");

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center w-100">
          {/* Logo left */}
          <div className="d-flex align-items-center me-3">
            <img alt="logo" src="/logo.png" style={{width:"45px", height:"45px"}} />
          </div>
          {/* Center links */}
          <div className="flex-grow-1 d-flex justify-content-center">
            <ul className="navbar-nav flex-row">
              {auth && (
                <>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/">
                      Products
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/add">
                      Add products
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/update">
                      Update products
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/* Right links */}
          <div className="d-flex align-items-center ms-3">
            <ul className="navbar-nav flex-row">
              {auth ? (
                <li className="nav-item mx-2">
                  <Link onClick={logout} className="nav-link" to="/signup">
                    Logout ({JSON.parse(auth).name})
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link" to="/login">
                      Log in
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
