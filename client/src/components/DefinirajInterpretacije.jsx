import { useState } from "react";

function DefinirajInterpretacije({ setParentVrednovanje, subskale }) {
  function PoSubskalama({ s }) {
    const [rows, setRows] = useState([{ raspon: "", tekst: "" }]); // u svakoj subskali imam jednu skupinu interpretacija

    return (
      <div>
        <input
          type="text"
          className={`form-control form-control-sm mb-2`}
          value={s}
          disabled
        />

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
                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => console.log("izbrisi row")}
                />
              </div>
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

          <button
            type="button"
            className="btn btn-light border btn-sm"
            onClick={() => {
              console.log("rows ove skupine: ", rows.filter((r) => r.raspon !== "" && r.tekst !==""));
              setParentVrednovanje((prev) => {
                let copy = {...prev};
                copy[s] = rows.filter((r) => r.raspon !== "" && r.tekst !=="");
                return copy;
              })
            }}
          >
            Spremi interpretacije
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="border rounded-3 p-3 bg-white shadow-sm mb-3">
      <small className="text-muted d-block mb-3">
        {`Za svaku subskalu, ako ih upitnik ima, definirajte interpretacije. 
        Inače ih definirajte za upitnik u cjelosti.
        Definira se po jedna tekstualna interpretacija za svaki raspon bodova.`}
      </small>

      {subskale.length > 0 ? (
        subskale.map((s, i) => (
          <PoSubskalama key={s?.ime ?? i} s={s.ime} />
        ))
      ) : (
        <PoSubskalama s={"upitnik"} />
      )}
    </section>
  );
}

export default DefinirajInterpretacije;
