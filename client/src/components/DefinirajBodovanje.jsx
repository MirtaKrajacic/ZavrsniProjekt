import { useEffect, useState } from "react";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import UpitnikIzrada from "./UpitnikIzrada.jsx";

function DefinirajBodovanje({ xmlData }) {
  const [data, setData] = useState(null); // parsirani xml u obliku js objekta
  const [checked, setChecked] = useState(new Set()); // set id-eva podpitanja koja su obrnuto kodirana
  const [min, setMin] = useState(0); // min bodovi
  const [max, setMax] = useState(0); // max bodovi

  useEffect(() => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "", // atributi se parsiraju kao obični ključevi (kao i tagovi), bez prefiksa
    });

    setData(parser.parse(xmlData)); // xml u obliku js objekta
    console.log(`evo data u definiraj bodovanje: `, parser.parse(xmlData));
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
    const subs = arr(q.subQuestion);

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

  function ListaSekcija() {
    const sections = arr(data.questionnaire.section); // section = sekcija pitanja u queXML

    return sections.map((sec, ind) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = "Sekcija: " + titleInfo?.text || `Sekcija ${ind}`;

      const question = sec.question; // pretpostavljam da je samo jedno pitanje po sekciji

      return (
        <section key={sec.id}>
          <h2>{title}</h2>

          <IzlistajPitanja q={question} />

          <h3 style={{ backgroundColor: "#e6ffd1ff" }}>
            U kojem se rasponu kreću bodovi Likertove ljestvice?
          </h3>
          <div className="d-flex align-items-center gap-3 my-2">
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
        </section>
      );
    });
  }

  return (
    <div>
      <div className="row">
        <div className="col-6 bg-primary-subtle border border-primary-subtle rounded-3 d-flex flex-column">
          <h3 style={{ backgroundColor: "#ffead1" }}>Preview upitnika</h3>
          {data && (
            <UpitnikIzrada
              xmlData={data}
              obrnutoKodirani={checked}
              min={min}
              max={max}
            />
          )}
        </div>
        <div className="col-6 bg-light border rounded-3">
          <h3 style={{ backgroundColor: "#ffead1" }}>
            Označi koje se čestice obrnuto kodiraju, ostale se kodiraju normalno
          </h3>
          {data && <ListaSekcija className="m-3" />}
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
    </div>
  );
}

export default DefinirajBodovanje;
