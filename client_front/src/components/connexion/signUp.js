import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [conditions, setConditions] = useState(false);

  // États pour les erreurs
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    conditions: "",
  });

  // État pour afficher les messages d'erreur globaux
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fonction pour valider le formulaire
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      confirmPassword: "",
      conditions: "",
    };

    // Validation du nom
    if (!nom) {
      newErrors.nom = "Le nom est requis.";
      isValid = false;
    }

    // Validation du prénom
    if (!prenom) {
      newErrors.prenom = "Le prénom est requis.";
      isValid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
      isValid = false;
    }

    // Validation de la confirmation du mot de passe
    if (!confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }

    // Validation des conditions
    if (!conditions) {
      newErrors.conditions = "Vous devez accepter les conditions d'utilisation.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Si le formulaire est valide, traiter l'inscription
      console.log("Formulaire soumis avec succès !");
      setSnackbarMessage("Inscription réussie !");
      setOpenSnackbar(true);
      // Rediriger vers une autre page après l'inscription
      navigate("/login");
    } else {
      setSnackbarMessage("Veuillez corriger les erreurs dans le formulaire.");
      setOpenSnackbar(true);
    }
  };

  // Fermer le Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const paperStyle = {
    padding: "30px 20px",
    width: 300,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 10 };

  return (
    <Grid container>
      <Grid item xs={false} sm={4} md={7} />
      <Grid item xs={12} sm={8} md={5}>
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              Inscription
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom"
              placeholder="Entrez votre nom"
              margin="normal"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              error={!!errors.nom}
              helperText={errors.nom}
            />
            <TextField
              fullWidth
              label="Prénom"
              placeholder="Entrez votre prénom"
              margin="normal"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              error={!!errors.prenom}
              helperText={errors.prenom}
            />
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
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              margin="normal"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="conditions"
                  color="primary"
                  checked={conditions}
                  onChange={(e) => setConditions(e.target.checked)}
                />
              }
              label="J'accepte les conditions d'utilisation"
            />
            {errors.conditions && (
              <Typography color="error" variant="body2">
                {errors.conditions}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={marginTop}
            >
              S'inscrire
            </Button>
          </form>
          <Typography align="center" style={marginTop}>
            Ou inscrivez-vous avec :
          </Typography>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SignUp;