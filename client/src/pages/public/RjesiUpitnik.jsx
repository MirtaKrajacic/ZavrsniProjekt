import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import { Modal, Form, Alert } from "react-bootstrap";

import api from "../../api";
import UpitnikRjesavanje from "../../components/UpitnikRjesavanje";

function RjesiUpitnik({ mod }) {
  const [xmlData, setXmlData] = useState(null);
  const [email, setEmail] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vrednovanje, setVrednovanje] = useState([]);
  const [rezultatSpecs, setRezultatSpecs] = useState(null);
  const [rezultat, setRezultat] = useState({}); // entry oblika: {ime_subskale:rezultat}; samo je jedna ako upitnik nema subskala
  const [bodoviPitanja, setBodoviPitanja] = useState({}); // entry oblika: {varName:bodovi}
  const [subskale, setSubskale] = useState([]);
  const [resetFunkcija, setResetFunkcija] = useState(true);
  const [error, setError] = useState(false);
  const [naslovUpitnika, setNaslovUpitnika] = useState("");
  const [lastPage, setLastPage] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get(
        mod === "javni"
          ? `/upitnik/get-upitnik/${params.id}`
          : `/upitnik/get-upitnik/private/${params.uuid}`
      );

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "", // atributi se parsiraju kao obični ključevi (kao i tagovi), bez prefiksa
      });
      const parsedObj = parser.parse(data.xml);

      // console.log("dobio sam vrednovanje", data.vrednovanje);
      setNaslovUpitnika(data.naslov);
      setVrednovanje(data.vrednovanje);
      setRezultatSpecs(data.formula);
      setSubskale(data.formula.skupine_pitanja);
      setXmlData(parsedObj);
    };

    fetchData();
  }, [params.id, params.uuid, mod]);

  const izracunajRezultat = () => {
    if (subskale.length > 0) {
      subskale.forEach((s) => {
        const pitanja = s.pitanja; // lista varName-ova svih pitanja

        let suma = 0;
        for (let i = 0; i < pitanja.length; i++) {
          const varName = pitanja[i];
          if (bodoviPitanja[varName] !== undefined) {
            suma += bodoviPitanja[varName];
          }
        }

        if (s.op === "srednjaVr") {
          suma /= pitanja.length;
        }
        suma *= parseInt(s.faktor_mnozenja);

        setRezultat((prije) => {
          let temp = { ...prije };
          temp[s.ime] = suma;
          return temp;
        });
      });
    } else {
      let suma = 0;
      for (const pitanje in bodoviPitanja) {
        const bodovi = bodoviPitanja[pitanje];
        suma += bodovi;
      }
      setRezultat((prije) => {
        let temp = { ...prije };
        temp["upitnik"] = suma; // ako nema subskala, napravit cemo jednu skupinu pod imenom "upitnik"
        return temp;
      });
    }
  };

  const formirajStringInterpretacije = (vrednovanje) => {
    return `
    <div style="margin:20px auto;
              padding:20px;border:1px solid #ddd;
              border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);
              font-family:Arial,sans-serif;">

    <h1 style="color:#2ac6de;text-align:center;">Vaš rezultat</h1>

    <p>Rješili ste upitnik <b>${naslovUpitnika}</b> te ste na njemu ostvarili bodove navedene niže.
    Taj se rezultat vrednuje kako je opisano u sekciji "Interpretacija rezultata".</p>

    ${Object.entries(rezultat)
      .map(([skupina, rez]) =>
        skupina === "upitnik"
          ? `<p style="margin:8px 0;">Ostvareni bodovi: <b>${rez.toFixed(
              0
            )}</b></p>`
          : `<p style="margin:8px 0;">Ostvareni bodovi na skali <b>${skupina}</b>: ${rez.toFixed(
              0
            )}</p>`
      )
      .join("")}

    <div >

    <h2 style="text-align:center;">
      Interpretacija rezultata
    </h2>

    ${Object.entries(vrednovanje)
      .map(
        ([skupina, interpretacije]) =>
          `
        <h3 style="color:#2ac6de; margin:10px;">
          ${skupina !== "upitnik" ? skupina : ""}
        </h3>
      <div style="margin-bottom:20px;border:1px solid #e3e3e3;
                  border-radius:6px;overflow:hidden;">
        
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8f9fa;text-align:left;">
              <th style="padding:8px;border-bottom:1px solid #ddd;">Raspon bodova</th>
              <th style="padding:8px;border-bottom:1px solid #ddd;">Interpretacija</th>
            </tr>
          </thead>
          <tbody>
            ${interpretacije
              .map(
                (int) => `
              <tr>
                <td style="padding:8px;border-bottom:1px solid #eee;">${int.raspon}</td>
                <td style="padding:8px;border-bottom:1px solid #eee;">${int.tekst}</td>
              </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      )
      .join("")}
    </div>
  </div>`;
  };

  const handleSubmit = async () => {
    try {
      const { data } = await api.post("/email/send-result", {
        email: email,
        result: formirajStringInterpretacije(vrednovanje),
      });
      setShowShare(false);
      setEmail("");
      if (data.success) {
        setSuccess(true);
        setResetFunkcija((prev) => !prev);
        setBodoviPitanja({});
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const arr = (x) => {
    if (Array.isArray(x)) {
      return x;
    } else if (x) {
      return [x];
    }
    return [];
  };

  const checkUpitnikIspunjen = () => {
    let subQs = arr(xmlData.questionnaire.section.question.subQuestion);
    let flag = 0;
    subQs.forEach((sq) => {
      if (!(sq.varName in bodoviPitanja)) {
        setError(true);
        flag = 1;
      }
    });

    if (flag) return;

    setError(false);
    izracunajRezultat();
    setShowShare(true);
  };

  return (
    <main>
      <h2 className="text-center my-4">
        <b>{naslovUpitnika}</b>
      </h2>
      {xmlData && (
        <div className="container mb-5 p-4 bg-primary-subtle rounded-3 d-flex flex-column align-items-center">
          <UpitnikRjesavanje
            xmlData={xmlData}
            rezultatSpecs={rezultatSpecs}
            setBodoviRoditelj={setBodoviPitanja}
            key={resetFunkcija}
            naslov={naslovUpitnika}
            flagRoditelju={setLastPage}
          />

          {lastPage && (
            <button
              className="btn btn-light border shadow-sm dodaj-button mt-5"
              onClick={() => {
                checkUpitnikIspunjen(); // provjera jesu li sva pitanja odgovorena
                if (!error) {
                }
              }}
            >
              Predaj za procjenu
            </button>
          )}

          {error && (
            <small className="text-danger d-block text-center">
              Molimo odgovorite na sva pitanja.
            </small>
          )}

          {success && (
            <Alert variant="success" className="mt-3 text-center">
              Provjerite mail za rezultate upitnika!
            </Alert>
          )}
        </div>
      )}

      <Modal
        show={showShare}
        onHide={() => {
          setShowShare(false);
          setEmail("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            Dobijte rezultate putem e-pošte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Unesite adresu e-pošte na koju ćemo vam poslati rezultate upitnika
              </Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-primary bg-primary-subtle shadow-sm"
            onClick={handleSubmit}
          >
            Pošalji
          </button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default RjesiUpitnik;
