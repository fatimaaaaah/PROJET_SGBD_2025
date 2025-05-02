import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import image1 from "../image/2.jpg";
import image2 from "../image/3.jpg";
import image3 from "../image/4.jpg";
import avatarImage from "../image/logo.webp";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import GitHubLogin from 'react-github-login';


const fadeInBackground = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const SignUp = () => {
  const navigate = useNavigate();
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
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [conditions, setConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');

      // Stocker le token
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate("/home"); // Redirect after successful login

    } catch (error) {
      console.error('Erreur Google Login:', error);
      setError(error.message);
    }
  };

  // Update your GoogleLogin component to use the correct handler:
  const handleGoogleLoginFailure = () => {
    console.log("Échec de la connexion Google");
  };


  // États pour les messages d'erreur
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fonction pour valider la complexité du mot de passe
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Gestion de la soumission du formulaire
  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !mot_de_passe || !confirmPassword) {
      setErrorMessage("Tous les champs sont obligatoires.");
      setOpenSnackbar(true);
      return;
    }

    // Validation des conditions d'utilisation
    if (!conditions) {
      setErrorMessage("Vous devez accepter les conditions d'utilisation.");
      setOpenSnackbar(true);
      return;
    }

    // Validation du mot de passe et de la confirmation
    if (mot_de_passe !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setOpenSnackbar(true);
      return;
    }

    // Validation de la complexité du mot de passe
    if (!validatePassword(mot_de_passe)) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      setOpenSnackbar(true);
      return;
    }

    try {
      const body = {
        nom,
        prenom,
        email,
        mot_de_passe,
      };
      const response = await fetch("http://localhost:5000/professeurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirection vers la page d'accueil après une inscription réussie
        navigate("/home");
      } else {
        // Afficher le message d'erreur renvoyé par le backend
        setErrorMessage(data.error || "Erreur lors de l'inscription. Veuillez réessayer.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      setOpenSnackbar(true);
    }
  };
  // Fermer le Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Styles
  const paperStyle = {
    padding: "30px 20px",
    width: 450, // Largeur augmentée du formulaire
    minHeight: 450, // Hauteur augmentée
    margin: "20px auto",
    borderRadius: "10px", // Bords arrondis pour le formulaire
  };

  const marginTop = { marginTop: 10 };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item sx={{
        width: "50vh",
        height: "100vh", // Assurez-vous que l'image prend toute la hauteur
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flex: 1,
        zIndex: -1 // Assurez-vous que l'image ne recouvre pas le formulaire
      }} />
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
            <Typography variant="h6" style={{ margin: "10px 0" }}>
              Inscription
            </Typography>
          </Grid>

          <form onSubmit={onSubmitForm}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  placeholder="Entrez votre nom"
                  margin="normal"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  placeholder="Entrez votre prénom"
                  margin="normal"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                 sx={{ width: '203%' }}  
                  fullWidth
                  label="Email"
                  placeholder="Entrez votre email"
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={mot_de_passe}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label=" Confirmer le mot de passe "
                  placeholder="Confirmez votre mot de passe"
                  margin="normal"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  name="conditions"
                  color="primary"
                  checked={conditions}
                  onChange={(e) => setConditions(e.target.checked)}
                  required
                />
              }
              label={
                <span>
                  J'accepte les conditions d'utilisation
                </span>
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={marginTop}
            > S'inscrire </Button>
          </form>
          <Typography align="center" style={marginTop}>
            Ou inscrivez-vous avec :
          </Typography>
          <Grid container justifyContent="center" spacing={2} style={marginTop}>
            <Grid item>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={handleMicrosoftLogin}
              >
                Microsoft
              </Button>
            </Grid>
            <Grid item>
              <GitHubLogin
                clientId="Ov23liXiPg89uvMwvlMY"
                redirectUri="http://localhost:3000/"
                onSuccess={handleGitHubLoginSuccess}
                onFailure={handleGitHubLoginFailure}
                className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 font-medium hover:bg-gray-50 transition-colors"
              />
            </Grid>
          </Grid>
          <Typography align="center" style={marginTop}>
            Déjà un compte ?{" "}
            <Link
              href="#"
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              Se connecter
            </Link>
          </Typography>
        </Paper>
      </Grid>

      {/* Snackbar pour afficher les messages d'erreur */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SignUp;