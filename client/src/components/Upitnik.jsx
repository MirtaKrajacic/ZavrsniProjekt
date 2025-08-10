import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
// import validateXML from "./validateQueXML.js";

function Upitnik({xmlData}) {

  function RenderQuestion({ q }) {
    if (q.response.free) {
      return (
        <div>
          <input type="text" maxLength={q.response.free.length} />
        </div>
      );
    }
    if (q.response.fixed) {
      const cats = [].concat(q.response.fixed.category); // supports single or array
      return (
        <div className="row align-items-start">
          {cats.map((c) => (
            <div>
              <label key={c.value}>
                <input type="radio" name={q.response.varName} value={c.value} />
                {c.label}
              </label>
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
          <h2>{title}</h2>

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
                            varName: sq.varName, // override the varName to be per-subquestion
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
    <Questionnaire data={xmlData.questionnaire} />
  );
}

export default Upitnik;
