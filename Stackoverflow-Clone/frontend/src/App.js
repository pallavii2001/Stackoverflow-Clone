import React from "react";
import RouterIndex from "./StackRouter/index";
import Navbar from "./Auth/Index";
function App() {
  return (
    <div className="App">
      <Navbar />
      <RouterIndex />
    </div>
  );
}
export default App;
