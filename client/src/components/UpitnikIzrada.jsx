// UpitnikIzrada.jsx — pregledna lista: pitanja + oblik odgovora
import { useEffect } from "react";

function UpitnikIzrada({ xmlData, obrnutoKodirani, min, max }) {
  useEffect(() => {
    console.log("data promijenjena:", xmlData);
  }, [xmlData]);

  function ListaPitanja({ data }) {
    const sections = [].concat(data.section);

    return sections.map((sec) => {
      const q = sec.question;
      const subQuestions = [].concat(q.subQuestion);

      const cats = q.response?.fixed ? [].concat(q.response.fixed.category) : [];

      return (
        <section key={sec.id} >
          <h5>Format odgovora:</h5>

          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 mb-3">
            {cats.map((c) => (
              <div key={c.value} className="col">
                <div className="form-check ms-1">
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

          <h5>Pitanja:</h5>
          <ul className="list-group">
            {subQuestions.map((sq, i) => (
              <li
                key={sq.varName}
                className="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded-3 shadow-sm"
              >
                <span>
                  <span className="me-2">{i + 1}.</span>
                  {sq.text}
                </span>

                {obrnutoKodirani && obrnutoKodirani.has(sq.varName) && (
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
