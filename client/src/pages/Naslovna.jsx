import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Upitnici from "./Upitnici";

const Naslovna = () => {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    document.title = "Naslovnica";
  }, []);

  useEffect(() => {
    getUpitnici();
  }, []); // pokrece se samo pri prvom renderu komponente

  const getUpitnici = async () => {
    try {
      let result = await fetch(`http://localhost:5000/get-upitnici`);
      result = await result.json();
      setUpitnici(result);
    } catch (err) {
      console.error("error: ", err);
    }
  };

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
      console.log(result);
      if (result) {
        setUpitnici(result);
      }
    } else {
      getUpitnici();
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
        <Upitnici data={upitnici}>
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
        </Upitnici>
      ) : (
        <p>Nema pronađenih upitnika...</p>
      )}
    </>
  );
};

export default Naslovna;
