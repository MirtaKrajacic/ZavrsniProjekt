import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../../api";

function ProfilKorisnika() {
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [opis, setOpis] = useState("");

  const location = useLocation();
  const { id } = location.state;

  useEffect(() => {
    document.title = "Profil";
    dohvatiKorisnika();
  }, []);

  const dohvatiKorisnika = async () => {
    try {
      const { data } = await api.get(`/upitnik/get-korisnik/${id}`);

      setIme(data.ime);
      setEmail(data.email);
      setOpis(data.opis);
    } catch (error) {
      console.log("neuspjeh dohvacanja korisnika");
    }
  };

  return (
    <main className="container my-5">
      <div className="card shadow-sm mx-auto">
        <div className="card-body text-center">
          <img src="/profile.jpg" alt="logo" width="80" height="80" />
          <h5 className="card-title mb-4 mt-4">{ime}</h5>
          <p className="card-text text-muted mb-1 mb-4">{email}</p>
          {opis && (
            <div className="card-text border rounded-3 text-start p-2">
              <h5 className="card-text text-start">O autoru</h5>
              <p className="card-text text-muted">{opis}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProfilKorisnika;
