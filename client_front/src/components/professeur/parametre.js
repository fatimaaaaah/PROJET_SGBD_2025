import React from 'react';
import { Typography, Switch, FormControlLabel, Button } from '@mui/material';

function Settings() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>
      <FormControlLabel control={<Switch />} label="Activer les notifications" />
      <FormControlLabel control={<Switch />} label="Mode sombre" />
      <Button variant="contained" color="primary">
        Sauvegarder
      </Button>
    </div>
  );
}

export default Settings;