// UpitnikIzrada.jsx — pregledna lista: pitanja + oblik odgovora
import { useEffect } from "react";

function UpitnikIzrada({ xmlData, obrnutoKodirani, min, max }) {
  useEffect(() => {
    console.log("data promijenjena:", xmlData);
  }, [xmlData]);

  const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);

  function ListaPitanja({ data }) {
    const sections = arr(data.section);

    return sections.map((sec) => {
      const infos = arr(sec.sectionInfo);
      const titleInfo = infos.find((i) => i.position === "title");
      const title = titleInfo?.text || "Sekcija";

      const q = sec.question;
      const subQuestions = arr(q.subQuestion);

      const cats = q.response?.fixed ? arr(q.response.fixed.category) : [];

      return (
        <section key={sec.id} className="mb-4">
          <h5 className="mb-3">
            <b>{title}</b>
          </h5>
          {q?.text && (
            <p
              className="h5 mt-2"
              dangerouslySetInnerHTML={{ __html: q.text }}
            />
          )}
          <h5 className="mt-4 text-primary">Format odgovora:</h5>
          <div className="d-flex mb-3">
            {cats.map((c) => (
              <div key={c.value} className="col">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={q.response.varName}
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

          <h5 className="text-primary">Pitanja:</h5>
          <ul className="list-group list-group-flush">
            {subQuestions.map((sq, i) => (
              <li
                key={sq.varName}
                className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded-3"
              >
                <span>
                  <span className="me-2">{i + 1}.</span>
                  {sq.text}
                </span>

                {obrnutoKodirani?.has?.(sq.varName) && (
                  <span className="badge bg-success-subtle border border-success-subtle text-success">
                    obrnuto
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      );
    });
  }

  return (
    <div className="container my-3">
      <ListaPitanja data={xmlData.questionnaire} />
    </div>
  );
}

export default UpitnikIzrada;
