import AddUpitnik from "./AddUpitnik";
import { useEffect, useState } from "react";

// prikazuje sved upitnike iz baze

function Upitnici() {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    try {
      const result = async () => {
        let response = await fetch(`http://localhost:5000/get-upitnici`);
        response = await response.json();
        setUpitnici(response);
        console.log(response);
      };
      result();
    } catch (err) {
      console.error("error: ", err);
    }
  }, []);

  return (
    <>
      {upitnici.length === 0 ? (
        <p>Učitavanje...</p>
      ) : (
        <div className="container text-center">
          <div className="row  g-4">
            {upitnici.map((u) => (
              <div className="col" key={u.id}>
                <div
                  className="card h-100 shadow border-0"
                  style={{ width: "18rem", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold">
                      {u.naslov}
                    </h5>
                    <p className="card-text text-secondary">
                      *preview upitnika*
                    </p>
                    <p>autor id: {u.autor_id}</p>
                    <button className="btn btn-primary btn-sm mt-2">
                      Otvori upitnik
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/*
        
    */}
    </>
  );
}

export default Upitnici;
