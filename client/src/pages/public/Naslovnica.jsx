import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../../api";
import UpitniciCards from "../../components/UpitniciCards";

const Naslovnica = () => {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    document.title = "Naslovnica";
  }, []);

  useEffect(() => {
    getUpitnici();
  }, []); 

  const getUpitnici = async () => {
    try {
      const result = await api.get("/upitnik/get-upitnici");
      setUpitnici(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchHandle = async (event) => {
    try {
      let key = event.target.value;
      if (key) {
        const { data } = await api.get(`/upitnik/search/${key}`);
        if (data) {
          setUpitnici(data);
        }
      } else {
        getUpitnici();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <input
        type="text"
        className="form-control search-input mx-auto w-50"
        placeholder="Pretraži..."
        onChange={searchHandle}
      />

      {upitnici.length > 0 ? (
        <UpitniciCards data={upitnici}>
          {(u) => (
            <>
              <p className="card-text text-secondary mb-0">
                <Link
                  to={"/profiles/" + u.ime.split(" ").join("-")}
                  state={{ id: u.autor_id }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Autor: {u.ime}
                </Link>
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Link
                  to={"/upitnik/" + u.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                  className="border-0 mt-3"
                >
                  <button className="btn btn-primary">Riješi</button>
                </Link>
              </div>
            </>
          )}
        </UpitniciCards>
      ) : (
        <p className="text-center">Nema pronađenih upitnika...</p>
      )}
    </main>
  );
};

export default Naslovnica;
