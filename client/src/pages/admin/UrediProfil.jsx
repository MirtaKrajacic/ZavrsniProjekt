import { useEffect, useState } from "react";
import { Alert, Fade } from "react-bootstrap";
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
      setTimeout(() => setSuccess(false), 1500); // automatski nestane nakon 1.5s
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center">
      <div className="container py-5 border rounded-3 shadow-sm bg-light">
        <h1 className="text-center mb-5">Moj profil</h1>

        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="mb-5">
              <label className="form-label fw-semibold">Ime</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder={ime}
                onChange={(e) => setIme(e.target.value)}
                value={ime}
              />
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold">E-mail</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder={email}
                value={email}
                style={{ cursor: "not-allowed" }}
                disabled
              />
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold">Kratki opis</label>
              <textarea
                name="message"
                rows="4"
                cols="100"
                className="form-control border-primary"
                placeholder={
                  opis || "Kratki opis toga tko ste, čime se bavite,..."
                }
                onChange={(e) => setOpis(e.target.value)}
                value={opis}
              />
            </div>

            <button
              className="btn dodaj-button border d-block mx-auto"
              onClick={urediProfil}
            >
              Spremi
            </button>

            <Fade in={success} mountOnEnter unmountOnExit appear>
              <div>
                <Alert variant="success" className="mt-3 text-center mb-0">
                  Promjene su uspješno spremljene!
                </Alert>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UrediProfil;
