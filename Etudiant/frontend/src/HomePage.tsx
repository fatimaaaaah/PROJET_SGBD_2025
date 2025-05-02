import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import bannerImage from "./assets/imagehomage.jpg"; // Assure-toi que l'image est bien placée

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Barre de navigation */}
      <header className="navbar">
        <h2 className="logo">Éval'DB</h2>
        {/* Assurez-vous que ce bouton redirige bien vers /login */}
        <button className="login-button" onClick={() => navigate("/login")}>Se connecter</button>
      </header>

      {/* Bannière */}
      <section className="banner">
        <img src={bannerImage} alt="Bannière d'accueil" className="banner-image" />
        <div className="banner-text">
          <h1></h1>
          <p></p>
        </div>
      </section>

      {/* Sections pour les rôles */}
      <section className="roles-section">
        <div className="role-card">
          <h3>👨‍🏫 Professeurs</h3>
          <ul>
            <li>📂 Déposez vos sujets d’exercices.</li>
            <li>📝 Ajoutez des modèles de correction.</li>
            <li>📊 Consultez et ajustez les notes.</li>
            <li>📈 Accédez aux statistiques des étudiants.</li>
          </ul>
        </div>

        <div className="role-card">
          <h3>👨‍🎓 Étudiants</h3>
          <ul>
            <li>📥 Accédez aux sujets d'examen.</li>
            <li>📄 Soumettez vos réponses en PDF.</li>
            <li>🤖 Recevez une correction automatique.</li>
            <li>📊 Suivez vos performances.</li>
          </ul>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="cta-section">
        <h2>Prêt à commencer ?</h2>
        <button className="cta-button" onClick={() => navigate("/register")}>S'inscrire maintenant</button>
      </section>
    </div>
  );
};

export default HomePage;
