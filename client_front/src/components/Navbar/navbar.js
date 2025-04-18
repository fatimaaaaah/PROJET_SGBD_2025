import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Avatar, 
  Divider,
  Badge
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notificationCount] = useState(3); // Exemple: 3 notifications non lues

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const menuItems = [
    { text: 'Accueil', link: '/home', icon: <HomeOutlinedIcon /> },
    { text: 'Sujets', link: '/sujets', icon: <MenuBookOutlinedIcon /> },
    { text: 'Modèles de corrections', link: '/corrections', icon: <AssignmentOutlinedIcon /> },
    { text: 'Mon Profil', link: '/profil', icon: <AccountCircleOutlinedIcon /> },
    { text: 'Paramètres', link: '/settings', icon: <SettingsOutlinedIcon /> },
  ];

  const bottomMenuItems = [
    { text: 'Manuel Utilisateur', link: '/manuel', icon: <HelpOutlineOutlinedIcon /> },
    { text: 'Se Déconnecter', link: '/login', icon: <ExitToAppOutlinedIcon />, action: logout },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        style={{ 
          backgroundColor: darkMode ? '#121212' : '#1976d2',
          height: '60px',
          width: 'calc(100% - 40px)',
          margin: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Toolbar style={{ minHeight: '60px', padding: '0 16px' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon style={{ fontSize: '1.4rem' }} />
          </IconButton>
          
          <Typography 
            variant="h6" 
            style={{ 
              flexGrow: 1, 
              fontSize: '1.1rem',
              fontWeight: 500,
              marginLeft: '10px',
              color: darkMode ? '#ffffff' : '#ffffff'
            }}
          >
            {user ? `Bienvenue ${user.firstName} ${user.lastName}` : 'Bienvenue'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode}
              aria-label="toggle dark mode"
            >
              {darkMode ? (
                <Brightness7OutlinedIcon style={{ fontSize: '1.4rem', color: '#ffeb3b' }} />
              ) : (
                <Brightness4OutlinedIcon style={{ fontSize: '1.4rem' }} />
              )}
            </IconButton>
            
            <IconButton 
              color="inherit"
              onClick={handleNotificationClick}
              aria-label="notifications"
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsActiveOutlinedIcon style={{ fontSize: '1.4rem' }} />
              </Badge>
            </IconButton>
            
            {user && (
              <Avatar 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                style={{ 
                  width: '36px', 
                  height: '36px',
                  margin: 'auto 0',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/profil')}
              >
                {!user.avatar && user.firstName?.charAt(0)}
              </Avatar>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ 
          style: { 
            width: '260px', 
            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
            transition: 'background-color 0.3s ease',
          } 
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 16px',
            backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Avatar
            alt={user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
            src={user?.avatar}
            style={{ 
              width: '80px', 
              height: '80px',
              marginBottom: '12px',
              border: `3px solid ${darkMode ? '#90caf9' : '#1976d2'}`,
              fontSize: '32px'
            }}
          >
            {user && !user.avatar && `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
          </Avatar>
          <Typography
            variant="h6"
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: darkMode ? '#ffffff' : '#1976d2',
              textAlign: 'center'
            }}
          >
            {user ? `${user.firstName} ${user.lastName}` : 'Invité'}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: darkMode ? '#b0b0b0' : '#666',
              fontSize: '0.8rem',
              textAlign: 'center',
              marginTop: '4px'
            }}
          >
            {user?.email || 'Non connecté'}
          </Typography>
        </Box>

        <List style={{ padding: '8px' }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.link}
              onClick={toggleDrawer(false)}
              style={{
                backgroundColor: location.pathname === item.link 
                  ? (darkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)') 
                  : 'transparent',
                color: location.pathname === item.link 
                  ? (darkMode ? '#90caf9' : '#1976d2') 
                  : (darkMode ? '#e0e0e0' : '#555'),
                borderLeft: location.pathname === item.link 
                  ? `3px solid ${darkMode ? '#90caf9' : '#1976d2'}` 
                  : 'none',
                borderRadius: '0 4px 4px 0',
                margin: '4px 8px',
                padding: '8px 12px',
              }}
            >
              <IconButton 
                style={{ 
                  color: location.pathname === item.link 
                    ? (darkMode ? '#90caf9' : '#1976d2') 
                    : (darkMode ? '#e0e0e0' : '#555'),
                  padding: '4px',
                  marginRight: '8px',
                }}
              >
                {React.cloneElement(item.icon, {
                  style: {
                    fontSize: '1.2rem',
                    opacity: location.pathname === item.link ? 1 : 0.8
                  }
                })}
              </IconButton>
              <ListItemText
                primary={item.text}
                style={{
                  marginLeft: '4px',
                  fontSize: '0.85rem',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider style={{ 
          margin: '8px 16px', 
          backgroundColor: darkMode ? '#424242' : '#eee' 
        }} />

        <List style={{ padding: '8px', marginBottom: '12px' }}>
          {bottomMenuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.link}
              onClick={(e) => {
                toggleDrawer(false)();
                if (item.action) {
                  e.preventDefault();
                  item.action();
                }
              }}
              style={{
                color: darkMode ? '#e0e0e0' : '#555',
              }}
            >
              <IconButton 
                style={{ 
                  color: darkMode ? '#e0e0e0' : '#555',
                  padding: '4px',
                  marginRight: '8px',
                }}
              >
                {React.cloneElement(item.icon, {
                  style: {
                    fontSize: '1.2rem',
                    opacity: 0.8
                  }
                })}
              </IconButton>
              <ListItemText 
                primary={item.text} 
                style={{ 
                  marginLeft: '4px',
                  fontSize: '0.85rem'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;