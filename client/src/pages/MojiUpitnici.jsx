import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import UpitniciCards from "./UpitniciCards";
import AddUpitnik from "./AddUpitnik";

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
      const { data } = await api.get(`secure/get-upitnici/${userId}`);
      console.log(data);

      if (Array.isArray(data)) {
        // provjera u slučaju da korisnik nema još ni jedan upitnik koji dolazi iz baze
        setUpitnici(data);
      } else {
        setUpitnici([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUpitnik = async (id) => {
    try {
      // doraditi - confirmation da zelimo izbrisati
      const confirmDelete = window.confirm(
        "Jeste li sigurni da želite trajno izbrisati ovaj upitnik?"
      );
      if (!confirmDelete) return;

      await api.delete(`secure/del-upitnik/${id}`);
      getUpitnici();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-begin p-3 border-bottom mb-5">
        <Link to={"/add"} className="btn btn-light btn-lg shadow">Dodaj novi upitnik</Link>
      </div>
      {upitnici.length > 0 ? (
        <>
          <UpitniciCards data={upitnici}>
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
          </UpitniciCards>
        </>
      ) : (
        <p>Još nemate ni jedan upitnik</p>
      )}
    </>
  );
};

export default MojiUpitnici;
