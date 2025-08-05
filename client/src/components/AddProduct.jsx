import {useState} from 'react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [err, setErr] = useState(false); // doesnt work yet

    const addProduct = async() => {
        if (!name || !price || !company || !category) {
            
            setErr(true);
            console.log('nije dobro: ' + err);
            return false;
        }

        const userid = JSON.parse(localStorage.getItem('user')).id; // dohvacanje ida usera koji je to dodao
        let result = await fetch("http://localhost:5000/add-product", {
          method:'post',
          body:JSON.stringify({name, price, category, company, userid}),
          headers: {
            'Content-Type':'application/json'
          }
        });
        console.log(result);
    }

  return (
    <div>
      <h1>Add product</h1>
      <div className="container w-50">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter product name"
            onChange={(e) => setName(e.target.value)}
            value={name} 
          />
          {err && !name && <span>enter valid name</span>} 
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter price"
            onChange={(e) => setPrice(e.target.value)}
            value={price} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter category"
            onChange={(e) => setCategory(e.target.value)}
            value={category} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Company</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter company"
            onChange={(e) => setCompany(e.target.value)}
            value={company} 
          />
        </div>

        <button className="btn btn-secondary d-block mx-auto" onClick={addProduct}>Add</button>
      </div>
    </div>
  );
};

export default AddProduct;
