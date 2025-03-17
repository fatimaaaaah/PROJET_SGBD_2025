import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/connexion/signUp";
import Login from "./components/connexion/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Page par défaut */}
      </Routes>
    </Router>
  );
};

export default App;