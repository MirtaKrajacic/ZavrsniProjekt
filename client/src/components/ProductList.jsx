import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []); // pokrece se samo pri prvom renderu komponente

  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/products", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      }
    });
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
    });
    result = await result.json();
    console.log("product deleted!");
    getProducts();
  };

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };

  return (
    <>
      <h3>Product list</h3>

      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        onChange={searchHandle}
      />

      <div className="container text-center">
        <div className="row text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">
          <div className="col">S. No.</div>
          <div className="col">Name</div>
          <div className="col">Price</div>
          <div className="col">Category</div>
          <div className="col">Operation</div>
        </div>
      </div>

      {
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
      : <h1>No result found.</h1>
      }
    </>
  );
};

export default ProductList;
