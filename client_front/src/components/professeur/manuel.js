import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
import Navbar from '../Navbar/navbar';

const UserManual = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Manuel d'Utilisation
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Contexte du projet */}
      <Typography variant="h5" gutterBottom>Contexte et Objectifs</Typography>
      <Typography paragraph>
        Ce projet consiste à concevoir une plateforme web intelligente dédiée à l’évaluation automatisée des exercices en bases de données.
        Il s’adresse aux enseignants qui souhaitent gagner du temps lors des corrections et aux étudiants qui veulent obtenir des retours détaillés sur leurs travaux.
      </Typography>
      <Typography paragraph>
        Grâce à l’intégration de l’intelligence artificielle via DeepSeek (Ollama), l'application offre des corrections automatiques, des suggestions d'amélioration et un système de notation intelligent.
      </Typography>

      {/* Importance */}
      <Typography variant="h5" gutterBottom>Importance de l’Application</Typography>
      <Typography paragraph>
        L’application améliore la qualité de l’apprentissage des bases de données grâce à une évaluation rapide, juste et personnalisée.
        Elle réduit la charge de travail des enseignants et donne aux étudiants des retours constructifs quasi instantanés.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Manuel Professeur */}
      <Typography variant="h5" gutterBottom>👩‍🏫 Pour le Professeur</Typography>

      <Box ml={2}>
        <Typography variant="subtitle1">1. Création de compte / Connexion</Typography>
        <Typography paragraph>Créer un compte ou se connecter via Google, Microsoft ou GitHub.</Typography>

        <Typography variant="subtitle1">2. Dépôt de sujets</Typography>
        <Typography paragraph>Déposer un sujet d’examen au format texte ou PDF avec possibilité d’ajouter un ou plusieurs modèles de correction.</Typography>

        <Typography variant="subtitle1">3. Consultation des copies</Typography>
        <Typography paragraph>Accéder aux copies des étudiants, visualiser les PDF soumis, consulter les corrections générées automatiquement.</Typography>

        <Typography variant="subtitle1">4. Ajustement des notes</Typography>
        <Typography paragraph>Modifier la note attribuée par l’IA et ajouter des commentaires personnalisés.</Typography>

        <Typography variant="subtitle1">5. Suivi des performances</Typography>
        <Typography paragraph>Visualiser des statistiques globales : moyennes, taux de réussite, questions mal comprises.</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Manuel Étudiant */}
      <Typography variant="h5" gutterBottom>🎓 Pour l’Étudiant</Typography>

      <Box ml={2}>
        <Typography variant="subtitle1">1. Création de compte / Connexion</Typography>
        <Typography paragraph>Créer un compte étudiant ou se connecter avec Google/Microsoft/GitHub.</Typography>

        <Typography variant="subtitle1">2. Accès aux sujets</Typography>
        <Typography paragraph>Parcourir les sujets proposés par les professeurs et les télécharger.</Typography>

        <Typography variant="subtitle1">3. Soumission de réponses</Typography>
        <Typography paragraph>Envoyer ses réponses au format PDF via un système Drag & Drop ou bouton de sélection.</Typography>

        <Typography variant="subtitle1">4. Consultation de la correction</Typography>
        <Typography paragraph>Recevoir automatiquement la note et un feedback détaillé après traitement par l’IA.</Typography>

        <Typography variant="subtitle1">5. Suivi des performances</Typography>
        <Typography paragraph>Accéder à un tableau de bord personnel pour suivre l’évolution des résultats et comparer avec la moyenne générale.</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Fonctionnalités supplémentaires */}
      <Typography variant="h5" gutterBottom>⚙️ Fonctionnalités supplémentaires</Typography>

      <Box ml={2}>
        <Typography variant="subtitle1">🔔 Notifications</Typography>
        <Typography paragraph>Notifications en temps réel pour nouvelles publications, résultats, rappels de délais.</Typography>

        <Typography variant="subtitle1">🌙 Mode sombre</Typography>
        <Typography paragraph>Mode sombre activable depuis les paramètres de l'utilisateur.</Typography>

        <Typography variant="subtitle1">🔐 Sécurité</Typography>
        <Typography paragraph>Chiffrement des données, authentification OAuth2, détection de plagiat via NLP.</Typography>
      </Box>
    </div>
  );
};

export default UserManual;
