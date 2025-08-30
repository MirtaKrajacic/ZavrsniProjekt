import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import UpitnikIzrada from "./UpitnikIzrada.jsx";
import DefinirajSubskale from "./DefinirajSubskale.jsx";
import DefinirajInterpretacije from "./DefinirajInterpretacije.jsx";
import { Alert } from "react-bootstrap";

// radim s pretpostavkom da svaki upitnik koji se unese ima jedan section i unutar njega jedan question
// unutar questiona su subquestions

function DefinirajBodovanje({
  xmlData,
  updateParentData,
  setParentVrednovanje,
  setParentFormula,
}) {
  const [data, setData] = useState(null); // parsirani xml u obliku js objekta
  const [checked, setChecked] = useState(new Set()); // set id-eva podpitanja koja su obrnuto kodirana
  const [min, setMin] = useState(0); // min bodovi
  const [max, setMax] = useState(0); // max bodovi
  const [vrednovanje, setVrednovanje] = useState(""); // key-value parovi gdje je key=imeSubskale, a value lista interpretacija za tu subskalu
  const [subskale, setSubskale] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    const subskaleImena = subskale.map((s) => s.ime);
    setVrednovanje((prev) => {
      const copy = {};
      for (const [k, v] of Object.entries(prev)) {
        if (subskaleImena.includes(k)) {
          copy[k] = v;
        }
      }
      return copy;
    });
  }, [subskale]);

  const vrednovanjeValid = () => {
    if (Object.keys(vrednovanje).length === 0) {
      return false;
    }
    for (const [key, value] of Object.entries(vrednovanje)) {
      if (key === "" || value.length === 0) {
        return false;
      }
    }
    return true;
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
      skupine_pitanja: subskale,
    };

    console.log("resultSpecs:", resultSpecs);
    console.log("vrednovanje: ", vrednovanje);

    if (resultSpecs.skala_odgovora.length < 2 || !vrednovanjeValid()) {
      setError(true);
    } else {
      setParentVrednovanje(JSON.stringify(vrednovanje));
      setParentFormula(JSON.stringify(resultSpecs));

      setError(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
    }

    editResponse();
  };

  const editResponse = () => {
    let count = min;

    const newData = structuredClone(data); // kopiramo data u novi objekt da možemo koristiti setData
    const sekcija = newData.questionnaire.section;
    const question = sekcija.question;

    const cats = [].concat(question.response.fixed.category);
    cats.forEach((cat) => {
      cat.value = count;
      count++;
    });

    setData(newData); // updateamo data tako da svaki response ima brojevne vrijednosti
  };

  function OznaciObrnutoKodirane({ q }) {
    const subs = [].concat(q.subQuestion); // idemo po svim pitanjima unutar sekcije

    return (
      <div key={q.varName || q.text} className="border rounded-3 p-3">
        <div className="row row-cols-2 row-cols-md-3">
          {subs.map((sq, ind) => (
            <div key={sq.varName} className="col">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input g-1"
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
                    } else if (
                      !e.target.checked &&
                      checked.has(e.target.name)
                    ) {
                      setChecked((checkedBefore) => {
                        let checkedNow = new Set(checkedBefore);
                        checkedNow.delete(e.target.name);
                        return checkedNow;
                      });
                    }
                  }}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`input-${sq.varName}`}
                >
                  {ind + 1}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-6 bg-light border rounded-3 d-flex flex-column">
        <h3 className="p-2 mt-3 text-primary border-bottom">
          Pregled sadržaja upitnika
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

      <div className="col-6 p-0 p-3 border rounded-3 shadow-sm bg-white">
        {data && (
          <>
            <div className="mb-4">
              <h3 className="p-2 rounded-2 bg-success-subtle text-success">
                Označi koje se čestice obrnuto kodiraju
              </h3>
              <OznaciObrnutoKodirane q={data.questionnaire.section.question} />
            </div>

            <h3 className="p-2 rounded-2 bg-success-subtle text-success">
              U kojem se rasponu kreću bodovi Likertove ljestvice?*
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

            <h3 className="p-2 rounded-2 bg-success-subtle text-success">
              Koje su subskale (skupine pitanja) u upitniku?
            </h3>
            <DefinirajSubskale
              pitanja={[].concat(
                data.questionnaire.section.question.subQuestion
              )}
              setParentSubskale={setSubskale}
              parentSubskale={subskale}
            />

            <h3 className="p-2 rounded-2 bg-success-subtle text-success mt-3">
              Opis vrednovanja rezultata*
            </h3>
            <DefinirajInterpretacije
              setParentVrednovanje={setVrednovanje}
              vrednovanje={vrednovanje}
              subskale={subskale}
            />

            <button
              className="btn btn-primary d-block mx-auto"
              onClick={() => handleSave()}
            >
              Spremi
            </button>

            {error && (
              <small className="text-danger d-block text-center mt-2">
                Molimo ispunite obavezna polja
              </small>
            )}

            {success && (
              <Alert
                variant="success"
                className="d-block mx-auto mt-3 text-center w-50 bg-white border-0 text-primary"
              >
                Promjene su uspješno spremljene!
              </Alert>
            )}
          </>
        )}{" "}
      </div>
    </div>
  );
}

export default DefinirajBodovanje;
