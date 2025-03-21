import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Plateforme d'Évaluation
        </Typography>
        <Button color="inherit" component={Link} to="/">Accueil</Button>
        <Button color="inherit" component={Link} to="/subjects">Sujets</Button>
        <Button color="inherit" component={Link} to="/corrections">Corrections</Button>
        <Button color="inherit" component={Link} to="/dashboard">Tableau de bord</Button>
        <Button color="inherit" component={Link} to="/notifications">Notifications</Button>
        <Button color="inherit" component={Link} to="/settings">Paramètres</Button>
        <Button color="inherit" component={Link} to="/profile">Profil</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;