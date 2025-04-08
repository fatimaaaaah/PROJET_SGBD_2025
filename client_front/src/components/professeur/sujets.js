import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, MenuItem, Paper, Select, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Alert, IconButton, Chip, Stack
} from '@mui/material';
import { Delete, Edit, Add, Close, Upload, Schedule } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../Navbar/navbar'; 

const Sujets = () => {
  // États principaux
  const [cours, setCours] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // États pour les cours
  const [openCoursDialog, setOpenCoursDialog] = useState(false);
  const [currentCours, setCurrentCours] = useState({ nom: '', code: '' });
  const [actionType, setActionType] = useState('add');

  // États pour les sujets
  const [openSujetDialog, setOpenSujetDialog] = useState(false);
  const [currentSujet, setCurrentSujet] = useState({
    titre: '',
    description: '',
    type_sujet: '',
    date_fin: new Date(),
    heure_depot: '23:59',
    fichier_pdf: null,
    fileName: ''
  });
  const [selectedCoursId, setSelectedCoursId] = useState(null);

  // Charger les cours au montage
  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    try {
      const response = await fetch('http://localhost:5000/cours');
      const data = await response.json();
      setCours(data);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des cours', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Gestion des cours
  const handleOpenCoursDialog = (cours = null) => {
    if (cours) {
      setCurrentCours(cours);
      setActionType('edit');
    } else {
      setCurrentCours({ nom: '', code: generateCode() });
      setActionType('add');
    }
    setOpenCoursDialog(true);
  };

  const generateCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  };

  const handleSaveCours = async () => {
    try {
      const url = actionType === 'add' 
        ? 'http://localhost:5000/cours' 
        : `http://localhost:5000/cours/${currentCours.idcours}`;
      
      const method = actionType === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCours)
      });

      if (!response.ok) throw new Error('Erreur');

      showSnackbar(`Cours ${actionType === 'add' ? 'ajouté' : 'modifié'} avec succès`, 'success');
      fetchCours();
      setOpenCoursDialog(false);
    } catch (error) {
      showSnackbar(`Erreur lors de ${actionType === 'add' ? "l'ajout" : "la modification"} du cours`, 'error');
    }
  };

  const handleDeleteCours = async (id) => {
    try {
      await fetch(`http://localhost:5000/cours/${id}`, { method: 'DELETE' });
      showSnackbar('Cours supprimé avec succès', 'success');
      fetchCours();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression du cours', 'error');
    }
  };

  // Gestion des sujets
  const handleOpenSujetDialog = (coursId, sujet = null) => {
    setSelectedCoursId(coursId);
    if (sujet) {
      setCurrentSujet({
        ...sujet,
        date_fin: new Date(sujet.date_fin),
        heure_depot: sujet.heure_depot || '23:59',
        fileName: sujet.fichier_pdf || ''
      });
      setActionType('edit');
    } else {
      setCurrentSujet({
        titre: '',
        description: '',
        type_sujet: '',
        date_fin: new Date(),
        heure_depot: '23:59',
        fichier_pdf: null,
        fileName: ''
      });
      setActionType('add');
    }
    setOpenSujetDialog(true);
  };

  const handleSaveSujet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Vous devez être connecté pour ajouter un sujet', 'error');
        return;
      }
  
      const formData = new FormData();
      formData.append('titre', currentSujet.titre);
      formData.append('description', currentSujet.description);
      formData.append('type_sujet', currentSujet.type_sujet);
      
      // Combiner date et heure
      const dateFin = new Date(currentSujet.date_fin);
      const [hours, minutes] = currentSujet.heure_depot.split(':');
      dateFin.setHours(parseInt(hours, 10));
      dateFin.setMinutes(parseInt(minutes, 10));
      
      formData.append('date_fin', dateFin.toISOString());
      
      if (currentSujet.fichier_pdf instanceof File) {
        formData.append('fichier_pdf', currentSujet.fichier_pdf);
      }
  
      const response = await fetch(
        actionType === 'add'
          ? `http://localhost:5000/cours/${selectedCoursId}/sujets`
          : `http://localhost:5000/sujets/${currentSujet.idsujet}`,
        {
          method: actionType === 'add' ? 'POST' : 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur inconnue');
      }
  
      showSnackbar(`Sujet ${actionType === 'add' ? 'ajouté' : 'modifié'} avec succès`, 'success');
      fetchCours();
      setOpenSujetDialog(false);
    } catch (error) {
      showSnackbar(error.message, 'error');
      console.error('Erreur:', error);
    }
  };

  const handleDeleteSujet = async (sujetId) => {
    try {
      await fetch(`http://localhost:5000/sujets/${sujetId}`, { method: 'DELETE' });
      showSnackbar('Sujet supprimé avec succès', 'success');
      fetchCours();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression du sujet', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentSujet({ 
        ...currentSujet, 
        fichier_pdf: file,
        fileName: file.name 
      });
    }
  };

  const handleTimeChange = (e) => {
    setCurrentSujet({ ...currentSujet, heure_depot: e.target.value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Navbar/>
      <Typography variant="h4" gutterBottom>
        Gestion des Cours et Sujets
      </Typography>

      {/* Boutons d'actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenCoursDialog()}
        >
          Ajouter un Cours
        </Button>
      </Box>

      {/* Liste des cours */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Sujets</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cours.map((c) => (
              <React.Fragment key={c.idcours}>
                <TableRow>
                  <TableCell>{c.nom}</TableCell>
                  <TableCell>
                    <Chip label={c.code} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      startIcon={<Add />}
                      onClick={() => handleOpenSujetDialog(c.idcours)}
                    >
                      Ajouter un sujet
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenCoursDialog(c)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCours(c.idcours)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                
                {/* Liste des sujets pour ce cours */}
                {c.sujets?.map((s) => {
                  const dateFin = new Date(s.date_fin);
                  return (
                    <TableRow key={s.idsujet}>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography>
                            <strong>{s.titre}</strong> 
                            <Chip 
                              label={s.type_sujet} 
                              size="small" 
                              sx={{ ml: 1 }} 
                              color={
                                s.type_sujet === 'CC' ? 'primary' : 
                                s.type_sujet === 'DS' ? 'secondary' : 'default'
                              }
                            />
                          </Typography>
                          <Typography variant="body2">{s.description}</Typography>
                          <Typography variant="caption">
                            Date limite: {dateFin.toLocaleDateString()} à {dateFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Typography>
                          {s.fichier_pdf && (
                            <Typography variant="caption" sx={{ mt: 1 }}>
                              Fichier: {s.fichier_pdf}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenSujetDialog(c.idcours, s)}>
                          <Edit color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteSujet(s.idsujet)}>
                          <Delete color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour les cours */}
      <Dialog open={openCoursDialog} onClose={() => setOpenCoursDialog(false)}>
        <DialogTitle>
          {actionType === 'add' ? 'Ajouter un Cours' : 'Modifier le Cours'}
          <IconButton 
            onClick={() => setOpenCoursDialog(false)} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Nom du cours"
            value={currentCours.nom}
            onChange={(e) => setCurrentCours({ ...currentCours, nom: e.target.value })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Code du cours"
            value={currentCours.code}
            InputProps={{ 
              readOnly: true,
              startAdornment: (
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Code généré:
                </Typography>
              )
            }}
            sx={{
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: 'primary.main'
              }
            }}
          />
          {actionType === 'add' && (
            <Typography variant="caption" color="text.secondary">
              Le code est généré automatiquement et ne peut pas être modifié.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoursDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveCours} variant="contained">
            {actionType === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour les sujets */}
      <Dialog open={openSujetDialog} onClose={() => setOpenSujetDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {actionType === 'add' ? 'Ajouter un Sujet' : 'Modifier le Sujet'}
          <IconButton 
            onClick={() => setOpenSujetDialog(false)} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Titre du sujet"
              value={currentSujet.titre}
              onChange={(e) => setCurrentSujet({ ...currentSujet, titre: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Type de sujet</InputLabel>
              <Select
                value={currentSujet.type_sujet}
                label="Type de sujet"
                onChange={(e) => setCurrentSujet({ ...currentSujet, type_sujet: e.target.value })}
              >
                <MenuItem value="CC">Contrôle Continu (CC)</MenuItem>
                <MenuItem value="TP">Travail Pratique (TP)</MenuItem>
                <MenuItem value="TD">Travail Dirigé (TD)</MenuItem>
                <MenuItem value="DS">Devoir Surveillé (DS)</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={currentSujet.description}
              onChange={(e) => setCurrentSujet({ ...currentSujet, description: e.target.value })}
            />
            
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: '50%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Date limite
                </Typography>
                <DatePicker
                  selected={currentSujet.date_fin}
                  onChange={(date) => setCurrentSujet({ ...currentSujet, date_fin: date })}
                  dateFormat="dd/MM/yyyy"
                  customInput={
                    <TextField fullWidth />
                  }
                />
              </Box>
              
              <Box sx={{ width: '50%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Heure limite
                </Typography>
                <TextField
                  type="time"
                  fullWidth
                  value={currentSujet.heure_depot}
                  onChange={handleTimeChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Box>
            </Stack>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Fichier PDF
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<Upload />}
                sx={{ mr: 2 }}
              >
                Sélectionner un fichier
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {currentSujet.fileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fichier sélectionné: {currentSujet.fileName}
                </Typography>
              )}
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Formats acceptés: PDF (taille max: 5MB)
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSujetDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleSaveSujet} 
            variant="contained"
            disabled={!currentSujet.titre || !currentSujet.type_sujet}
          >
            {actionType === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sujets;