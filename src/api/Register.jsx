import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { redirect } from "react-router-dom";
function Register() {
  const [name, setName] = useState("");
  const [phn, setPhn] = useState(null);
  const [password, setPassword] = useState("");
  const [value, setValue] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [upper, setUpper] = useState(false);
  const [num, setNum] = useState(false);
  const [spc, setSpc] = useState(false);
  const [minc, setMinc] = useState(false);
  const navigate=useNavigate()
  const handlePassword = (val) => {
    const value = val;
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    setUpper(hasUpper);
    setNum(hasNumber);
    setSpc(hasSpecial);
    if (value.length >= 8) {
      setMinc(true);
    } else {
      setMinc(false);
    }
    setPassword(value);
    if (!upper || !spc || !num) {
      return false;
    } else {
      return true;
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !phn || !password || !confirmPassword) {
      setValue((prev) => [...prev, "Feilds cant be empty"]);
      return;
    } else if (phn.length < 10) {
      setValue((prev) => [...prev, "Enter a Valid mobile number"]);
    } else if (password !== confirmPassword) {
      setValue((prev) => [...prev, "Password does not match"]);
    } else if (password.length < 8) {
      setValue((prev) => [...prev, "password should be atleast 8 characters"]);
    } else if (!handlePassword(password)) {
      setValue((prev) => [
        ...prev,
        "password does not satisfy the necessary condition",
      ]);
    } else {
      const addUser=async()=>{
        const res = await fetch("http://localhost:3000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            phoneNumber: phn,
            password: password
          })
        });
        const data=await res.json()
        if(res.ok){
          localStorage.setItem("token",data.token)
          console.log(data.token)
          navigate("/chatPage")
        }
        else{
         
          setValue((prev)=>[...prev,data.message])
        }
        
      }
      addUser()



      
    }
  };
  useEffect(() => {
    if (value.length > 0) {
      const timer = setTimeout(() => {
        setValue((prev) => prev.slice(0, -1));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <main className="main-cs">
      <ul className="open">
        {value.map((item, ind) => (
          <li className="error-msg">{item}</li>
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
              <div>
                <label>Name</label>
              </div>

              <input
                onChange={(e) => setName(e.target.value)}
                className="inp"
                type="text"
              />
            </div>
            <div className="inp-attribute">
              <div>
                <label>Phone Number</label>
              </div>

              <input
                maxLength={10}
                pattern="[0-9]*"
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setPhn(value);
                }}
                className="inp"
              />
            </div>
            <div className="inp-attribute">
              <div>
                <label>Password</label>
              </div>

              <input
                onChange={(e) => handlePassword(e.target.value)}
                className="inp"
                type="password"
              />
            </div>
            <div className="inp-attribute">
              <div>
                <label>Confirm Password</label>
              </div>

              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="inp"
                type="password"
              />
            </div>

            <div className="password-check">
              <p className={!upper ? "false" : "true"}>
                {!upper ? "❌" : "✅"}Atleast one upperCase
              </p>
              <p className={!num ? "false" : "true"}>
                {!num ? "❌" : "✅"}Atleast one numeric character
              </p>
              <p className={!spc ? "false" : "true"}>
                {!spc ? "❌" : "✅"}Atleast one special character
              </p>
              <p className={!minc ? "false" : "true"}>
                {!minc ? "❌" : "✅"}minimum characters should be 8
              </p>
            </div>
            <button className="submit-btn" type="submit">
              submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
export default Register;
