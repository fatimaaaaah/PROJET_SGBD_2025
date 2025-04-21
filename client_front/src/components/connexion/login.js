import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import image1 from "../image/2.jpg";
import image2 from "../image/3.jpg";
import image3 from "../image/4.jpg";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import GitHubLogin from 'react-github-login';
import avatarImage from "../image/logo.webp";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3]; // Ajoutez autant d'images que nécessaire

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, [images.length]);

  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États pour les erreurs
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });


  //MICROSOFT 

  // Configuration Microsoft

  const msalConfig = {
    auth: {
      clientId: "VOTRE_CLIENT_ID_MICROSOFT",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:3000",
    }
  };

  const msalInstance = new PublicClientApplication(msalConfig);

  // Fonction pour gérer la connexion Microsoft
  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "email"],
      });

      // Envoyer le token au backend
      const res = await axios.post("http://localhost:5000/microsoft-login", {
        token: loginResponse.idToken
      });

      if (res.data.success) {
        login(res.data.user, res.data.token); // Utilisez la fonction login
        navigate("/home");
      } else {
        console.error("Erreur :", res.data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion Microsoft :", error);
    }
  };
  //GITHUB
  // Fonction pour gérer la connexion GitHub réussie
  const handleGitHubLoginSuccess = async (response) => {
    try {
      // Envoyer le code au backend
      const res = await axios.post("http://localhost:5000/github-login", {
        code: response.code
      });

      if (res.data.success) {
        login(res.data.user, res.data.token); // Utilisez la fonction login
        navigate("/home");
      } else {
        console.error("Erreur :", res.data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion GitHub :", error);
    }
  };

  // Fonction pour gérer l'échec de la connexion GitHub
  const handleGitHubLoginFailure = (response) => {
    console.error("Échec de la connexion GitHub :", response);
  };

  //GOOGLE

  // Fonction de succès de Google
  // Dans votre fonction de login Google (React)
  // Add these state declarations at the top of your component with other states
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Replace your current Google login handler with this:
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const res = await fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion Google');
      }
  
      const userData = {
        ...data.user,
        firstName: data.user.firstName || data.user.email?.split('@')[0],
        lastName: data.user.lastName || '',
      };
  
      login(userData, data.token);
      navigate("/home");
  
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message
      });
    }
  };

  // Update your GoogleLogin component to use the correct handler:
  const handleGoogleLoginFailure = () => {
    console.log("Échec de la connexion Google");
  };


  // États pour la gestion de la boîte d'alerte (mot de passe oublié)
  const [openDialog, setOpenDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  // Fonction pour valider le formulaire
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    // Validation de l'email
    if (!email) {
      newErrors.email = "L'email est requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email est invalide.";
      isValid = false;
    }

    // Validation du mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour ouvrir la boîte d'alerte "Mot de passe oublié"
  const handleForgotPassword = () => {
    setOpenDialog(true);
  };

  // Fonction pour gérer l'email de réinitialisation du mot de passe
  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError("Veuillez entrer un email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Un email de réinitialisation a été envoyé.");
        setOpenDialog(false);
      } else {
        setResetError(data.error || "Erreur lors de l'envoi.");
      }
    } catch (err) {
      setResetError("Une erreur s'est produite. Veuillez réessayer.");
    }
  };
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, mot_de_passe: password }),
          
        });
  
        const data = await response.json();
  
        if (response.ok) {
          login(data.user, data.token); // Use your auth context login
          navigate("/home");
        } else {
          setErrors({ 
            ...errors, 
            general: data.error || "Email ou mot de passe incorrect" 
          });
        }
      } catch (err) {
        console.error(err.message);
        setErrors({ 
          ...errors, 
          general: "Erreur de connexion au serveur" 
        });
      }
    }
  };

  const paperStyle = {
    padding: "30px 20px",
    width: 400, // Largeur augmentée du formulaire
    minHeight: 450, // Hauteur augmentée
    margin: "20px auto",
    borderRadius: "10px", // Bords arrondis pour le formulaire
  };

  const marginTop = { marginTop: 10 };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Colonne gauche : Slider d'images */}
      <Grid item sx={{
        width: "500px",
        height: "100vh", // Assurez-vous que l'image prend toute la hauteur
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flex: 1,
        zIndex: -1 // Assurez-vous que l'image ne recouvre pas le formulaire
      }} />

      {/* Colonne droite : Formulaire */}
      <Grid item xs={12} sm={8} md={5} style={{ overflowY: "auto", height: "100vh", padding: "10px" }}>
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Box
              style={{
                width: 100,
                height: 70,
                margin: "0 auto 10px",
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
              }}
            />
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              Connexion
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Entrez votre email"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            {errors.general && (
              <Typography color="error" align="center" style={marginTop}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={marginTop}
            >
              Se connecter
            </Button>
          </form>
          <Typography align="center" style={marginTop}>
            Ou connectez-vous avec :
          </Typography>

          {/* Alignement des boutons de connexion dans un Grid */}
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            mt={2}
            gap={2}
            flexWrap="wrap"
          >
            <Box>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </Box>

            <Button
              variant="outlined"
              startIcon={<MicrosoftIcon />}
              onClick={handleMicrosoftLogin}
            >
              Microsoft
            </Button>

            <GitHubLogin
              clientId="Ov23liXiPg89uvMwvlMY"
              redirectUri="http://localhost:3000/"
              onSuccess={handleGitHubLoginSuccess}
              onFailure={handleGitHubLoginFailure}
              render={(renderProps) => (
                <Button
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={renderProps.onClick}
                >
                  GitHub
                </Button>
              )}
            />
          </Box>



          <Typography align="center" style={marginTop}>
            Mot de passe {" "}
            <Link
              href="#"
              onClick={handleForgotPassword}
              style={{ cursor: "pointer" }}
            >
              oublié ?
            </Link>
          </Typography>

          {/* Boîte de dialogue pour la réinitialisation du mot de passe */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Entrez votre email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                error={!!resetError}
                helperText={resetError}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Annuler
              </Button>
              <Button onClick={handleResetPassword} color="primary">
                Envoyer l'email
              </Button>
            </DialogActions>
          </Dialog>
          <Typography align="center" style={marginTop}>
            Pas encore de compte ?{" "}
            <Link
              href="http://localhost:3000/signup"
              onClick={() => navigate("/signUp")}
              style={{ cursor: "pointer" }}
            >
              S'inscrire
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
