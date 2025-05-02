import React, { useState } from 'react';
import {
  Box, Typography, Avatar, Paper, Divider, List, ListItem, ListItemIcon,
  ListItemText, Button, Chip, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Stack
} from '@mui/material';
import {
  Email, School, Work, CalendarToday, Description, Group, Assessment,
  Edit, LockReset, VerifiedUser, ContactMail, PhotoCamera
} from '@mui/icons-material';
import Navbar from '../Navbar/navbar';
import im2 from '../image/gallery/im2.jpg';
import im3 from '../image/gallery/im3.jpg';
import im4 from '../image/gallery/im4.jpg';
import im5 from '../image/gallery/im5.jpg';
import im1 from '../image/gallery/images.jpg';
import im6 from '../image/gallery/images1.png';

const galleryImages = [im2, im3, im4, im5, im1, im6];


const Profil = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [preview, setPreview] = useState('');

  const professorData = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@univ-example.fr",
    avatar: avatar,
    department: "Informatique",
    position: "Professeur Associé",
    joinDate: "15/09/2018",
    courses: ["Base de Données Avancées", "SQL pour Débutants"],
    studentsCount: 142,
    examsCreated: 28,
    averageRating: 4.7
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setAvatar(url);
    setPreview('');
    setAvatarDialogOpen(false);
  };

  const handleSelectFromGallery = (img) => {
    setAvatar(img);
    setPreview('');
    setAvatarDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Navbar />
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mr: { md: 3 }, mb: { xs: 2, md: 0 } }}>
            <Avatar
              src={professorData.avatar}
              sx={{ width: 120, height: 120, fontSize: 48, bgcolor: 'primary.main' }}
            >
              {!professorData.avatar &&
                `${professorData.firstName?.charAt(0)}${professorData.lastName?.charAt(0)}`}
            </Avatar>
            <IconButton
              sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white' }}
              onClick={() => setAvatarDialogOpen(true)}
            >
              <PhotoCamera />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {professorData.firstName} {professorData.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <Work sx={{ verticalAlign: 'middle', mr: 1 }} />
              {professorData.position} - {professorData.department}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Chip icon={<Group />} label={`${professorData.studentsCount} étudiants`} variant="outlined" sx={{ mr: 1, mb: 1 }} />
              <Chip icon={<Description />} label={`${professorData.examsCreated} examens`} variant="outlined" sx={{ mr: 1, mb: 1 }} />
              <Chip icon={<Assessment />} label={`Note moyenne: ${professorData.averageRating}/5`} color="primary" sx={{ mb: 1 }} />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ContactMail sx={{ mr: 1 }} /> Informations Personnelles
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Email color="primary" /></ListItemIcon>
                <ListItemText primary="Email" secondary={professorData.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
                <ListItemText primary="Membre depuis" secondary={professorData.joinDate} />
              </ListItem>
              <ListItem>
                <ListItemIcon><VerifiedUser color="primary" /></ListItemIcon>
                <ListItemText primary="Statut" secondary="Vérifié" />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1 }} /> Cours Enseignés
            </Typography>
            <List dense>
              {professorData.courses.map((course, index) => (
                <ListItem key={index}>
                  <ListItemIcon><Description color="primary" /></ListItemIcon>
                  <ListItemText primary={course} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<Edit />} onClick={() => setEditOpen(true)} sx={{ mr: 2 }}>
            Modifier le profil
          </Button>
          <Button variant="outlined" startIcon={<LockReset />} onClick={() => setPasswordOpen(true)}>
            Changer mot de passe
          </Button>
        </Box>
      </Paper>

      {/* Boîte de dialogue Modifier Profil */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier le profil</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Nom" margin="normal" defaultValue={professorData.lastName} />
          <TextField fullWidth label="Prénom" margin="normal" defaultValue={professorData.firstName} />
          <TextField fullWidth label="Département" margin="normal" defaultValue={professorData.department} />
          <TextField fullWidth label="Poste" margin="normal" defaultValue={professorData.position} />
          <TextField fullWidth label="Cours enseignés (séparés par des virgules)" margin="normal" defaultValue={professorData.courses.join(', ')} />
          <TextField fullWidth label="Email" margin="normal" defaultValue={professorData.email} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue Mot de Passe */}
      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Ancien mot de passe" margin="normal" type="password" />
          <TextField fullWidth label="Nouveau mot de passe" margin="normal" type="password" />
          <TextField fullWidth label="Confirmer le mot de passe" margin="normal" type="password" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordOpen(false)}>Annuler</Button>
          <Button variant="contained">Valider</Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue Avatar */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Changer la photo de profil</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Button variant="outlined" component="label">
              Importer une image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Typography variant="subtitle1">Ou choisissez une image :</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {galleryImages.map((img, index) => (
                <Avatar
                  key={index}
                  src={img}
                  sx={{ width: 64, height: 64, cursor: 'pointer', border: avatar === img ? '2px solid blue' : 'none' }}
                  onClick={() => handleSelectFromGallery(img)}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profil;
