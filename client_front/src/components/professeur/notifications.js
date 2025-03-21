import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

function Notifications() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Nouveau sujet déposé" secondary="2023-10-01" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Copie en attente de correction" secondary="2023-10-02" />
        </ListItem>
      </List>
    </div>
  );
}

export default Notifications;