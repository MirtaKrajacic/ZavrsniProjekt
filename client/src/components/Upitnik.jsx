// import validateXML from "./validateQueXML.js";

// element upitnika dobiven parsiranjem uploadanog XML-a

function Upitnik({ xmlData }) {
  function RenderQuestion({ q }) {
    if (q.response.free) {
      return (
        <div>
          <input type="text" maxLength={q.response.free.length} />
        </div>
      );
    }
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
                  id={`${q.response.varName}-${c.value}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${q.response.varName}-${c.value}`}
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

  function Questionnaire({ data }) {
    const sections = arr(data.section);

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

                {subs.length ? (
                  subs.map((sq) => (
                    <div key={sq.varName}>
                      {sq.text}

                      <RenderQuestion
                        q={{
                          ...sq,
                          response: {
                            ...q.response,
                            varName: sq.varName,
                          },
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <RenderQuestion q={q} />
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
      <Questionnaire data={xmlData.questionnaire} />
    </div>
  );
}

export default Upitnik;
