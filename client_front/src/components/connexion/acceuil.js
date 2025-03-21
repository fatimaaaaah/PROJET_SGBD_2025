import React, { useState } from 'react';
import { Button, Container, Typography, Grid, Card, CardContent, CardActions, AppBar, Toolbar, IconButton, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Création du thème clair et sombre
const getTheme = (isDarkMode) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });
};

const Acceuil = () => {
  // État pour gérer le mode sombre/clair
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fonction pour basculer entre les modes
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={getTheme(isDarkMode)}>
      {/* Navbar horizontale */}
      <AppBar position="static">
        <Toolbar>
          {/* Logo à gauche */}
          <IconButton edge="start" color="inherit" aria-label="logo" href="/">
            <img src="/path/to/logo.png" alt="Logo" style={{ height: '40px' }} />
          </IconButton>

          {/* Espace flexible pour pousser les éléments à droite */}
          <div style={{ flexGrow: 1 }} />

          {/* Boutons à droite */}
          <Button color="inherit" href="/signup">S'inscrire</Button>
          <Button color="inherit" href="/login">Se connecter</Button>

          {/* Icône pour basculer entre mode clair et sombre */}
          <IconButton edge="end" color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container maxWidth="lg" style={{ marginTop: '40px' }}>
        <Typography variant="h2" align="center" gutterBottom>
          Plateforme Intelligente d'Évaluation Automatisée
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Une solution moderne pour la correction automatique des exercices de bases de données.
        </Typography>

        {/* Fonctionnalités de la plateforme */}
        <Grid container spacing={4} style={{ marginTop: '40px' }} direction="column">
          {/* Carte 1 */}
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Card style={{ display: 'flex', width: '100%', minHeight: '400px', padding: '20px' }}>
              {/* Image à gauche */}
              <img src="/path/to/image1.jpg" alt="Correction automatique des exercices" style={{ width: '300px', height: 'auto', objectFit: 'cover', marginRight: '20px' }} />
              {/* Contenu à droite */}
              <div style={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Correction Automatique
                  </Typography>
                  <Typography color="textSecondary">
                    Utilisation de l'IA pour corriger les exercices de bases de données.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    En savoir plus
                  </Button>
                </CardActions>
              </div>
            </Card>
          </Grid>

          {/* Carte 2 */}
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Card style={{ display: 'flex', width: '100%', minHeight: '400px', padding: '20px' }}>
              {/* Image à gauche */}
              <img src="/path/to/image2.jpg" alt="Feedback détaillé pour les erreurs" style={{ width: '300px', height: 'auto', objectFit: 'cover', marginRight: '20px' }} />
              {/* Contenu à droite */}
              <div style={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Feedback Détaillé
                  </Typography>
                  <Typography color="textSecondary">
                    Retour personnalisé sur les erreurs et suggestions d'amélioration.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    En savoir plus
                  </Button>
                </CardActions>
              </div>
            </Card>
          </Grid>

          {/* Carte 3 */}
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Card style={{ display: 'flex', width: '100%', minHeight: '400px', padding: '20px' }}>
              {/* Image à gauche */}
              <img src="/path/to/image3.jpg" alt="Tableau de bord analytique des performances" style={{ width: '300px', height: 'auto', objectFit: 'cover', marginRight: '20px' }} />
              {/* Contenu à droite */}
              <div style={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Tableau de Bord Analytique
                  </Typography>
                  <Typography color="textSecondary">
                    Suivi des performances et statistiques détaillées.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    En savoir plus
                  </Button>
                </CardActions>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1976d2', color: 'white', padding: '40px 0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Section Contact */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Contact</Typography>
              <Typography>Contactez-nous à : <Link href="mailto:contact@platforme.com" color="inherit">contact@platforme.com</Link></Typography>
              <Typography>Téléphone : +33 1 23 45 67 89</Typography>
            </Grid>

            {/* Section Adresse */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Adresse</Typography>
              <Typography>123 Rue Exemple, 75000 Paris, France</Typography>
            </Grid>

            {/* Section Newsletter */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Newsletter</Typography>
              <Typography>Inscrivez-vous pour recevoir nos dernières nouvelles et mises à jour.</Typography>
              <Button variant="outlined" color="inherit" size="small">
                S'inscrire
              </Button>
            </Grid>

            {/* Section Liens Utiles */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Liens Utiles</Typography>
              <Link href="/about" color="inherit">À propos</Link><br />
              <Link href="/terms" color="inherit">Conditions d'utilisation</Link><br />
              <Link href="/privacy" color="inherit">Politique de confidentialité</Link><br />
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
            &copy; {new Date().getFullYear()} Plateforme Intelligente d'Évaluation Automatisée. Tous droits réservés.
          </Typography>
        </Container>
      </footer>
    </ThemeProvider>
  );
};

export default Acceuil;
