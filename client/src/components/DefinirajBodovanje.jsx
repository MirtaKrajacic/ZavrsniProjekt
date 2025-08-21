import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import UpitnikIzrada from "./UpitnikIzrada.jsx";

function DefinirajBodovanje({ xmlData, updateParentData }) {
  const [data, setData] = useState(null); // parsirani xml u obliku js objekta
  const [checked, setChecked] = useState(new Set()); // set id-eva podpitanja koja su obrnuto kodirana
  const [min, setMin] = useState(0); // min bodovi
  const [max, setMax] = useState(0); // max bodovi
  const [vrednovanje, setVrednovanje] = useState("");
  const [skupinePitanja, setSkupinePitanja] = useState({}); // subskupine pitanja unutar sekcije
  const [countSkupina, setCountSkupina] = useState(0);
  const [sekcije, setSekcije] = useState({});

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
      console.log(xmlString);
    }
  }, [data]);

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
      obrnuto_kodirana: checked,
      skupine_pitanja: [
        {
          ime: "planiranje",
          pitanja: ["Q1", "Q4", "Q7"],
          op: "sum",
        },
        { ime: "realizacija", pitanja: ["Q2", "Q3", "Q8"], op: "mean" },
      ],
      formula: "0.6*planiranje + 0.4*realizacija",
    };
  };

  const editResponse = () => {
    console.log("pozvan sam");
    let count = min;

    const newData = structuredClone(data); // kopiramo data u novi objekt da možemo koristiti setData
    const sections = arr(newData.questionnaire.section);

    sections.forEach((sec) => {
      const question = sec.question;
      const cats = arr(question.response.fixed.category);
      cats.forEach((cat) => {
        cat.value = count;
        count++;
        console.log(cat.value);
      });
    });

    setData(newData); // updateamo data tako da svaki response ima brojevne vrijednosti
  };

  function IzlistajPitanja({ q }) {
    const subs = arr(q.subQuestion); // idemo po svim pitanjima unutar sekcije

    return (
      <div key={q.varName || q.text}>
        {subs.map((sq, sqInd) => (
          <div key={sq.varName}>
            <label>
              <input
                type="checkbox"
                id={`input-${sq.varName}`}
                name={sq.varName}
                checked={checked.has(sq.varName)}
                onChange={(e) => {
                  console.log(`clicked ${e.target.name}`);
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
              {sqInd + 1}
            </label>
          </div>
        ))}
      </div>
    );
  }

  function DefinirajPodskupine({ q, onAdd }) {
    const subs = arr(q.subQuestion);
    const [ime, setIme] = useState("");
    const [odabranaPitanja, setOdabranaPitanja] = useState([]);
    const [op, setOp] = useState("sum");

    const togglePitanje = (id) => {
      setOdabranaPitanja((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    return (
      <div className="border rounded p-2 mb-3">
        <input
          type="text"
          placeholder="Naziv skupine"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          className="form-control mb-2"
        />

        <div className="mb-2">
          {subs.map((sq) => (
            <label key={sq.varName} className="d-block">
              <input
                type="checkbox"
                checked={odabranaPitanja.includes(sq.varName)}
                onChange={() => togglePitanje(sq.varName)}
              />{" "}
              {sq.varName}
            </label>
          ))}
        </div>

        <select
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="form-select mb-2"
        >
          <option value="sum">suma</option>
          <option value="mean">srednja vrijednost</option>
        </select>

        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={() => {
            if (!ime || odabranaPitanja.length === 0) return;
            onAdd({ ime, pitanja: odabranaPitanja, op });
            setIme("");
            setOdabranaPitanja([]);
          }}
        >
          Dodaj skupinu
        </button>
      </div>
    );
  }

  function ListaSekcija() {
    const sections = arr(data.questionnaire.section); // section = sekcija pitanja u queXML

    return sections.map((sec, ind) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = "Sekcija: " + titleInfo?.text || `Sekcija ${ind}`;

      const question = sec.question; // pretpostavljam da je samo jedno pitanje po sekciji

      return (
        <section
          key={sec.id}
          className="p-4 mb-4 rounded-3 border shadow-sm bg-white"
        >
          <h2 className="mb-3 text-primary fw-bold">{title}</h2>

          <div className="mb-4">
            <IzlistajPitanja q={question} />
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
            Koje su podskupine pitanja u upitniku?
          </h3>
        </section>
      );
    });
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

      {/* definiranje bodovanja upitnika po sekcijama */}
      <div className="col-6 bg-light border rounded-3">
        <h3 className="p-2 mt-3 bg-danger-subtle rounded-2">
          Označi koje se čestice obrnuto kodiraju, ostale se kodiraju normalno
        </h3>
        {data && <ListaSekcija className="m-3" />}

        <div className="mt-3 mb-3">
          <label className="form-label fw-semibold">
            Opis vrednovanja rezultata
          </label>
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
            editResponse();
          }}
        >
          Spremi
        </button>
      </div>
    </div>
  );
}

export default DefinirajBodovanje;
