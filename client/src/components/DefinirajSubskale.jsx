import { useState } from "react";

function DefinirajSubskale({ pitanja, setParentSubskale, parentSubskale }) {
  const [ime, setIme] = useState("");
  const [odabranaPitanja, setOdabranaPitanja] = useState([]);
  const [op, setOp] = useState("sum");
  const [faktor, setFaktor] = useState(1); // faktor s kojime se množe odgovori (opcionalan)

  const ispisiPitanja = (pitanjaIds) => {
    let string = "";
    pitanja.forEach((sq, ind) => {
      if (pitanjaIds.includes(sq.varName)) {
        string += `${ind + 1},`;
      }
    });
    string = string.slice(0, -1); // brišem zadnji minus
    return string;
  };

  return (
    <div className="border rounded-3 p-3">
      <div className="mb-3">
        <label htmlFor="nazivSkupine" className="form-label fw-semibold mb-1">
          Naziv skupine
        </label>
        <input
          id="nazivSkupine"
          type="text"
          placeholder="npr. Anksioznost"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          className="form-control form-control-sm"
        />
      </div>

      <div className="mb-3">
        <div className="fw-semibold mb-1">Pitanja koja pripadaju skupini</div>
        <div className="row row-cols-2 row-cols-md-3">
          {pitanja.map((sq, ind) => {
            return (
              <div className="col" key={sq.varName}>
                <div className="form-check">
                  <input
                    id={`sq-${sq.varName}`}
                    type="checkbox"
                    className="form-check-input"
                    checked={odabranaPitanja.includes(sq.varName)}
                    name={sq.varName}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOdabranaPitanja((prev) => [...prev, e.target.name]);
                      } else if (
                        !e.target.checked &&
                        odabranaPitanja.includes(e.target.name)
                      ) {
                        setOdabranaPitanja((prev) =>
                          prev.filter((x) => x !== e.target.name)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`sq-${sq.varName}`}
                    className="form-check-label small"
                  >
                    {ind + 1}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-sm-6">
          <label className="form-label fw-semibold mb-1">Operacija</label>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value)}
            className="form-select form-select-sm"
          >
            <option value="suma">Suma</option>
            <option value="srednjaVr">Srednja vrijednost</option>
          </select>
        </div>

        <div className="col-sm-6">
          <label className="form-label fw-semibold mb-1">
            Faktor kojime se množi rezultat skupine (opcionalno)
          </label>
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control"
              value={faktor}
              onChange={(e) => setFaktor(e.target.value)}
              min="0"
            />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-light border btn-sm"
          disabled={!ime.trim() || odabranaPitanja.length === 0}
          onClick={() => {
            if (!ime.trim() || odabranaPitanja.length === 0) return;
            const skupina = {
              ime: ime.trim(),
              pitanja: odabranaPitanja,
              op,
              faktor_mnozenja: faktor,
            };
            setIme("");
            setOdabranaPitanja([]);
            setParentSubskale((prev) => [...prev, skupina]);
          }}
        >
          Dodaj skupinu
        </button>
      </div>

      {parentSubskale && parentSubskale.length > 0 && (
        <ul className="list-group list-group-flush mb-3">
          {parentSubskale.map((s, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center mb-1 py-1 border bg-light rounded-3"
            >
              <div className="d-flex align-items-center gap-2">
                <small>
                  <b>{s.ime}</b>
                </small>
                <span className="badge text-dark border">
                  {ispisiPitanja(s.pitanja)}
                </span>
              </div>
              <button
                type="button"
                className="btn-close"
                style={{ fontSize: "0.7rem" }}
                onClick={() =>
                  setParentSubskale((prev) =>
                    prev.filter((sk) => sk.ime !== s.ime)
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
}

export default DefinirajSubskale;
