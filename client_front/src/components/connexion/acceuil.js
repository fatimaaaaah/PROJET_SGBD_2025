import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Grid, Card, CardContent, AppBar, Toolbar, IconButton, Link, Box, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { keyframes } from '@emotion/react';
import logoImage from '../image/logo.webp';
import featureImage1 from '../image/correction.jpg';
import featureImage2 from '../image/feedback.jpg';
import featureImage3 from '../image/tableau.jpg';

// Animation pour les boutons
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Animation pour les images
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
        secondary: isDarkMode ? '#b0b0b0' : '#555555',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            animation: `${pulse} 2s infinite`,
            '&:hover': {
              animation: 'none',
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: isDarkMode 
                ? '0 10px 20px rgba(0, 0, 0, 0.3)' 
                : '0 10px 20px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  });
};

const Acceuil = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  }, [isDarkMode]);

  const featureImages = [featureImage1, featureImage2, featureImage3];

  return (
    <ThemeProvider theme={getTheme(isDarkMode)}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo" href="/">
            <img 
              src={logoImage} 
              alt="Logo" 
              style={{ 
                height: '50px', 
                width: '100px',
                animation: `${fadeIn} 1s ease-in-out`
              }} 
            />
          </IconButton>
          
          <div style={{ flexGrow: 1 }} />

          <Button 
            color="inherit" 
            href="/signup"
            sx={{
              backgroundColor: '#1976d2', 
              color: 'white', 
              border: '2px solid white', 
              marginRight: '10px',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            S'inscrire
          </Button>
          
          <Button 
            color="inherit" 
            href="/login"
            sx={{
              backgroundColor: 'white', 
              color: '#1976d2', 
              border: '2px solid #1976d2', 
              '&:hover': {
                backgroundColor: '#f0f0f0',
              }
            }}
          >
            Se connecter
          </Button>

          <IconButton edge="end" color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ marginTop: '40px', pb: 8 }}>
        <Typography variant="h2" align="center" gutterBottom color="textPrimary">
          Plateforme Intelligente d'Évaluation Automatisée
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Une solution moderne pour la correction automatique des exercices de bases de données.
        </Typography>

        <Grid container spacing={4} sx={{ marginTop: '40px' }} direction="column">
          {[1, 2, 3].map((item, index) => (
            <Grid item xs={12} key={item} sx={{ display: 'flex', alignItems: 'center' }}>
              <Card sx={{ 
                display: 'flex', 
                width: '100%', 
                minHeight: '250px', 
                p: '20px',
                animation: `${fadeIn} 0.5s ease-in-out ${item * 0.2}s both`
              }}>
                <img 
                  src={featureImages[index]} 
                  alt={`Feature ${item}`} 
                  style={{ 
                    width: '300px', 
                    height: 'auto', 
                    objectFit: 'cover', 
                    marginRight: '20px',
                    borderRadius: '8px'
                  }} 
                />
                
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'left' }}>
                      {item === 1 ? 'Correction Automatique' : 
                       item === 2 ? 'Feedback Détaillé' : 'Tableau de Bord Analytique'}
                    </Typography>
                    <Typography color="textSecondary" sx={{ textAlign: 'left', fontSize: '1.2rem' }}>
                      {item === 1 ? 'Utilisation de l\'IA pour corriger les exercices de bases de données avec une précision inégalée. Notre système analyse les requêtes SQL et fournit une évaluation instantanée.' :
                       item === 2 ? 'Retour personnalisé sur les erreurs et suggestions d\'amélioration. Chaque correction est accompagnée d\'explications claires pour faciliter l\'apprentissage.' :
                       'Suivi des performances et statistiques détaillées. Visualisez votre progression et identifiez vos points forts et faibles grâce à nos outils analytiques avancés.'}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ mt: 'auto', alignSelf: 'flex-start' }}>
                    <Button 
                      variant="contained" 
                      href="/login"
                      sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        }
                      }}
                    >
                      En savoir plus
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ height: '10px' }} />

      {/* Footer en fond blanc */}
      {/* Footer */}
<Box sx={(theme) => ({ 
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: '40px 0 20px',
  borderTop: `1px solid ${theme.palette.divider}`
})}>
  <Container maxWidth="lg">
    {/* Modification principale ici : spacing augmenté de 2 à 6 */}
    <Grid container spacing={6} alignItems="flex-start">
      {/* Newsletter */}
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6" gutterBottom>Newsletter</Typography>
          <Typography paragraph sx={{ mb: 2 }}>
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités...
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
            />
            <Button 
              variant="contained" 
              color="primary"
              sx={{ whiteSpace: 'nowrap', px: 2 }}
            >
              S'abonner
            </Button>
          </Box>
        </Box>
      </Grid>
     
      {/* Contact et Adresse groupés */}
      <Grid item xs={12} md={6} container spacing={12}>
        {/* Contact */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Contact</Typography>
            <Typography sx={{ mb: 1 }}>
              Email: <Link href="mailto:contact@platforme.com" color="primary">contact@platforme.com</Link>
            </Typography>
            <Typography sx={{ mb: 0 }}>
              Téléphone: +33 1 23 45 67 89
            </Typography>
          </Box>
        </Grid>

        {/* Adresse */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Adresse</Typography>
            <Typography sx={{ mb: 0 }}>
              123 Rue Exemple<br />
              75000 Paris<br />
              France
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    {/* Copyright */}
    <Box sx={{ 
      mt: 3,
      pt: 2,
      borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
      textAlign: 'center'
    }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Plateforme Intelligente d'Évaluation Automatisée. Tous droits réservés.
      </Typography>
    </Box>
  </Container>
</Box>

    </ThemeProvider>
  );
};

export default Acceuil;
