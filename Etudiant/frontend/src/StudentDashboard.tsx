import React from "react";
import "./StudentDashboard.css";

const StudentDashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenue sur votre tableau de bord</h1>
        <p>Accédez à vos examens, soumettez vos réponses et suivez vos performances.</p>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>📥 Accédez aux sujets d'examen</h3>
          <ul>
            <li>Consultez tous les sujets d'examen disponibles.</li>
            <li>Choisissez celui que vous souhaitez passer.</li>
          </ul>
          <a href="/exam-topics" className="cta-button">Voir les sujets</a>
        </div>

        <div className="dashboard-section">
          <h3>📄 Soumettre vos réponses</h3>
          <ul>
            <li>Téléchargez vos réponses au format PDF.</li>
            <li>Assurez-vous que votre fichier soit correct.</li>
          </ul>
          <a href="/submit-answer" className="cta-button">Soumettre une réponse</a>
        </div>

        <div className="dashboard-section">
          <h3>🤖 Correction automatique</h3>
          <ul>
            <li>Obtenez des corrections automatiques de vos réponses.</li>
            <li>Consultez les erreurs et améliorez-vous.</li>
          </ul>
          <a href="/view-correction" className="cta-button">Voir les corrections</a>
        </div>

        <div className="dashboard-section">
          <h3>📊 Suivi de vos performances</h3>
          <ul>
            <li>Visualisez vos progrès au fil du temps.</li>
            <li>Obtenez des graphiques pour vos résultats.</li>
          </ul>
          <a href="/performance" className="cta-button">Voir les performances</a>
        </div>
      </div>

      {/* Si tu utilises des graphiques, ça serait ici */}
      <div className="dashboard-performance">
        <h2>Suivi de vos performances</h2>
        {/* Graphiques, statistiques ou autres informations */}
        <canvas id="performanceChart"></canvas>
        <p className="performance-text">Consultez vos résultats en détail ici.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
