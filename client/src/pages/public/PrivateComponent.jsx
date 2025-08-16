import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateComponent = () => {
  function isTokenValid(token) {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000; // exp je u sekundama pa convertamo u milisekunde
    } catch {
      return false; // neispravan token
    }
  }

  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token"); // ako je expired
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateComponent;
