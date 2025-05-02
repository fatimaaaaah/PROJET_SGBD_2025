// components/Navbar/AppBar.js
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../context/AuthContext';
function AppBar({ darkMode, toggleDarkMode, toggleDrawer }) {
  const { user, logout } = useAuth();
  return (
    <MuiAppBar position="fixed" style={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
          <MenuIcon style={{ fontSize: '2rem' }} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1, fontSize: '1.2rem' }}>
          Bienvenue {user.firstName} {user.lastName}
        </Typography>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7Icon style={{ fontSize: '2rem' }} /> : <Brightness4Icon style={{ fontSize: '2rem' }} />}
        </IconButton>
        <IconButton color="inherit">
          <NotificationsIcon style={{ fontSize: '2rem' }} />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircleIcon style={{ fontSize: '2rem' }} />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;