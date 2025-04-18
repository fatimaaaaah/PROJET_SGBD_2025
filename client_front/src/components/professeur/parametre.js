import React, { useState } from 'react';
import { Typography, Switch, FormControlLabel, Button, Divider, Box, MenuItem, Select, FormControl, InputLabel, Link, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Navbar from '../Navbar/navbar';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [autoCorrection, setAutoCorrection] = useState(true);
  const [plagiarismDetection, setPlagiarismDetection] = useState(true);
  const [openConditionsDialog, setOpenConditionsDialog] = useState(false);

  // Fonction pour ouvrir le modal des conditions d'utilisation
  const handleOpenConditions = () => {
    setOpenConditionsDialog(true);
  };

  // Fonction pour fermer le modal des conditions d'utilisation
  const handleCloseConditions = () => {
    setOpenConditionsDialog(false);
  };

  // Fonction de sauvegarde des paramètres
  const handleSave = () => {
    // Ici tu peux envoyer les paramètres modifiés vers ton backend via une requête API
    alert("Paramètres sauvegardés !");
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Préférences Générales</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        }
        label="Activer les notifications"
      />

      <FormControlLabel
        control={
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        }
        label="Mode sombre"
      />

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <InputLabel id="lang-label">Langue</InputLabel>
        <Select
          labelId="lang-label"
          value={language}
          label="Langue"
          onChange={(e) => setLanguage(e.target.value)}
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Fonctionnalités IA</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={autoCorrection}
            onChange={() => setAutoCorrection(!autoCorrection)}
          />
        }
        label="Correction automatique des exercices"
      />

      <FormControlLabel
        control={
          <Switch
            checked={plagiarismDetection}
            onChange={() => setPlagiarismDetection(!plagiarismDetection)}
          />
        }
        label="Activer la détection de plagiat"
      />

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Confidentialité</Typography>

      {/* Lien pour afficher les conditions d'utilisation */}
      <Link
        component="button"
        variant="body2"
        onClick={handleOpenConditions}
        style={{ marginTop: '20px', display: 'inline-block', fontSize: '16px' }}
      >
        <Typography variant="body2" component="span" style={{ fontSize: '16px' }}>
          Voici les
        </Typography>
        <Typography variant="body2" component="span" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {' '}Conditions d'utilisations
        </Typography>
      </Link>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Sauvegarder les paramètres
        </Button>
      </Box>

      {/* Modal des conditions d'utilisation */}
      <Dialog
        open={openConditionsDialog}
        onClose={handleCloseConditions}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Conditions d'utilisation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            1. **Collecte des Données** : Nous collectons des données personnelles telles que votre adresse e-mail, vos informations de connexion et vos paramètres de profil. Ces données sont utilisées uniquement pour améliorer votre expérience sur la plateforme et vous fournir des services personnalisés.
          </Typography>
          <Typography variant="body2" paragraph>
            2. **Utilisation des Données** : Les données collectées sont utilisées pour améliorer les fonctionnalités de la plateforme, personnaliser votre expérience utilisateur et envoyer des notifications importantes. Nous ne partagerons jamais vos informations personnelles avec des tiers sans votre consentement préalable, sauf si la loi l'exige.
          </Typography>
          <Typography variant="body2" paragraph>
            3. **Sécurité** : Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données contre l'accès non autorisé, la perte ou la divulgation. Cependant, aucun système de transmission de données via Internet ou de stockage électronique n'est entièrement sécurisé, et nous ne pouvons garantir une sécurité absolue.
          </Typography>
          <Typography variant="body2" paragraph>
            4. **Modification des Conditions d'Utilisation** : Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Nous vous informerons de toute modification par le biais de notifications dans l'application ou par e-mail. En continuant à utiliser la plateforme après de telles modifications, vous acceptez les nouvelles conditions.
          </Typography>
          <Typography variant="body2" paragraph>
            5. **Droits d'Auteur et Propriété Intellectuelle** : Tous les contenus présents sur cette plateforme, y compris les textes, images, logos et autres éléments graphiques, sont protégés par les lois sur la propriété intellectuelle et appartiennent à la société responsable de cette application. Vous vous engagez à ne pas reproduire, distribuer ou exploiter ces contenus sans autorisation.
          </Typography>
          <Typography variant="body2" paragraph>
            6. **Support et Contact** : Si vous avez des questions ou des préoccupations concernant ces conditions ou la gestion de vos données personnelles, veuillez nous contacter via notre page de support ou par e-mail à [support@example.com].
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConditions} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;
