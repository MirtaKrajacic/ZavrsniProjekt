import { useState } from "react";

function DefinirajInterpretacije({ setParentVrednovanje, subskale }) {
  const [imeSubskale, setImeSubskale] = useState("");
  const [rows, setRows] = useState([{ min: "", max: "", interpretacija: "" }]);
  const [error, setError] = useState(false);

  const subskalaPostoji = (imeSubskale) => {
    for (const s of subskale) {
      if (s.ime === imeSubskale) {
        console.log("našli");
        return true;
      }
    }
    return false;
  };

  const provjeriInput = () => {
    let greska=0;
    rows && rows.forEach((r) => {
        if (r.min==="" || r.max ==="" || r.interpretacija==="") {
            greska=1;
        }
    })

    if (subskale.length > 0 && !subskalaPostoji(imeSubskale)) {
        greska=1;
    }

    if (greska) return true;
    return false;
  }

  /*return (
    <section className="border rounded-3">
      <small>{`Za svaku subskalu, ako ih upitnik ima, navedite njezino ime i definirajte interpretacije. 
        Inače ih definirajte za upitnik u cjelosti.`}</small>
      <input
        type="text"
        placeholder="Ime subskale (opcionalno)"
        className="form-control mb-3"
        value={imeSubskale}
        onChange={(e) => {
          setImeSubskale(e.target.value);
          setError(false);
        }}
      />
      {error && <small className="text-danger">molimo upisite imeee</small>}

      {rows.map((row, i) => (
        <div key={i} className="d-flex align-items-center gap-2 mb-2">
          <input
            type="number"
            placeholder="Donja granica"
            className="form-control"
            min={0}
            value={row.min}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((el, ind) =>
                  ind === i ? { ...el, min: e.target.value } : el
                )
              )
            }
          />
          -
          <input
            type="number"
            placeholder="Gornja granica"
            className="form-control"
            min={0}
            value={row.max}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((el, ind) =>
                  ind === i ? { ...el, max: e.target.value } : el
                )
              )
            }
          />
          <input
            type="text"
            placeholder="Interpretacija"
            className="form-control"
            value={row.interpretacija}
            onChange={(e) =>
              setRows((prev) =>
                prev.map((el, ind) =>
                  ind === i ? { ...el, interpretacija: e.target.value } : el
                )
              )
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => setRows([...rows,  { min: "", max: "", interpretacija: "" }])}
      >
        +
      </button>

      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={provjeriInput()}
        onClick={() => {
          if (subskale.length > 0 && !subskalaPostoji(imeSubskale)) {
            console.log("tak je", subskale);
            setError(true);
            return;
          }

          console.log("interpretacije: ", rows);

          setParentVrednovanje((prev) => [
            ...prev,
            { skupina: imeSubskale, interpretacije: rows },
          ]);
          setRows([{ min: "", max: "", interpretacija: "" }]);
          setImeSubskale("");
        }}
      >
        Dodaj interpretacije
      </button>
    </section>
  );*/

  return (
  <section className="border rounded-3 p-3 bg-white shadow-sm mb-3">
    <small className="text-muted d-block mb-3">
      {`Za svaku subskalu, ako ih upitnik ima, navedite njezino ime i definirajte interpretacije. 
        Inače ih definirajte za upitnik u cjelosti.`}
    </small>

    <input
      type="text"
      placeholder="Ime subskale (opcionalno)"
      className={`form-control form-control-sm mb-2 ${error ? "is-invalid" : ""}`}
      value={imeSubskale}
      onChange={(e) => {
        setImeSubskale(e.target.value);
        setError(false);
      }}
    />

    <div className="gap-2 mt-2">
      {rows.map((row, i) => (
        <div key={i} className="row g-2 align-items-center mb-1">
          <div className="col-6 col-md-3">
            <input
              type="number"
              placeholder="Donja granica"
              className="form-control form-control-sm"
              min={0}
              value={row.min}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((el, ind) =>
                    ind === i ? { ...el, min: e.target.value } : el
                  )
                )
              }
            />
          </div>

          <div className="col-auto text-muted">—</div>

          <div className="col-6 col-md-3">
            <input
              type="number"
              placeholder="Gornja granica"
              className="form-control form-control-sm"
              min={0}
              value={row.max}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((el, ind) =>
                    ind === i ? { ...el, max: e.target.value } : el
                  )
                )
              }
            />
          </div>

          <div className="col-12 col-md">
            <input
              type="text"
              placeholder="Interpretacija"
              className="form-control form-control-sm"
              value={row.interpretacija}
              onChange={(e) =>
                setRows((prev) =>
                  prev.map((el, ind) =>
                    ind === i ? { ...el, interpretacija: e.target.value } : el
                  )
                )
              }
            />
          </div>
        </div>
      ))}
    </div>

    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => setRows([...rows, { min: "", max: "", interpretacija: "" }])}
      >
        + Dodaj red
      </button>

      <button
        type="button"
        className="btn btn-light border btn-sm"
        disabled={provjeriInput()}
        onClick={() => {
          /*if (subskale.length > 0 && !subskalaPostoji(imeSubskale)) {
            console.log("tak je", subskale);
            setError(true);
            return;
          }*/

          //console.log("interpretacije: ", rows);

          setParentVrednovanje((prev) => [
            ...prev,
            { skupina: imeSubskale, interpretacije: rows },
          ]);
          setRows([{ min: "", max: "", interpretacija: "" }]);
          setImeSubskale("");
        }}
      >
        Dodaj interpretacije
      </button>
    </div>
  </section>
);

}

export default DefinirajInterpretacije;
