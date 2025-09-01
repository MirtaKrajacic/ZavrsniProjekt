// UpitnikIzrada.jsx — pregledna lista: pitanja + oblik odgovora
import { useEffect, useState } from "react";

function UpitnikIzrada({ xmlData, obrnutoKodirani, min, max }) {
  /*useEffect(() => {
    console.log("data promijenjena:", xmlData);
  }, [xmlData]);*/
  const [raspon, setRaspon] = useState([]);

  useEffect(() => {
    let likertLjestvica = [];
    for (let i = min; i <= max; i++) {
      likertLjestvica.push(i);
    }
    console.log(likertLjestvica);
    setRaspon(likertLjestvica);
  }, [min, max])

  function ListaPitanja({ data }) {
    const sections = [].concat(data.section);

    return sections.map((sec, i) => {
      const q = sec.question;
      const subQuestions = [].concat(q.subQuestion);

      const cats = q.response?.fixed ? [].concat(q.response.fixed.category) : [];

      return (
        <section key={sec.id || i}>
          <h5>Format odgovora:</h5>

          <div className="g-2 mb-3">
            {cats.map((c, i) => (
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
                    {max > min && raspon[i]>=0 && <span className="text-success">{' - bodovi: ' + raspon[i]}</span>} 
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h5>Pitanja:</h5>
          <ul className="list-group">
            {subQuestions.map((sq, i) => (
              <li
                key={sq.varName || i}
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
