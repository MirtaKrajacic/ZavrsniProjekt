import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
// import validateXML from "./validateQueXML.js";

function UrediProfil() {
  const [ime, setIme] = useState(""); // naslov upitnika
  const [opis, setOpis] = useState(""); // kratki opis upitnika
  const email = "";


  return (
    <div className="container">
      <h1>Moj profil</h1>

      <div className="container w-50">
        <div className="mb-5">
          <label className="form-label">
            <input
              type="text"
              className="form-control"
              placeholder="Naslov u nekoliko riječi"
              onChange={(e) => setNaslov(e.target.value)}
              value={ime}
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

export default UrediProfil;
