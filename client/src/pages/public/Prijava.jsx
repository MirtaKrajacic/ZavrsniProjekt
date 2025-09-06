import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      } 
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center">
      <div className="card p-4 w-100" style={{ maxWidth: "420px" }}>
        <h1 className="text-center text-primary mb-4">Prijava</h1>

        <div className="mb-3 mt-4">
          <label className="form-label">Email adresa</label>
          <input
            type="email"
            className="form-control"
            placeholder="ime@primjer.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-5">
          <label className="form-label">Lozinka</label>
          <input
            type="password"
            className="form-control"
            placeholder="Unesite lozinku"
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
          />
        </div>

        <Link className="text-center" to="/signup">
          Nemate još korisnički račun? Registrirajte se.
        </Link>

        <button
          className="btn btn-light border w-100 d-block mx-auto mt-3 mb-3"
          onClick={() => {
            setClickedPrijava(true);
            handleLogin();
          }}
        >
          Prijava
        </button>

        {clickedPrijava && error && (
          <small className="text-center text-danger">
            Netočan email ili lozinka.
          </small>
        )}
      </div>
    </main>
  );
};

export default Login;
