import { useEffect, useState } from "react";

function PoSubskalama({ s, setParentVrednovanje, save, setSave }) {
  const [rows, setRows] = useState([{ raspon: "", tekst: "" }]); // u svakoj subskali imam jednu skupinu interpretacija

  useEffect(() => {
if (save) {
  setParentVrednovanje((prev) => {
              let copy = { ...prev };
              const novo = rows.filter(
                (r) => r.raspon !== "" && r.tekst !== ""
              );
              copy[s] = (copy[s] || []).concat(novo);
              return copy;
            });
            setRows([{ raspon: "", tekst: "" }]);
            setSave(false);
}
  }, [save])

  return (
    <div>
      {s !== "upitnik" && (
        <input
          type="text"
          className={`form-control form-control-sm mb-2`}
          value={s}
          disabled
        />
      )}

      <div className="gap-2 mt-2">
        {rows.map((row, i) => (
          <div key={i} className="row g-2 align-items-center mb-1">
            <div className="col-12 col-md">
              <input
                type="text"
                placeholder="npr. 0 - 7"
                className="form-control form-control-sm"
                min={0}
                value={row.raspon}
                onChange={(e) =>
                  setRows((prev) =>
                    prev.map((el, ind) =>
                      ind === i ? { ...el, raspon: e.target.value } : el
                    )
                  )
                }
              />
            </div>

            <div className="col-12 col-md d-flex align-items-center">
              <input
                type="text"
                placeholder="Interpretacija"
                className="form-control form-control-sm"
                value={row.tekst}
                onChange={(e) => {
                  setRows((prev) =>
                    prev.map((el, ind) =>
                      ind === i ? { ...el, tekst: e.target.value } : el
                    )
                  );
                }}
              />
            </div>

            <button
              type="button"
              className="btn-close"
              style={{ fontSize: "0.7rem" }}
              onClick={() =>{
                if (rows.length === 1) {
                  setRows([{ raspon: "", tekst: "" }]);
                } else {
                  setRows(prev => prev.filter((row, ind) => ind !== i))
                }
              }
              }
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center my-3">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setRows([...rows, { raspon: "", tekst: "" }])}
        >
          + Dodaj red
        </button>

        
      </div>
    </div>
  );
}

function DefinirajInterpretacije({
  setParentVrednovanje,
  vrednovanje,
  subskale,
}) {
  const [saveClicked, setSaveClicked] = useState(false);

  return (
    <section className="border rounded-3 p-3 bg-white shadow-sm mb-3">
      <small className="text-muted d-block mb-3">
        {`Za svaku subskalu, ako ih upitnik ima, definirajte interpretacije. 
        Inače ih definirajte za upitnik u cjelosti.
        Definira se po jedna tekstualna interpretacija za svaki raspon bodova.`}
      </small>

      {subskale.length > 0 ? (
        subskale.map((s, i) => (
          <PoSubskalama
            key={s.ime || i}
            s={s.ime}
            setParentVrednovanje={setParentVrednovanje}
            save={saveClicked}
            setSave={setSaveClicked}
          />
        ))
      ) : (
        <PoSubskalama
          key={"upitnik"}
          s={"upitnik"}
          setParentVrednovanje={setParentVrednovanje}
          save={saveClicked}
          setSave={setSaveClicked}
        />
      )}

      <button
          type="button"
          className="btn btn-light border btn-sm"
          onClick={() => setSaveClicked(true)}
        >
          Spremi interpretacije
        </button>

      {Object.keys(vrednovanje).length === 0 && (
        <small className="text-muted">Još nema sačuvanih interpretacija.</small>
      )}

      {Object.entries(vrednovanje).map(([s, lista]) => (
        <div key={s} className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <span className="me-2 fw-semibold text-success">
              {s !== "upitnik" ? `Skala '${s}'` : null}
            </span>
          </div>

          <ul className="list-group list-group-flush mb-3">
            {lista.map((r, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center mb-1 py-1 border bg-light rounded-3"
              >
                <span className="badge text-dark border">{r.raspon}</span>
                <div className="d-flex align-items-center gap-2">
                  <small>
                    <b>{r.tekst}</b>
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: "0.7rem" }}
                  onClick={() =>
                    setParentVrednovanje((prev) => {
                      let copy = { ...prev };
                      copy[s] = copy[s].filter(
                        (el) =>
                          !(el.raspon === r.raspon && el.tekst === r.tekst)
                      );
                      return copy;
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default DefinirajInterpretacije;
