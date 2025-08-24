import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
// import validateXML from "./validateQueXML.js";

import api from "../../api";

function UrediProfil() {
  const [ime, setIme] = useState("");
  const [opis, setOpis] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Moj profil";
    dohvatiPodatke();
  }, []);

  const dohvatiPodatke = async () => {
    try {
      const { data } = await api.get("/korisnik/get-korisnik");
      setIme(data.ime);
      setEmail(data.email);
      if (data.opis) {
        setOpis(data.opis);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const urediProfil = async () => {
    try {
      let { data } = await api.put("/korisnik/update-korisnik", { ime, opis });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000); // automatski nestane nakon 3s
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="container">
        <h1>Moj profil</h1>

        <div className="container w-50">
          <div className="mb-5">
            <label className="form-label">
              Ime
              <input
                type="text"
                className="form-control"
                placeholder={ime}
                onChange={(e) => setIme(e.target.value)}
                value={ime}
              />
            </label>
          </div>

          <div className="mb-5">
            <label className="form-label">
              E-mail
              <input
                type="text"
                className="form-control"
                placeholder={email}
                value={email}
                style={{ cursor: "not-allowed" }}
                disabled
              />
            </label>
          </div>

          <div className="mb-5">
            <label className="form-label">
              Kratki opis
              <textarea
                name="message"
                rows="4"
                cols="100"
                className="form-control"
                placeholder={
                  opis || "Kratki opis toga tko ste, čime se bavite,..."
                }
                onChange={(e) => setOpis(e.target.value)}
                value={opis}
              />
            </label>
          </div>

          <button
            className="btn btn-primary d-block mx-auto"
            onClick={urediProfil}
          >
            Spremi
          </button>

          {success && (
            <Alert variant="success" className="mt-3 text-center">
              Promjene su uspješno spremljene!
            </Alert>
          )}
        </div>
      </div>
    </main>
  );
}

export default UrediProfil;
