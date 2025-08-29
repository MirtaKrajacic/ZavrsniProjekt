import { NavLink, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

function NavBar() {
  const auth = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <>
      <nav className="d-none d-md-block navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <div className="d-flex align-items-center w-100">
            <NavLink to="/">
              <img src="/logo.png" alt="logo" width="60" height="60" />
            </NavLink>

            <ul className="navbar-nav flex-row position-absolute start-50 translate-middle-x">
              <li className="nav-item mx-2">
                <NavLink className="nav-link" to="/">
                  Naslovnica
                </NavLink>
              </li>
              {auth && (
                <>
                  <li className="nav-item mx-2">
                    <NavLink className="nav-link" to="/view">
                      Moji upitnici
                    </NavLink>
                  </li>
                  <li className="nav-item mx-2">
                    <NavLink className="nav-link" to="/profile">
                      Moj profil
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center ms-auto">
              <ul className="navbar-nav flex-row">
                {auth ? (
                  <li className="nav-item mx-2">
                    <NavLink onClick={logout} className="nav-link" to="/login">
                      Odjava
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li className="nav-item mx-2">
                      <NavLink className="nav-link" to="/signup">
                        Registracija
                      </NavLink>
                    </li>
                    <li className="nav-item mx-2">
                      <NavLink className="nav-link" to="/login">
                        Prijava
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <nav className="d-block d-md-none navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <NavLink to="/">
            <img src="/logo.png" alt="logo" width="60" height="60" />
          </NavLink>
          <NavDropdown title="☰" id="nav-dropdown" className="fw-bold me-2">
            <NavDropdown.Item>
              <NavLink className="nav-link" to="/">
                Naslovnica
              </NavLink>
            </NavDropdown.Item>

            {auth && (
              <>
                <NavDropdown.Item>
                  <NavLink className="nav-link" to="/view">
                    Moji upitnici
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <NavLink className="nav-link" to="/profile">
                    Moj profil
                  </NavLink>
                </NavDropdown.Item>
              </>
            )}

            {auth ? (
              <NavDropdown.Item>
                <NavLink onClick={logout} className="nav-link" to="/login">
                  Odjava
                </NavLink>
              </NavDropdown.Item>
            ) : (
              <>
                <NavDropdown.Item>
                  <NavLink className="nav-link" to="/signup">
                    Registracija
                  </NavLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <NavLink className="nav-link" to="/login">
                    Prijava
                  </NavLink>
                </NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
