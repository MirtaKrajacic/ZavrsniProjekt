import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../../api";
import UpitniciCards from "../UpitniciCards";

const Naslovnica = () => {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    document.title = "Naslovnica";
  }, []);

  useEffect(() => {
    getUpitnici();
  }, []); // pokrece se samo pri prvom renderu komponente

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
        console.log('search handle je dohvatio: ', data);
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
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Pretraži upitnike..."
        onChange={searchHandle}
        style={{
          borderRadius: "50px",
          margin: "40px auto",
          maxWidth: "50rem",
          transition: "all 0.3s ease",
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 4px 15px rgba(0, 123, 255, 0.3)";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "0 4px 10px rgba(0, 123, 255, 0.1)";
        }}
      />

      {upitnici.length > 0 ? (
        <UpitniciCards data={upitnici}>
          {(u) => (
            <button className="btn btn-primary btn-sm mt-2">
              <Link
                to={"/upitnik/" + u.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Rješi
              </Link>
            </button>
          )}
        </UpitniciCards>
      ) : (
        <p>Nema pronađenih upitnika...</p>
      )}
    </>
  );
};

export default Naslovnica;
