import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
      const auth = localStorage.getItem("user");
      if (auth) {
        navigate('/');
      }
    }, []);    

    const collectData = async () => {
        //console.warn(name, email);
        let result = await fetch("http://localhost:5000/register", {
          method:'post',
          body:JSON.stringify({name, email, password}),
          headers: {
            'Content-Type':'application/json'
          }
        });
        result = await result.json(); // parses body of the response into a js object 
        console.warn(result);
        localStorage.setItem("user", JSON.stringify(result))
        navigate('/');
    };


  return (
    <div>
      <h1>Register</h1>

      <div className="container w-25">
        <div className="mb-3">
        <label className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Name Surname"
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
        value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be at least 8 characters long.
        </div>
      </div>

        <button className="btn btn-primary d-block mx-auto" onClick={collectData}>Sign Up</button>
      </div>

      
    </div>
  );
};

export default SignUp;
