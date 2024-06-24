
import React from "react";
import { Link } from "react-router-dom";
import Button from "../Component/AtomComponent/Button";
import "../Auth/Style.css";

function Navbar({ loggedIn, onLogout }) {
  console.log(loggedIn);
  console.log(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.reload();
  };
  return (
    <nav className="navbar">
      {localStorage.getItem("token") ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
      <Link to="/register">
        <Button>Signup</Button>
      </Link>
    </nav>
  );
}

export default Navbar;
