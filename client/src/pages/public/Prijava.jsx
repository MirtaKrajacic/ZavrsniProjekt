import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clickedPrijava, setClickedPrijava] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Prijava";
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      if (data.auth) {
        localStorage.setItem("token", data.auth);
        navigate("/");
      } else {
        alert("Please provide token");
      }
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="container w-25">
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)} // e.target.value je curr value input elementa
            value={password}
          />
          
        </div>

        <Link to="/signup">Nemate još korisnički račun? Registrirajte se.</Link>

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={() => {
            setClickedPrijava(true);
            handleLogin();
          }}
        >
          Log in
        </button>

        {clickedPrijava && error &&
          <p className="text-danger">Netočan email ili lozinka.</p>}
      </div>
    </div>
  );
};

export default Login;
