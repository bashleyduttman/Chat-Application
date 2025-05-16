import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name || !password) {
      setErrors((prev) => [...prev, "Fields can't be empty"]);
      return;
    }

    const loginUser = async () => {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name,
          password: password
        })
      });

      const data = await res.json();


      if (res.ok) {
        console.log(data)
        localStorage.setItem("token", data.name);
        navigate("/chatPage");
      } else {
        setErrors((prev) => [...prev, data.message || "Login failed"]);
      }
    };

    loginUser();
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors((prev) => prev.slice(0, -1));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <div className="login-container">
      <ul className="login-error-list">
        {errors.map((item, ind) => (
          <li key={ind} className="login-error-msg">{item}</li>
        ))}
      </ul>

      <div className="login-left">
        <div className="login-brand">
          <div className="login-title">
            <span className="login-highlight">L</span>
            <span>ink</span>
          </div>
          <div className="login-title">
            <span className="login-highlight">U</span>
            <span>P</span>
          </div>
        </div>
      </div>

      <div className="login-form-container">
        <form onSubmit={handleLogin}>
          <div className="login-form">
            <div className="login-input-group">
              <label>User Name</label>
              <input
                
               
                
                onChange={(e) => {
                setName(e.target.value)
        
                }}
                className="login-input"
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                type="password"
              />
            </div>

            <button className="login-button" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
