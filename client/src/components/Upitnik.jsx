import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
// import validateXML from "./validateQueXML.js";

function Upitnik() {
  const [sadrzaj, setSadrzaj] = useState(null);
  useEffect(() => {
    console.log(sadrzaj);
  }, [sadrzaj]);

  useEffect(() => {
    const fetchXml = async () => {
      try {
        let id = 3;
        let result = await fetch(`http://localhost:5000/api/get-xml/${id}`);
        result = await result.json();
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        setSadrzaj(parser.parse(result.xml)); // sadrzaj je JS objekt nastao parsiranjem XMLa
        //console.log(sadrzaj);
        //console.log(parser.parse(result.xml));
      } catch (err) {
        console.error("error: ", err);
      }
    };

    fetchXml();
  }, []);

  function RenderQuestion({ q }) {
    if (q.response.free) {
      return <input type="text" maxLength={q.response.free.length} />;
    }
    if (q.response.fixed) {
      const cats = [].concat(q.response.fixed.category); // supports single or array
      return cats.map((c) => (
        <label key={c.value}>
          <input type="radio" name={q.response.varName} value={c.value} />
          {c.label}
        </label>
      ));
    }
    return <em>Unsupported response</em>;
  }

  function Questionnaire({ data }) {
    const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);

    const sections = arr(data.section);

    return sections.map((sec) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = titleInfo?.text || "Sekcija";

      const questions = arr(sec.question);

      return (
        <section key={sec.id}>
          <h3>{title}</h3>

          {questions.map((q) => {
            const subs = arr(q.subQuestion);

            return (
              <div key={q.varName || q.text}>
                <p dangerouslySetInnerHTML={{ __html: q.text }} />

                {subs.length ? (
                  subs.map((sq) => (
                    <div key={sq.varName}>
                      {sq.text}
                      <RenderQuestion q={{ ...sq, response: q.response }} />
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

  return sadrzaj ? (
    <Questionnaire data={sadrzaj.questionnaire} />
  ) : (
    <p>Učitavanje...</p>
  );
}

export default Upitnik;
