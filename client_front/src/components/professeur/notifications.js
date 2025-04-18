import React, { useState } from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Collapse,
  IconButton,
  Paper,
  Divider,
  Box
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Feedback as FeedbackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import Navbar from '../Navbar/navbar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Notification = () => {
  const [expandedId, setExpandedId] = useState(null);

  const notifications = [
    {
      id: 1,
      title: "Nouveau sujet déposé",
      date: new Date(2023, 9, 1, 14, 30),
      icon: <AssignmentIcon color="primary" />,
      details: "L'étudiant Dupont Jean a déposé son projet de base de données. Veuillez le corriger avant le 15/10/2023.",
      type: 'info'
    },
    {
      id: 2,
      title: "Copie en attente de correction",
      date: new Date(2023, 9, 2, 9, 15),
      icon: <FeedbackIcon color="secondary" />,
      details: "Vous avez 5 copies en attente de correction pour le cours 'Systèmes de gestion de base de données'.",
      type: 'warning'
    },
    {
      id: 3,
      title: "Correction validée",
      date: new Date(2023, 9, 3, 16, 45),
      icon: <CheckCircleIcon style={{ color: '#4caf50' }} />,
      details: "Votre correction du TP n°3 a été validée.Veuillez vérifier les notes de votre modéle",
      type: 'success'
    }
  ];

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon style={{ color: '#4caf50' }} />;
      default:
        return <NotificationsIcon color="info" />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar/>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsIcon fontSize="large" />
        Notifications
      </Typography>
      
      <Paper elevation={3} sx={{ marginTop: 2 }}>
        <List>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem>
                <ListItemIcon>
                  {notification.icon || getTypeIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={format(notification.date, "PPpp", { locale: fr })}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
                <IconButton onClick={() => handleExpand(notification.id)}>
                  {expandedId === notification.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              
              <Collapse in={expandedId === notification.id} timeout="auto" unmountOnExit>
                <Box sx={{ padding: '0 16px 16px 72px', color: 'text.secondary' }}>
                  <Typography variant="body2">{notification.details}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      {format(notification.date, "PPPP", { locale: fr })}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
              
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </div>
  );
}

export default Notification;