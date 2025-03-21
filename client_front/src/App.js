import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/connexion/signUp";
import Login from "./components/connexion/login";
import Acceuil from "./components/connexion/acceuil";
import Home from "./components/professeur/home";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Acceuil />} /> {/* Page par défaut */}
        <Route path="/acceuil" element={<Acceuil />} />
        <Route path="/home" element={<Home />} />
       
      </Routes>
    </Router>
  );
};

export default App;