import React from 'react';
import { Typography, TextField, Button } from '@mui/material';

function Subjects() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dépôt de Sujets d'Examen
      </Typography>
      <TextField label="Titre du sujet" fullWidth margin="normal" />
      <TextField label="Description" fullWidth multiline rows={4} margin="normal" />
      <Button variant="contained" component="label">
        Téléverser le fichier PDF
        <input type="file" hidden />
      </Button>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Déposer
      </Button>
    </div>
  );
}

export default Subjects;