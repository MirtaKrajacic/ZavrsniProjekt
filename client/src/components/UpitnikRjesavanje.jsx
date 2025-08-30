// element upitnika dobiven parsiranjem uploadanog XML-a
import { useEffect, useState } from "react";

function Upitnik({ xmlData, rezultatSpecs, setBodoviRoditelj, naslov }) {
  const [bodoviPitanja, setBodoviPitanja] = useState({}); // entry oblika: {varName:bodovi}

  const min = parseInt(rezultatSpecs.skala_odgovora[0]);
  const max = parseInt(
    rezultatSpecs.skala_odgovora[rezultatSpecs.skala_odgovora.length - 1]
  );
  const obrnutoKodirani = rezultatSpecs.obrnuto_kodirana;

  console.log(rezultatSpecs);

  const arr = (x) => {
    if (Array.isArray(x)) {
      return x;
    } else if (x) {
      return [x];
    }
    return [];
  };

  // definiranje skale odgovora pitanja q
  function Response({ q }) {
    if (q.response.fixed) {
      const cats = arr(q.response.fixed.category); // idemo po svim ponudenim odgovorima
      return (
        <div className="p-3 d-flex flex-column flex-md-row justify-content-md-evenly">
          {cats.map((c) => (
            <div key={`${q.varName}-${c.value}`} className="form-check me-md-3">
              <input
                className="form-check-input"
                type="radio"
                name={q.response.varName}
                value={
                  obrnutoKodirani.includes(q.varName)
                    ? min + max - parseInt(c.value)
                    : parseInt(c.value)
                }
                id={`${q.varName}-${c.value}`}
                checked={
                  q.varName in bodoviPitanja &&
                  bodoviPitanja[q.varName] ===
                    (obrnutoKodirani.includes(q.varName)
                      ? min + max - parseInt(c.value)
                      : parseInt(c.value))
                }
                onChange={(e) => {
                  setBodoviPitanja((prev) => {
                    let temp = { ...prev };
                    temp[q.varName] = parseInt(e.target.value);
                    return temp;
                  });
                  setBodoviRoditelj((prev) => {
                    let temp = { ...prev };
                    temp[q.varName] = parseInt(e.target.value);
                    return temp;
                  });
                }}
              />
              <label
                className="form-check-label text-muted"
                htmlFor={`${q.varName}-${c.value}`}
              >
                {c.label}
              </label>
            </div>
          ))}
        </div>
      );
    }
    return <em>Unsupported response</em>;
  }

  function ListaPitanja({ question, subQs, startInd }) {
    return (
      <section>
        {subQs.map((sq, ind) => (
          <div key={sq.varName} className="mt-4">
            <span className="fw-semibold">
              {startInd + ind + 1 + ". " + sq.text}
            </span>

            <Response
              q={{
                ...sq,
                response: {
                  ...question.response, // zelimo da svaki subQuestion ima svoj nezavisni response objekt
                  varName: sq.varName, // i svoj varName
                },
              }}
            />
          </div>
        ))}
      </section>
    );
  }

  const data = xmlData.questionnaire;
  const sec = data.section; // section = sekcija pitanja u queXML
  const q = sec.question;
  const subQs = arr(q.subQuestion);

  const pageSize = 5;
  const ukupnoPages = Math.ceil(subQs.length / pageSize);
  const [page, setPage] = useState(0);
  const [currPitanja, setCurrPitanja] = useState(subQs.slice(0, 5));

  useEffect(() => {
    setCurrPitanja(subQs.slice(pageSize * page, pageSize * page + 5));
  }, [page]);

  return (
    <div className="container">
      <ListaPitanja
        question={q}
        subQs={currPitanja}
        startInd={pageSize * page}
      />

      <div className="d-flex justify-content-center align-items-center mt-4">
        <div className="d-flex justify-content-center align-items-center gap-3 my-3">
          <button
            className="btn btn-arrow px-3 py-1"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </button>

          <span className="fw-semibold text-primary">
            {page + 1} / {ukupnoPages}
          </span>

          <button
            className="btn btn-arrow px-3 py-1"
            disabled={page + 1 === ukupnoPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upitnik;
