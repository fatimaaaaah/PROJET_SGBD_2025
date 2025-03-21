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
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GitHubIcon from "@mui/icons-material/GitHub";
import image from "../image/1.jpg";


const SignUp = () => {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [conditions, setConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    padding: "20px",
    width: "90%", // Réduire la largeur du formulaire
    maxWidth: "400px", // Largeur maximale
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 10 };

  return (
    <Grid container style={{ height: "100vh", overflow: "hidden" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} style={{ overflowY: "auto", height: "100vh", padding: "10px" }}>
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              Inscription
            </Typography>
          </Grid>

          <form onSubmit={onSubmitForm}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Nom <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  label={
                    <span>
                      Prénom <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  placeholder="Entrez votre prénom"
                  margin="normal"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <span>
                      Email <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  label={
                    <span>
                      Mot de passe <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  label={
                    <span>
                      Confirmer le mot de passe <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  J'accepte les conditions d'utilisation <span style={{ color: "red" }}>*</span>
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