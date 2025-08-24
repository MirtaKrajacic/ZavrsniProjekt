import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Registracija = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registracija";
  }, []);

  const collectData = async () => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.auth);
      navigate("/");
    } catch (err) {
      console.error(err);
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
          <div className="form-text">
            Lozinka mora imati najmanje 8 znakova.
          </div>
        </div>

        <button className="btn btn-light border w-100" onClick={collectData}>
          Registriraj se
        </button>
      </div>
    </main>
  );
};

export default Registracija;
