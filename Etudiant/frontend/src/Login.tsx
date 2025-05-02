import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bannerImage from "./assets/login.jpg"; // Image à gauche du formulaire
import backgroundImage from "./assets/fondbleuclair.jpg"; // Image de fond
import "./login.css";

// Déclaration de l'interface pour la réponse de l'API
interface LoginResponse {
  message: string;
  role: string;
  user: {
    id: number;
    nom: string;
    email: string;
    role: string;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post<LoginResponse>("http://localhost:5000/api/login", {
        email,
        mot_de_passe: motDePasse,
      });

      // Utilisation de la réponse avec le type défini
      const userRole = response.data.role;
      if (userRole === "etudiant") {
        navigate("/student-dashboard");
      } else if (userRole === "professeur") {
        navigate("/teacher-dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Identifiants incorrects, veuillez réessayer."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="login-content">
          <div className="login-image">
            <img src={bannerImage} alt="Banner" />
          </div>
          <div className="login-form">
            <h2 className="welcome-text">Bienvenue sur la plateforme</h2>
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogin} className="login-button">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
