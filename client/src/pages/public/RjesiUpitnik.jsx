import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import api from "../../api";
import Upitnik from "../../components/Upitnik";

function RjesiUpitnik({ mod }) {
  const [xmlData, setXmlData] = useState(null);
  const [email, setEmail] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vrednovanje, setVrednovanje] = useState("");
  const [rezultatSpecs, setRezultatSpecs] = useState(null);
  const [rezultat, setRezultat] = useState({}); // entry oblika: {ime_subskale:rezultat}; samo je jedna ako upitnik nema subskala
  const [bodoviPitanja, setBodoviPitanja] = useState({}); // entry oblika: {varName:bodovi}
  const [subskale, setSubskale] = useState([]);
  const [resetFunkcija, setResetFunkcija] = useState(true);

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

      setVrednovanje(data.vrednovanje);
      setRezultatSpecs(data.formula);
      setSubskale(data.formula.skupine_pitanja);
      setXmlData(parsedObj);
    };

    fetchData();
  }, []);

  const izracunajRezultat = () => {
    if (subskale.length > 0) {
      subskale.forEach((s) => {
        const pitanja = s.pitanja; // lista varName-ova svih pitanja

        let suma = 0;
        for (let i = 0; i < pitanja.length; i++) {
          const varName = pitanja[i];
          if (bodoviPitanja[varName] !== undefined) {
            /////////////************ */
            suma += bodoviPitanja[varName];
          }
        }

        suma *= parseInt(s.faktor_mnozenja);
        console.log(`${s.ime}, ${s.pitanja}`);

        setRezultat((prije) => {
          let temp = { ...prije };
          temp[s.ime] = suma;
          console.log(temp);
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
        temp["skupina"] = suma;
        console.log(temp);
        return temp;
      });
    }
  };

  const handleSubmit = async () => {
    let resultString = "<h1>Vaš rezultat</h1>";
    for (const s in rezultat) {
      if (s === "skupina") {
        resultString += `
        <p>Ukupno bodova: ${rezultat[s]}</p>`;
      } else {
        resultString += `
        <p>Ostvareni bodovi na skali ${s}: ${rezultat[s]}</p>`;
      }
    }
    resultString += `<h2>Interpretacija rezultata:</h2><p>${vrednovanje}<p>`;

    try {
      const { data } = await api.post("/email/send-result", {
        email: email,
        result: resultString,
      });
      setShowShare(false);
      setEmail("");
      if (data.success) {
        setSuccess(true);
        setResetFunkcija((prev) => !prev)
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {xmlData && (
        <div className="container mb-5 p-4 bg-primary-subtle border border-primary-subtle rounded-3 d-flex flex-column align-items-center">
          <Upitnik
            xmlData={xmlData}
            rezultatSpecs={rezultatSpecs}
            setBodoviRoditelj={setBodoviPitanja}
            key={resetFunkcija}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              izracunajRezultat();
              setShowShare(true);
            }}
          >
            Submit
          </button>
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
          <Modal.Title>Dobij rezultate putem e-pošte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Unesi adresu e-pošte na koju ćemo ti poslati rezultate upitnika
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
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowShare(false);
              setEmail("");
            }}
          >
            Odustani
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Pošalji
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RjesiUpitnik;
