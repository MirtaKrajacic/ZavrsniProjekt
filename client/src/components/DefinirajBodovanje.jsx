import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import UpitnikIzrada from "./UpitnikIzrada.jsx";

// radim s pretpostavkom da svaki upitnik koji se unese ima jedan section i unutar njega jedan question
// unutar questiona su subquestions

function DefinirajBodovanje({
  xmlData,
  updateParentData,
  setParentVrednovanje,
  setParentFormula
}) {
  const [data, setData] = useState(null); // parsirani xml u obliku js objekta
  const [checked, setChecked] = useState(new Set()); // set id-eva podpitanja koja su obrnuto kodirana
  const [min, setMin] = useState(0); // min bodovi
  const [max, setMax] = useState(0); // max bodovi
  const [vrednovanje, setVrednovanje] = useState("");
  const [skupinePitanja, setSkupinePitanja] = useState([]); // subskupine pitanja unutar sekcije

  useEffect(() => {
    // postavljanje js objekta iz dobivenog xml-a
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "", // atributi se parsiraju kao obični ključevi (kao i tagovi), bez prefiksa
    });

    setData(parser.parse(xmlData)); // xml u obliku js objekta
  }, [xmlData]);

  // kada se u data unesu brojčane vrijednosti za ljestvicu odgovora,
  // mijenjamo i xml string jer je on taj koji se sprema u bazu
  useEffect(() => {
    if (data) {
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });

      const xmlString = builder.build(data);
      updateParentData(xmlString);
      //console.log(xmlString);
    }
  }, [data, updateParentData]);

  const arr = (x) => {
    if (Array.isArray(x)) {
      return x;
    } else if (x) {
      return [x];
    }
    return [];
  };

  // aktivira se kilikom na "Spremi" button
  const handleSave = () => {
    let likertRange = [];
    for (let i = min; i <= max; i++) {
      likertRange.push(i);
    }

    const resultSpecs = {
      skala_odgovora: likertRange,
      obrnuto_kodirana: [...checked],
      skupine_pitanja: skupinePitanja,
    };

    console.log(resultSpecs);
    console.log(vrednovanje);

    setParentVrednovanje(vrednovanje);
    setParentFormula(JSON.stringify(resultSpecs))

    editResponse();
  };

  const editResponse = () => {
    let count = min;

    const newData = structuredClone(data); // kopiramo data u novi objekt da možemo koristiti setData
    const sekcija = newData.questionnaire.section;
    const question = sekcija.question;

    const cats = arr(question.response.fixed.category);
    cats.forEach((cat) => {
      cat.value = count;
      count++;
      //console.log(cat.value);
    });

    setData(newData); // updateamo data tako da svaki response ima brojevne vrijednosti
  };

  function OznaciObrnutoKodirane({ q }) {
    const subs = arr(q.subQuestion); // idemo po svim pitanjima unutar sekcije

    return (
      <div key={q.varName || q.text}>
        {subs.map((sq, ind) => (
          <div key={sq.varName}>
            <label>
              <input
                type="checkbox"
                id={`input-${sq.varName}`}
                name={sq.varName}
                checked={checked.has(sq.varName)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setChecked((checkedBefore) => {
                      let checkedNow = new Set(checkedBefore);
                      checkedNow.add(e.target.name);
                      return checkedNow;
                    });
                  } else if (!e.target.checked && checked.has(e.target.name)) {
                    setChecked((checkedBefore) => {
                      let checkedNow = new Set(checkedBefore);
                      checkedNow.delete(e.target.name);
                      return checkedNow;
                    });
                  }
                }}
              />
              {` ${ind + 1}`}
            </label>
          </div>
        ))}
      </div>
    );
  }

  const ispisiPitanja = (pitanjaIds) => {
    const subQs = arr(data.questionnaire.section.question.subQuestion);
    let string = "";

    subQs.forEach((sq, ind) => {
      if (pitanjaIds.includes(sq.varName)) {
        string += `${ind + 1},`;
      }
    });

    string = string.slice(0, -1); // zadnji minus
    return string;
  };

  function DefinirajPodskupine({ q }) {
    const [ime, setIme] = useState("");
    const [odabranaPitanja, setOdabranaPitanja] = useState([]);
    const [op, setOp] = useState("sum");
    const [faktor, setFaktor] = useState(1); // faktor s kojime se množe odgovori (opcionalan)

    const subQs = arr(q.subQuestion);

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
          {subQs.map((sq, ind) => (
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
          {skupinePitanja &&
            skupinePitanja.map((s, i) => (
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
                    console.log(skupinePitanja);
                    const currSkupinaIme = s.ime;
                    setSkupinePitanja((prev) =>
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
            <option value="sum">suma</option>
            <option value="mean">srednja vrijednost</option>
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
          className="btn btn-sm btn-success"
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
            //setOdabranaPitanja([]);
            setSkupinePitanja((prev) => [...prev, skupina]);
          }}
        >
          Dodaj skupinu
        </button>
      </div>
    );
  }

  function DefinirajBodovanje() {
    const question = data.questionnaire.section.question;

    return (
      <section className="p-4 mb-4 rounded-3 border shadow-sm bg-white">
        <div className="mb-4">
          <h3 className="p-2 rounded-2 bg-success-subtle text-success fw-semibold">
            Označi koje se čestice obrnuto kodiraju, ostale se kodiraju normalno
          </h3>
          <OznaciObrnutoKodirane q={question} />
        </div>

        <h3 className="p-2 rounded-2 bg-success-subtle text-success fw-semibold">
          U kojem se rasponu kreću bodovi Likertove ljestvice?
        </h3>
        <div className="d-flex align-items-center gap-4 my-3">
          <div className="input-group w-auto">
            <span className="input-group-text">Od</span>
            <input
              type="number"
              className="form-control"
              min={0}
              max={10}
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value))}
            />
          </div>

          <div className="input-group w-auto">
            <span className="input-group-text">Do</span>
            <input
              type="number"
              className="form-control"
              min={0}
              max={10}
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value))}
            />
          </div>
        </div>

        <h3 className="p-2 rounded-2 bg-success-subtle text-success fw-semibold">
          Koje su subskale (skupine pitanja) u upitniku?
        </h3>
        <DefinirajPodskupine q={question} />
      </section>
    );
  }

  return (
    <div className="row">
      <div className="col-6 bg-primary-subtle border border-primary-subtle rounded-3 d-flex flex-column">
        <h3 className="p-2 mt-3 bg-danger-subtle rounded-2">
          Preview upitnika
        </h3>
        {data && (
          <UpitnikIzrada
            xmlData={data}
            obrnutoKodirani={checked}
            min={min}
            max={max}
          />
        )}
      </div>

      {/* definiranje bodovanja upitnika */}
      <div className="col-6 bg-light border rounded-3">
        {data && <DefinirajBodovanje className="m-3" />}

        <div className="mt-3 mb-3">
          <h3 className="p-2 rounded-2 bg-success-subtle text-success fw-semibold">Opis vrednovanja rezultata</h3>
          <textarea
            className="form-control shadow-sm"
            name="message"
            rows="8"
            placeholder={`npr.
Score Categories:
0 - 20: Normal range 
21 - 40: Mildly elevated above normal range 
41 - 60: Moderately elevated above the normal range 
61 - 80: High and well above the normal range
81 - 100: Very high and well above the normal range 
`}
            onChange={(e) => setVrednovanje(e.target.value)}
            value={vrednovanje}
          />
        </div>

        <button
          className="btn btn-primary d-block mx-auto"
          onClick={() => {
            console.log("clicked, ", checked);
            handleSave();
          }}
        >
          Spremi
        </button>
      </div>
    </div>
  );
}

export default DefinirajBodovanje;
