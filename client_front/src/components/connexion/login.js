import React, { useState , useEffect} from "react";
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
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google'; 
import { PublicClientApplication } from '@azure/msal-browser';
import GitHubLogin from 'react-github-login';
import image1 from "../image/2.jpg";
import image2 from "../image/3.jpg";
import image3 from "../image/4.jpg";
import avatarImage from "../image/logo.webp";

const Login = () => {
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
          localStorage.setItem("token", data.token); // <-- Correction ici
          navigate("/home");
        } else {
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
    <Grid container style={{ height: "100vh" , overflow: "hidden" }}>
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              style={{
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              transition: "background-image 0.5s ease-in-out" // Animation plus rapide
            }}
            >
        {/* Indicateurs de slide */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          display: "flex",
          gap: "10px"
        }}>
          {images.map((_, index) => (
            <div 
              key={index}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: index === currentImageIndex ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer"
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </Grid>
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
          <Grid container justifyContent="center" spacing={2} style={marginTop}>
            <Grid item>
            <GoogleLogin 
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />

                  {/* <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={loginWithGoogle} // Déclenche la connexion Google
                  >
                    Google
                  </Button> */}
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