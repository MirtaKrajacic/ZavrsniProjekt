import { useEffect, useState } from "react";

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
    string = string.slice(0, -1); // zadnji minus
    return string;
  };

  return (
    <div className="border rounded p-2 mb-3">
      <label className="fw-semibold">
        Unesi naziv skupine i označi pitanja koja joj pripadaju
        <input
          type="text"
          placeholder="Naziv skupine"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          className="form-control mb-2"
        />
      </label>

      <div className="mb-2">
        {pitanja.map((sq, ind) => (
          <label key={sq.varName} className="d-block">
            <input
              type="checkbox"
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
            {` ${ind + 1}`}
          </label>
        ))}
      </div>

      <div className="list-group list-group-flush">
        {parentSubskale &&
          parentSubskale.map((s, i) => (
            <div
              key={i}
              className="list-group-item mb-1 border border-primary-subtle rounded-3 d-flex justify-content-between align-items-center py-1 px-2"
            >
              <small>{s.ime}</small>
              <small>{ispisiPitanja(s.pitanja)}</small>
              <button
                type="button"
                className="btn-close"
                style={{ fontSize: "0.7rem" }}
                aria-label="Close"
                onClick={() => {
                  console.log(parentSubskale);
                  const currSkupinaIme = s.ime;
                  setParentSubskale((prev) =>
                    prev.filter((sk) => sk.ime !== currSkupinaIme)
                  );
                }}
              ></button>
            </div>
          ))}
      </div>

      <label className="fw-semibold">
        Što se računa s odgovorima unutar skupine?
        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="form-select mb-2"
        >
          <option value="suma">suma</option>
          <option value="srednjaVr">srednja vrijednost</option>
        </select>
      </label>

      <div className="mb-3">
        <label className="fw-semibold">
          Faktor s kojime se množi rezultat skupine (opcionalno)
        </label>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            value={faktor}
            onChange={(e) => setFaktor(e.target.value)}
            min="0"
          />
        </div>
      </div>

      <button
        type="button"
        className="btn btn-sm btn-light border shadow-sm"
        onClick={() => {
          if (!ime || odabranaPitanja.length === 0) return;

          // ovako je definirana jedna skupina
          const skupina = {
            ime: ime,
            pitanja: odabranaPitanja,
            op: op,
            faktor_mnozenja: faktor,
          };

          setIme("");
          setParentSubskale((prev) => [...prev, skupina]);
          console.log(op);
        }}
      >
        Dodaj skupinu
      </button>
    </div>
  );
}

export default DefinirajSubskale;
