// element upitnika dobiven parsiranjem uploadanog XML-a

function Upitnik({ xmlData, rezultatSpecs }) {

  // definiranje skale odgovora pitanja q
  function Response({ q }) {
    /*if (q.response.free) {
      return (
        <div>
          <input type="text" maxLength={q.response.free.length} />
        </div>
      );
    }*/ // ne dopuštam ovu opciju 
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
                  value={c.value}
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
    return <em>Unsupported response</em>;
  }

  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);

  function ListaPitanja({ data }) {
    const sections = arr(data.section); // section = sekcija pitanja u queXML

    return sections.map((sec) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = titleInfo?.text || "Sekcija";

      const questions = arr(sec.question);

      return (
        <section key={sec.id}>
          <h2>
            <b>{title}</b>
          </h2>

          {questions.map((q) => {
            const subs = arr(q.subQuestion);

            return (
              <div key={q.varName || q.text}>
                <h4 dangerouslySetInnerHTML={{ __html: q.text }} />

                {subs.length ? ( // ako ima subQuestiona u Questionu
                  subs.map((sq, ind) => (
                    <div key={sq.varName}>
                      {ind+1 + '. ' + sq.text}

                      <Response
                        q={{
                          ...sq,
                          response: { // zelimo da svaki subQuestion ima svoj nezavisni response objekt
                            ...q.response,
                            varName: sq.varName, // svaki subQuestion ima svoj varName
                          },
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <Response q={q} />
                )}
              </div>
            );
          })}
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
