import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États pour les erreurs
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // État pour afficher les messages d'erreur globaux
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fonction pour valider le formulaire
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
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

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Si le formulaire est valide, traiter la connexion
      console.log("Connexion réussie !");
      setSnackbarMessage("Connexion réussie !");
      setOpenSnackbar(true);
      // Rediriger vers une autre page après la connexion
      navigate("/dashboard"); // Remplacez par la page souhaitée
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

export default Login;