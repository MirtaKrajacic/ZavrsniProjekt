import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Upitnici from "./Upitnici";

const Naslovna = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "Naslovnica";
  }, []);

  useEffect(() => {}, []); // pokrece se samo pri prvom renderu komponente

  const getUpitnici = async () => {
    let result = await fetch("http://localhost:5000/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    /*let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
    });
    result = await result.json();
    console.log("product deleted!");
    getProducts();*/
  };

  const searchHandle = async (event) => {
    /*let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }*/
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

      {/*
        products.length > 0 ? 
        <div className="container text-center">
        {Array.isArray(products) &&
          products.map((item, index) => {
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
      <Upitnici />
    </>
  );
};

export default Naslovna;
