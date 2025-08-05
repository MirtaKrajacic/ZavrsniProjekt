import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
          navigate('/');
        }
      }, []);

  const handleLogin = async () => {
    let result = await fetch("http://localhost:5000/login", {
          method:'post',
          body:JSON.stringify({email, password}),
          headers: {
            'Content-Type':'application/json'
          }
        });
        result = await result.json(); // parses body of the response into a js object 
        console.warn(result);
        localStorage.setItem("user", JSON.stringify(result))
        navigate('/');
  }

  return (
    <div>
      <h1>Login</h1>
      <div className="container w-25">
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)} // e.target.value je curr value input elementa
            value={password}
          />
        </div>

        <button className="btn btn-primary d-block mx-auto" onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
};

export default Login;
