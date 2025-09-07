import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Privatno() {
  function validanToken(token) {
    try {
      const { exp } = jwtDecode(token); // exp je u sekundama
      return Date.now() < exp * 1000; // now() je u milisekundama
    } catch {
      return false; // neispravan token
    }
  }

  const token = localStorage.getItem("token");

  if (!token || !validanToken(token)) {
    localStorage.removeItem("token"); 
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default Privatno;
