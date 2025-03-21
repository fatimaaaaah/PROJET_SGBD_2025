import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";
import image from "../image/1.jpg"; // Utilisez l'image importée
import { keyframes } from "@emotion/react";

// Animation pour l'image de fond
const fadeInBackground = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Login = () => {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États pour les erreurs
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
   //GOOGLE


// Fonction de succès de Google
const handleGoogleLoginSuccess = async (response) => {
  const { credential } = response;

  // Envoyer le token Google au backend
  try {
    const res = await fetch("http://localhost:5000/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credential }),
    });
    
    const data = await res.json();
    if (data.success) {
      navigate("/acceuil");
    } else {
      setErrors({ ...errors, general: data.error });
    }
  } catch (err) {
    console.error("Erreur d'authentification Google", err);
  }
};

const handleGoogleLoginFailure = () => {
  console.log("Google login failed");
};

// Intégration de Google Login dans le JSX
<GoogleLogin
  onSuccess={handleGoogleLoginSuccess}
  onError={handleGoogleLoginFailure}
/>


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
          // Connexion réussie, rediriger vers la page d'accueil
          navigate("/acceuil");
        } else {
          // Afficher l'erreur renvoyée par le backend
          setErrors({ ...errors, general: data.error });
        }
      } catch (err) {
        console.error(err.message);
        setErrors({ ...errors, general: "Une erreur s'est produite. Veuillez réessayer." });
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

  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 10 };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        sm={6}
        container
        justifyContent="center"
        alignItems="center"
        style={{
          backgroundImage: `url(${image})`, // Utilisation de l'image
          backgroundSize: "contain",  // Ajuster la taille de l'image pour qu'elle soit contenue
          backgroundPosition: "center",
          animation: `${fadeInBackground} 2s ease-in-out`, // Animation de l'image
          height: "100vh", // Réduction de la hauteur de l'image
          backgroundRepeat: "no-repeat", // Empêche l'image de se répéter
        }}
      />
      <Grid
        item
        xs={12}
        sm={6}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
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
          <Grid container justifyContent="center" spacing={2} style={marginTop}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => console.log("Connexion avec Google")}
              >
                Google
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => console.log("Connexion avec Microsoft")}
              >
                Microsoft
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={() => console.log("Connexion avec GitHub")}
              >
                GitHub
              </Button>
            </Grid>
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
          </Grid>
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
              href="#"
              onClick={() => navigate("/signup")}
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