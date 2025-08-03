import React, {useState} from "react";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const collectData = () => {
        console.warn(name, email);
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
          id="exampleFormControlInput1"
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
          id="exampleFormControlInput1"
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
          id="exampleFormControlInput1"
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
