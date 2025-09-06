import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api";

const Registracija = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registracija";
  }, []);

  const validanEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegistracija = async () => {
    setClicked(true);
    if (name.length > 0 && validanEmail(email) && password.length >= 8) {
      try {
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
        });
        localStorage.setItem("token", data.auth);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center">
      <div className="card p-4 w-100" style={{ maxWidth: "420px" }}>
        <h1 className="text-center text-primary mb-4">Registracija</h1>

        <div className="mb-3 mt-4">
          <label className="form-label">Ime i prezime</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ime Prezime"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {clicked && !name.length > 0 && (
            <small className="text-danger">Molimo unesite svoje ime.</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email adresa</label>
          <input
            type="email"
            className="form-control"
            placeholder="ime@primjer.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {clicked && !validanEmail(email) && (
            <small className="text-danger">
              Molimo unesite ispravnu email adresu.
            </small>
          )}
        </div>

        <div className="mb-5">
          <label className="form-label">Lozinka</label>
          <input
            type="password"
            className="form-control"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {clicked && password.length < 8 && (
            <small className="text-danger">
              Lozinka mora imati najmanje 8 znakova.
            </small>
          )}
        </div>

        <Link className="text-center" to="/login">
          Imate korisnički račun? Prijavite se.
        </Link>

        <button
          className="btn btn-light border w-100 d-block mx-auto mt-3 mb-3"
          onClick={handleRegistracija}
        >
          Registracija
        </button>
      </div>
    </main>
  );
};

export default Registracija;
