// import validateXML from "./validateQueXML.js";
import { useEffect } from "react";

// element upitnika dobiven parsiranjem uploadanog XML-a

function UpitnikIzrada({ xmlData, obrnutoKodirani, min, max }) {
    useEffect(() => {
        console.log('data promijenjena:', xmlData);
    }, [xmlData]);

    /*useEffect(() => {
        if (obrnutoKodirani) {
            console.log('Obrnuto kodirani:', obrnutoKodirani);
        }
    }, [obrnutoKodirani]);*/

  function Response({ q }) {
    if (q.response.fixed) {
      const cats = [].concat(q.response.fixed.category); // idemo po svim ponudenim odgovorima
      return (
        <div className="row" style={{ padding: "10px" }}>
          {cats.map((c) => (
            <div key={c.value} className="col">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={q.response.varName}
                  value={ (obrnutoKodirani && obrnutoKodirani.has(q.varName)) ? min+max-c.value : c.value} //
                  id={`${q.varName}-${c.value}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${q.varName}-${c.value}`}
                >
                  {c.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <em>Unsupported response type</em>;
  }

  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);

  function ListaPitanja({ data }) {
    const sections = arr(data.section); // section = sekcija pitanja u queXML

    return sections.map((sec) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = titleInfo?.text || "Sekcija";

      const q = sec.question; // pretpostavljam da je samo jedno pitanje po sekciji
      const subQuestions = arr(q.subQuestion); // te ono ima više podpitanja

      return (
        <section key={sec.id}>
          <h2>
            <b>{title}</b>
          </h2>

          <div key={q.varName || q.text}>
            <h4 dangerouslySetInnerHTML={{ __html: q.text }} />

            {subQuestions.map((sq, ind) => (
              <div key={sq.varName}>
                {ind + 1 + ". " + sq.text}

                <Response
                  q={{
                    ...sq,
                    response: {
                      ...q.response,
                      varName: sq.varName,
                    },
                  }}
                />
              </div>
            ))}
          </div>
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

export default UpitnikIzrada;
