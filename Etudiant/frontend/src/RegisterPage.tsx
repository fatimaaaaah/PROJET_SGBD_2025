import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";
import bannerImage from "./assets/learn.jpg"; // Importation de l'image

const RegisterPage: React.FC = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    setError("");

    if (!nom || !email || !motDePasse || !role) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!validateEmail(email)) {
      setError("L'adresse email n'est pas valide.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/register", {
        nom,
        email,
        mot_de_passe: motDePasse,
        role,
      });

      // Redirection vers dashboard selon le rôle
      if (role === "etudiant") {
        navigate("/student-dashboard");
      } else if (role === "professeur") {
        navigate("/teacher-dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="banner">
        <img src={bannerImage} alt="Background Banner" />
      </div>
      <h2>Créer un compte</h2>

      <input
        type="text"
        placeholder="Nom complet"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
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

      <div className="role-buttons">
        <button
          onClick={() => setRole("etudiant")}
          className={role === "etudiant" ? "selected" : ""}
        >
          Étudiant
        </button>
        <button
          onClick={() => setRole("professeur")}
          className={role === "professeur" ? "selected" : ""}
        >
          Professeur
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="register-button" onClick={handleRegister}>
        S'inscrire
      </button>
    </div>
  );
};

export default RegisterPage;
