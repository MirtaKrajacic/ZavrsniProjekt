import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Prijava";
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/login", { email, password });

      if (data.auth) {
        localStorage.setItem("token", data.auth);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert("Please provide token");
      }
    } catch (err) {
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

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={handleLogin}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Login;
