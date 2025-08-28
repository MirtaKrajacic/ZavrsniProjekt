// element upitnika dobiven parsiranjem uploadanog XML-a
import { useState } from "react";

function Upitnik({ xmlData, rezultatSpecs, setBodoviRoditelj, naslov }) {
  const [bodoviPitanja, setBodoviPitanja] = useState({}); // entry oblika: {varName:bodovi}

  const min = parseInt(rezultatSpecs.skala_odgovora[0]);
  const max = parseInt(
    rezultatSpecs.skala_odgovora[rezultatSpecs.skala_odgovora.length - 1]
  );
  const obrnutoKodirani = rezultatSpecs.obrnuto_kodirana;

  console.log(rezultatSpecs);

  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);

  // definiranje skale odgovora pitanja q
  function Response({ q }) {
    if (q.response.fixed) {
      const cats = arr(q.response.fixed.category); // idemo po svim ponudenim odgovorima
      return (
        <div className="p-3 d-flex flex-column flex-md-row justify-content-md-evenly">
          {cats.map((c) => (
            <div key={`${q.varName}-${c.value}`}  className="form-check me-md-3">
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
                  className="form-check-label"
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

  function ListaPitanja({ data }) {
    const sections = arr(data.section); // section = sekcija pitanja u queXML

    return sections.map((sec, i) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = titleInfo?.text || `${naslov}`;

      const q = sec.question;
      const subQs = arr(q.subQuestion);

      return (
        <section key={sec.id || i}>
          <h2 className="mb-4">
            <b>{title}</b>
          </h2>

          {subQs.map((sq, ind) => (
            <div key={sq.varName}>
              <span className="fw-semibold">{ind + 1 + ". " + sq.text}</span>

              <Response
                q={{
                  ...sq,
                  response: {
                    ...q.response, // zelimo da svaki subQuestion ima svoj nezavisni response objekt
                    varName: sq.varName, // i svoj varName
                  },
                }}
              />
            </div>
          ))}
        </section>
      );
    });
  }

  return (
    <div className="container my-5">
      <ListaPitanja data={xmlData.questionnaire} />
    </div>
  );
}

export default Upitnik;
