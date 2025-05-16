import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Changed from phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [value, setValue] = useState([]);
  const [upper, setUpper] = useState(false);
  const [num, setNum] = useState(false);
  const [spc, setSpc] = useState(false);
  const [minc, setMinc] = useState(false);
  const navigate = useNavigate();

  const handlePassword = (val) => {
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);

    setUpper(hasUpper);
    setNum(hasNumber);
    setSpc(hasSpecial);
    setMinc(val.length >= 8);
    setPassword(val);

    return hasUpper && hasNumber && hasSpecial && val.length >= 8;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setValue((prev) => [...prev, "Fields can't be empty"]);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValue((prev) => [...prev, "Enter a valid email address"]);
    } else if (password !== confirmPassword) {
      setValue((prev) => [...prev, "Passwords do not match"]);
    } else if (!handlePassword(password)) {
      setValue((prev) => [
        ...prev,
        "Password does not meet the required conditions",
      ]);
    } else {
      const addUser = async () => {
        try {
          const res = await fetch("http://localhost:3000/api/users/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username:name,
              email,
              password,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            localStorage.setItem("token", data);
            navigate("/chatPage");
          } else {
            setValue((prev) => [...prev, data.message || "Signup failed"]);
          }
        } catch (error) {
          setValue((prev) => [...prev, "Network error or server down"]);
        }
      };

      addUser();
    }
  };

  useEffect(() => {
    if (value.length > 0) {
      const timer = setTimeout(() => {
        setValue((prev) => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <main className="main-cs">
      <ul className="open">
        {value.map((item, ind) => (
          <li key={ind} className="error-msg">{item}</li>
        ))}
      </ul>

      <div className="main-left">
        <div className="left-cs">
          <div className="spann">
            <span className="span-1">L</span>
            <span className="span-2">ink</span>
          </div>
          <br />
          <div className="spann">
            <span className="span-1">U</span>
            <span className="span-2">P</span>
          </div>
        </div>
      </div>

      <div className="register-form">
        <form onSubmit={handleRegister}>
          <div className="inform-register">
            <div className="inp-attribute">
              <label>Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                className="inp"
                type="text"
              />
            </div>

            <div className="inp-attribute">
              <label>Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="inp"
              />
            </div>

            <div className="inp-attribute">
              <label>Password</label>
              <input
                onChange={(e) => handlePassword(e.target.value)}
                className="inp"
                type="password"
              />
            </div>

            <div className="inp-attribute">
              <label>Confirm Password</label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="inp"
                type="password"
              />
            </div>

            <div className="password-check">
              <p className={!upper ? "false" : "true"}>
                {!upper ? "❌" : "✅"} At least one uppercase letter
              </p>
              <p className={!num ? "false" : "true"}>
                {!num ? "❌" : "✅"} At least one number
              </p>
              <p className={!spc ? "false" : "true"}>
                {!spc ? "❌" : "✅"} At least one special character
              </p>
              <p className={!minc ? "false" : "true"}>
                {!minc ? "❌" : "✅"} Minimum 8 characters
              </p>
            </div>

            <button className="submit-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Register;
