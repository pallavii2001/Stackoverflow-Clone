
import React, { useState } from "react";
import axios from "axios";
import Input from "../AtomComponent/Input";
import Button from "../AtomComponent/Button";


const Login = ({ onLoginSuccess }) => {
  const [id, setId] = useState("");
  
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token")); 

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleLogin = async () => {
  try {
    const response = await axios.post(
      `http://localhost:3007/user/login/${id}`, 
      {
        id: id,
      }
    );
    if (response.data.status === 200) {
      console.log("Login successful:", response.data.data);

      localStorage.setItem("token", response.data.data.data);
      setMessage("Login successful!");
      setLoggedIn(true); 
      onLoginSuccess();
    } else {
      console.error("Login failed:", response.data.message);
      setMessage("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    setMessage("Login failed. Please try again.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false); 
  };

  return (
    <div className="form-container">
      <div className="box">
        <h2>{loggedIn ? "Logout" : "Login"}</h2>
        {!loggedIn && (
          <React.Fragment>
            <Input
              type="text"
              placeholder="ID"
              value={id}
              onChange={handleIdChange}
            />
            <Button onClick={handleLogin}>Login</Button>
          </React.Fragment>
        )}
        {loggedIn && <Button onClick={handleLogout}>Logout</Button>}
        {message && <p>{message}</p>}
        {message && (
         window.location.href = "/"
        )}{" "}
        {}
      </div>
    </div>
  );
};

export default Login;
