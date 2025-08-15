import { useEffect, useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
// import validateXML from "./validateQueXML.js";

import api from "../../api";

function AddUpitnik({ upitnikId }) {
  const [naslov, setNaslov] = useState(""); // naslov upitnika
  const [opis, setOpis] = useState(""); // kratki opis upitnika
  const [status, setStatus] = useState(""); // status upitnika - 'javni' ili 'privatni'
  const [sadrzaj, setSadrzaj] = useState(""); // xml forma upitnika
  const [showShare, setShowShare] = useState(false);
  const [uuid, setUuid] = useState(uuidv4());
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
    const file = e.target.files[0];

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
      if (status === "privatni") {
        setShowShare(true);
      } else {
        const result = await api.post("/secure/add-upitnik", {
          naslov,
          sadrzaj,
          status,
          kratki_opis: opis,
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
      const result = await api.post(`/secure/add-privatni-upitnik/${uuid}`, {
          naslov,
          sadrzaj,
          status,
          kratki_opis: opis,
          link_token: uuid
        });
        console.log(result.data);
        setShowShare(false);
        resetView();      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Dodaj upitnik</h1>

      <div className="container w-50">
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
          </label>
        </div>

        <form className="mb-5">
          <fieldset>
            <legend>Označi dostupnost upitnika</legend>

            <label>
              <input
                type="radio"
                name="visibility"
                value="javni"
                checked={status === "javni"}
                onChange={(e) => setStatus(e.target.value)}
                required
              />
              javni
            </label>

            <label>
              <input
                type="radio"
                name="visibility"
                value="privatni"
                checked={status === "privatni"}
                onChange={(e) => setStatus(e.target.value)}
              />
              privatni
            </label>
          </fieldset>
        </form>

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
        </div>
        <button
          className="btn btn-primary d-block mx-auto"
          onClick={spremiUpitnik}
        >
          Dodaj
        </button>
      </div>

      <Modal show={showShare} onHide={() => setShowShare(false)} centered>
        <Modal.Header>
          <Modal.Title>Podijeli upitnik</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>URL upitnika</Form.Label>
              <Form.Control
                type="text"
                placeholder="Upiši ovdje..."
                value={`http://localhost:3000/upitnik/p/${uuid}`}
                readOnly
              />
            </Form.Group>
          </Form>
          <Button variant="outline-success">Share</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowShare(false)}
          >
            Odustani
          </Button>
          <Button 
          variant="primary"
          onClick={() => privatniUpitnikHandle()}
          >
            Pošalji i uploadaj</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddUpitnik;
