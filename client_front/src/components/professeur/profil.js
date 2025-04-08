// src/components/Profil/Profil.js
import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Avatar, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Profil = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Veuillez vous connecter pour voir votre profil</Typography>
        <Link to="/login">Se connecter</Link>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 100, height: 100, fontSize: 40 }}
          >
            {!user.avatar && `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
          </Avatar>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem>
            <ListItemText primary="Prénom" secondary={user.firstName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Nom" secondary={user.lastName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          {/* Ajoutez d'autres informations utilisateur si nécessaire */}
        </List>
      </Paper>
    </Box>
  );
};

export default Profil;