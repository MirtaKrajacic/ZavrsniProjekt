import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
// import validateXML from "./validateQueXML.js";

import api from "../api";
import Upitnik from "../components/Upitnik";

function AddUpitnik({ upitnikId }) {
  const [naslov, setNaslov] = useState(""); // naslov upitnika
  const [opis, setOpis] = useState(""); // kratki opis upitnika
  const [status, setStatus] = useState(""); // status upitnika - 'javni' ili 'privatni'
  const [sadrzaj, setSadrzaj] = useState(""); // xml forma upitnika

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader(); // triggera se na učitavanje datoteke

      // onload je funkcija koja se poziva kada se datoteka učita (load event)
      reader.onload = (event) => {
        const xmlSadrzaj = event.target.result; // sadrzaj datoteke (string)
        /*const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const parsedXml = parser.parse(xmlSadrzaj);*/
        setSadrzaj(xmlSadrzaj);
        console.log(xmlSadrzaj);
      };

      reader.readAsText(file); // čita file i poziva onload kada je gotov
    }
  };

  const spremiUpitnik = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const result = await api.post("/add-upitnik", {
        naslov,
        autor_id: userId,
        sadrzaj,
        status,
        kratki_opis: opis,
      });
      console.log(result.data);
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
    </div>
  );
}

export default AddUpitnik;
