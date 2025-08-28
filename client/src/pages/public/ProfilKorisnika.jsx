import { useLocation } from "react-router-dom";
import api from "../../api";
import { useEffect, useState } from "react";

function ProfilKorisnika() {
  //const { ime } = useParams();
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [opis, setOpis] = useState("");

  const location = useLocation();
  const { id } = location.state;

  useEffect(() => {
    dohvatiKorisnika();
  }, []);

  const dohvatiKorisnika = async () => {
    try {
      const { data } = await api.get(`/upitnik/get-korisnik/${id}`);
      console.log(id);
      setIme(data.ime);
      setEmail(data.email);
      setOpis(data.opis);
    } catch (error) {
      console.log("neuspjeh dohvacanja korisnika");
    }
  };

  return (
    <main className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body text-center">
          <img src="/profile.jpg" alt="logo" width="80" height="80" />
          <h5 className="card-title mb-3 mt-3">{ime}</h5>
          <p className="card-text text-muted mb-1 mb-3">{email}</p>
          <p className="card-text">{opis}</p>
        </div>
      </div>
    </main>
  );
}

export default ProfilKorisnika;
