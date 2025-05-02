import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setRole(params.get("role") || "");
  }, [location]);

  const handleLogin = () => {
    if (role === "student") {
      navigate("/student-dashboard");
    } else if (role === "teacher") {
      navigate("/teacher-dashboard");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion {role === "student" ? "Étudiant" : "Professeur"}</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="login-button">Se connecter</button>
    </div>
  );
};

export default LoginPage;
