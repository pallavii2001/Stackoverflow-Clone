
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Component/Auth/Login";
import Register from "../Component/Auth/Register";
import IndexPage from "../Forum/Index";

function Routerindex() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} authenticated={authenticated} />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={<IndexPage authenticated={authenticated} />}
      />
      <Route path="/" element={IndexPage}></Route>
    </Routes>
  );
}

export default Routerindex;
