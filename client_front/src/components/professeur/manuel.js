import React from 'react';
import { Typography } from '@mui/material';

function UserManual() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Manuel d'Utilisation
      </Typography>
      <Typography paragraph>
        Ce manuel explique comment utiliser la plateforme d'évaluation automatisée.
      </Typography>
      {/* Ajoutez plus de contenu ici */}
    </div>
  );
}

export default UserManual;