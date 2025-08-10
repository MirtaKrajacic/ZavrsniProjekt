import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Upitnici from "./Upitnici";

const Naslovna = () => {
  const [upitnici, setUpitnici] = useState([]);

  useEffect(() => {
    document.title = "Naslovnica";
  }, []);

  const getUpitnici = async () => {
    let result = await fetch("http://localhost:5000/upitnici", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    result = await result.json();
    setUpitnici(result);
  };


  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
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

      <Upitnici />
      
      {/*
        upitnici.length > 0 ? 
        <div className="container text-center">
        {Array.isArray(upitnici) &&
          upitnici.map((item, index) => {
            return (
              <div className="row" key={index}>
                <div className="col">{index + 1}</div>
                <div className="col">{item.name}</div>
                <div className="col">{item.price}</div>
                <div className="col">{item.category}</div>
                <div className="col">
                  <button onClick={() => deleteProduct(item.id)}>Delete</button>
                  <Link to={"/update/" + item.id}>Update</Link>
                </div>
              </div>
            );
          })}
      </div>
      : <h1>Nema pronađenih upitnika</h1>
      */}
      
    </>
  );
};

export default Naslovna;
