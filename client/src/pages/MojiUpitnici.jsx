import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import Upitnici from "./Upitnici";

const MojiUpitnici = () => {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    document.title = "Moji upitnici";
  }, []);

  useEffect(() => {
    getUpitnici();
  }, []);

  const getUpitnici = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      let result = await fetch(`http://localhost:5000/get-upitnici/${userId}`);
      result = await result.json();
      console.log(result);
      setUpitnici(result);
    } catch (err) {
      console.error("error: ", err);
    }
  };

  const deleteUpitnik = async (id) => {
    try {
      // doraditi - confirmation da zelimo izbrisati
      const confirmDelete = window.confirm(
        "Jeste li sigurni da želite trajno izbrisati ovaj upitnik?"
      );
      if (!confirmDelete) return; 

      let result = await fetch(`http://localhost:5000/upitnik/${id}`, {
        method: "delete",
      });
      result = await result.json();
      console.log(result);
      getUpitnici(result);
    } catch (err) {
      console.error("error: ", err);
    }
  };

  return (
    <>
    <div className="d-flex justify-content-begin p-3 border-bottom mb-5">
      <Link className="btn btn-light btn-lg shadow">
         Dodaj novi upitnik
      </Link>
    </div>
      {upitnici.length > 0 && (
        <>
          <Upitnici data={upitnici}>
            {(u) => (
              <div className="gap-2">
                  <Link
                  className="btn btn-primary btn-sm m-2"
                    to={"/upitnik/edit/" + u.id}
                  >
                    Uredi
                  </Link>
                <button
                  className="btn btn-danger btn-sm m-2"
                  onClick={() => deleteUpitnik(u.id)}
                >
                  Izbriši
                </button>
              </div>
            )}
          </Upitnici>
        </>
      )}
    </>
  );
};

export default MojiUpitnici;
