import { useState, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import DefinirajBodovanje from "../../components/DefinirajBodovanje.jsx";
// import validateXML from "./validateQueXML.js";

import api from "../../api.js";

function AddUpitnik() {
  const [naslov, setNaslov] = useState(""); // naslov upitnika
  const [opis, setOpis] = useState(""); // kratki opis upitnika
  const [status, setStatus] = useState(""); // status upitnika - 'javni' ili 'privatni'
  const [sadrzaj, setSadrzaj] = useState(""); // xml upitnika
  const [showShare, setShowShare] = useState(false);
  const [uuid, setUuid] = useState(uuidv4());
  const [clicked, setClicked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [vrednovanje, setVrednovanje] = useState("");
  const [formula, setFormula] = useState(null);

  const fileInput = useRef(null);

  const resetView = () => {
    setNaslov("");
    setOpis("");
    setSadrzaj("");
    setStatus("");
    setUuid(uuidv4());
    fileInput.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // dohvaćamo datoteku iz inputa

    if (file) {
      const reader = new FileReader(); // triggera se na učitavanje datoteke

      // onload je funkcija koja se poziva kada se datoteka učita (load event)
      reader.onload = (event) => {
        const xmlSadrzaj = event.target.result; // sadrzaj datoteke (string)
        setSadrzaj(xmlSadrzaj);
      };

      reader.readAsText(file); // čita file i poziva onload kada je gotov
    }
  };

  const spremiUpitnik = async () => {
    try {
      console.log("pozvali su me, spremiUpitnik!");
      console.log("moja formula ", formula);
      console.log("moje vrednovanje ", vrednovanje);

      if (status === "privatni") {
        setShowShare(true);
      } else {
        const result = await api.post("/upitnik/add-upitnik", {
          naslov,
          sadrzaj,
          status,
          kratki_opis: opis,
          vrednovanje: vrednovanje,
          formula: formula,
        });
        console.log(result.data);
        resetView();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const privatniUpitnikHandle = async () => {
    try {
      const result = await api.post(`/upitnik/add-privatni-upitnik/${uuid}`, {
        naslov,
        sadrzaj,
        status,
        kratki_opis: opis,
        link_token: uuid,
        vrednovanje: vrednovanje,
        formula: formula,
      });
      console.log(result.data);
      setShowShare(false);
      resetView();
    } catch (err) {
      console.error(err);
    }
  };

  const checkInput = () => {
    setClicked(true);
    if (naslov === "" || opis === "" || status === "" || sadrzaj === "") {
      console.log("nisu ispunjena sva obavezna polja");
    } else {
      spremiUpitnik();
      setClicked(false);
    }
  };

  return (
    <main>
      <div className="m-3">
        <h1 className="text-center">Dodaj upitnik</h1>

        <div className="mb-5">
          <label className="form-label">
            Naslov upitnika
            <input
              type="text"
              className="form-control"
              placeholder="Naslov u nekoliko riječi"
              onChange={(e) => setNaslov(e.target.value)}
              value={naslov}
            />
            {naslov === "" && clicked &&(
              <small className="text-danger">
                Molimo unesite naslov upitnika.
              </small>
            )}
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
              placeholder="Kratki opis toga za što upitnik služi"
              onChange={(e) => setOpis(e.target.value)}
              value={opis}
            />
            {opis === "" && clicked &&(
              <small className="text-danger">
                Molimo unesite opis upitnika.
              </small>
            )}
          </label>
        </div>

        <div className="mb-5">
          <legend>Označi dostupnost upitnika</legend>

          <div className="form-check">
            <label className="form-check-label">
              <input
                type="radio"
                name="visibility"
                value="javni"
                checked={status === "javni"}
                onChange={(e) => setStatus(e.target.value)}
                className={`form-check-input`}
              />
              javni
            </label>
          </div>

          <div className="form-check">
            <label className="form-check-label">
              <input
                type="radio"
                name="visibility"
                value="privatni"
                checked={status === "privatni"}
                onChange={(e) => setStatus(e.target.value)}
                className="form-check-input"
              />
              privatni
            </label>
          </div>

          {clicked && status === "" && (
            <small className="text-danger d-block">
              Molimo označite status upitnika.
            </small>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="xmlFile" className="form-label">
            Učitaj XML datoteku upitnika
          </label>
          <input
            id="xmlFile"
            type="file"
            className="form-control"
            ref={fileInput}
            accept=".xml"
            onChange={handleFileChange}
          />
          {clicked && sadrzaj === "" && (
            <small className="text-danger">Molimo učitajte datoteku.</small>
          )}
        </div>

        {sadrzaj && (
          <div className="card">
              <h3 className="card-header text-center">Definiraj bodovanje upitnika</h3>
            <div className="card-body pt-1 pb-1">
              <DefinirajBodovanje
                xmlData={sadrzaj}
                updateParentData={setSadrzaj}
                setParentVrednovanje={setVrednovanje}
                setParentFormula={setFormula}
              />
            </div>
          </div>
        )}

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={checkInput}
        >
          Dodaj upitnik
        </button>

        <Modal
          show={showShare}
          onHide={() => {
            setShowShare(false);
            setCopied(false);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Podijeli upitnik</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>URL upitnika</Form.Label>
                <Form.Control
                  type="text"
                  value={`http://localhost:3000/upitnik/p/${uuid}`}
                  readOnly
                  id="share-url"
                />
              </Form.Group>
            </Form>
            <Button
              variant="outline-success"
              onClick={async () => {
                const url = `http://localhost:3000/upitnik/p/${uuid}`;
                try {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                } catch (err) {
                  console.error("Greška kod kopiranja:", err);
                }
              }}
            >
              Podijeli
            </Button>
            {copied && (
              <Alert variant="success" className="mt-3 mb-0">
                <strong>Link kopiran.</strong>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setShowShare(false);
                setCopied(false);
              }}
            >
              Odustani
            </Button>
            <Button variant="primary" onClick={() => privatniUpitnikHandle()}>
              Dodaj
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </main>
  );
}

export default AddUpitnik;
