import React from 'react';
import { Typography, TextField, Button } from '@mui/material';

function Profile() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Profil
      </Typography>
      <TextField label="Nom" fullWidth margin="normal" />
      <TextField label="Email" fullWidth margin="normal" />
      <Button variant="contained" color="primary">
        Sauvegarder
      </Button>
    </div>
  );
}

export default Profile;