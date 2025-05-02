import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Grid, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Divider, Avatar, Box, TextField, Select, MenuItem, InputLabel, FormControl, InputAdornment } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // Pour les graphiques
import EventIcon from '@mui/icons-material/Event'; // Icône pour les filtres de date
import SearchIcon from '@mui/icons-material/Search'; // Icône pour la barre de recherche
import EditIcon from '@mui/icons-material/Edit'; // Icône pour modifier
import DeleteIcon from '@mui/icons-material/Delete'; // Icône pour supprimer
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icône pour voir
import Navbar from '../Navbar/navbar';



const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Données pour les graphiques
  const performanceData = [
    { name: 'Lundi', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Mardi', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mercredi', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Jeudi', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Vendredi', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Samedi', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Dimanche', uv: 3490, pv: 4300, amt: 2100 },
  ];

  // Données pour le diagramme en anneau (statut des corrections)
  const statusData = [
    { name: 'Corrigé', value: 75 },
    { name: 'En attente', value: 15 },
    { name: 'Pas encore corrigé', value: 10 },
  ];

  // Couleurs pour le diagramme en anneau
  const COLORS = ['#1976d2', '#82ca9d', '#ff8042'];

  // Données pour le diagramme en barres (notes des étudiants)
  const studentGradesData = [
    { name: '10/20', students: 5 },
    { name: '12/20', students: 10 },
    { name: '14/20', students: 15 },
    { name: '16/20', students: 20 },
    { name: '18/20', students: 25 },
  ];

  // Données pour le tableau des dernières soumissions
  const submissionsData = [
    { student: 'Jean Dupont', subject: 'Requêtes SQL', date: '2023-10-01', status: 'Corrigé', grade: '15/20' },
    { student: 'Marie Curie', subject: 'Algorithmes', date: '2023-10-02', status: 'En attente', grade: '12/20' },
    { student: 'Pierre Durand', subject: 'Base de données', date: '2023-10-03', status: 'Pas encore corrigé', grade: '10/20' },
    { student: 'Sophie Martin', subject: 'Réseaux', date: '2023-10-04', status: 'Corrigé', grade: '18/20' },
    { student: 'Lucie Bernard', subject: 'Sécurité', date: '2023-10-05', status: 'En attente', grade: '14/20' },
  ];

  // Couleurs pour les statuts
  const statusColors = {
    'Corrigé': '#1976d2',
    'En attente': '#82ca9d',
    'Pas encore corrigé': '#ff8042',
  };

  // Couleurs pour les notes
  const gradeColors = (grade) => {
    const note = parseInt(grade.split('/')[0], 10);
    if (note < 10) return '#ff0000'; // Rouge pour les notes inférieures à 10
    if (note < 14) return '#ffa500'; // Orange pour les notes entre 10 et 14
    return '#008000'; // Vert pour les notes supérieures ou égales à 14
  };

  return (
    <div style={{ padding: '20px', backgroundColor: darkMode ? '#121212' : '#fff', color: darkMode ? '#fff' : '#000', marginTop: '80px' }}>
      <Navbar/>
      {/* Cartes de Statistiques */}
      <Grid container spacing={15}> {/* Increased the spacing here */}
  <Grid item xs={3}>
    <Card style={{ border: '1px solid #1976d2', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon style={{ marginRight: '10px' }} />
          Sujets déposés
        </Typography>
        <Typography variant="h3" style={{ fontSize: '2rem' }}>15</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={3}>
    <Card style={{ border: '1px solid #1976d2', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
          <DashboardIcon style={{ marginRight: '10px' }} />
          Copies corrigées
        </Typography>
        <Typography variant="h3" style={{ fontSize: '2rem' }}>120</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={3}>
    <Card style={{ border: '1px solid #1976d2', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
          <SettingsIcon style={{ marginRight: '10px' }} />
          Taux de réussite
        </Typography>
        <Typography variant="h3" style={{ fontSize: '2rem' }}>75%</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={3}>
    <Card style={{ border: '1px solid #1976d2', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
          <AccountCircleIcon style={{ marginRight: '10px' }} />
          Étudiants actifs
        </Typography>
        <Typography variant="h3" style={{ fontSize: '2rem' }}>50</Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

{/* Graphiques de visualisation des performances */}
<Typography variant="h5" style={{ marginTop: '40px', fontSize: '1.5rem' }}>
  Visualisation des performances
</Typography>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={performanceData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="pv" fill="#1976d2" name="Performances" />
    <Bar dataKey="uv" fill="#82ca9d" name="Autre métrique" />
  </BarChart>
</ResponsiveContainer>

{/* Deux graphiques côte à côte */}
<Grid container spacing={15} style={{ marginTop: '30px' }}> {/* Increased the spacing here */}
  <Grid item xs={10}>
    <Typography variant="h6" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
      Nombre d'étudiants par note
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={studentGradesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="students" fill="#1976d2" name="Nombre d'étudiants" />
      </BarChart>
    </ResponsiveContainer>
  </Grid>
  <Grid item xs={6}>
    <Typography variant="h6" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
      Statut des corrections
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Grid>
</Grid>


     
      {/* Filtres pour les dernières soumissions */}
    <Box style={{ marginTop: '40px', marginBottom: '20px' }}>
  


  {/* Filtres supplémentaires */}
  <Box
  style={{
    display: 'flex',
    alignItems: 'center', // Aligner verticalement les éléments
    gap: '20px', // Espacement entre les éléments
    marginBottom: '20px', // Marge en bas
  }}
>
  {/* Titre "Dernières Soumissions" */}
  <Typography variant="h5" style={{ fontSize: '1.5rem', whiteSpace: 'nowrap' }}>
    Dernières Soumissions
  </Typography>

  {/* Barre de recherche avec bouton intégré */}
  <TextField
    label="Rechercher un étudiant"
    variant="outlined"
    size="small"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon style={{ color: '#1976d2' }} />
        </InputAdornment>
      ),
    }}
    style={{ width: '250px' }} // Ajustez la largeur ici
  />

  {/* Bouton "Rechercher" */}
  <Button
    variant="contained"
    color="primary"
    startIcon={<SearchIcon />}
    onClick={() => {
      console.log('Recherche lancée:', searchQuery);
    }}
    style={{ height: '40px' }} // Ajustez la hauteur ici
  >
    Rechercher
  </Button>

  {/* Filtres supplémentaires */}
  <FormControl variant="outlined" size="small" style={{ minWidth: '150px' }}>
    <InputLabel>Statut</InputLabel>
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      label="Statut"
    >
      <MenuItem value="">Tous</MenuItem>
      <MenuItem value="Corrigé">Corrigé</MenuItem>
      <MenuItem value="En attente">En attente</MenuItem>
      <MenuItem value="Pas encore corrigé">Pas encore corrigé</MenuItem>
    </Select>
  </FormControl>

  <TextField
    label="Date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    variant="outlined"
    size="small"
  />

  <FormControl variant="outlined" size="small" style={{ minWidth: '150px' }}>
    <InputLabel>Note</InputLabel>
    <Select
      value={gradeFilter}
      onChange={(e) => setGradeFilter(e.target.value)}
      label="Note"
    >
      <MenuItem value="">Toutes</MenuItem>
      <MenuItem value="10">10/20</MenuItem>
      <MenuItem value="12">12/20</MenuItem>
      <MenuItem value="14">14/20</MenuItem>
      <MenuItem value="16">16/20</MenuItem>
      <MenuItem value="18">18/20</MenuItem>
    </Select>
  </FormControl>
</Box>
</Box>

{/* Tableau des dernières soumissions */}
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontSize: '1rem' }}>Étudiant</TableCell>
        <TableCell style={{ fontSize: '1rem' }}>Sujet</TableCell>
        <TableCell style={{ fontSize: '1rem' }}>Date</TableCell>
        <TableCell style={{ fontSize: '1rem' }}>Statut</TableCell>
        <TableCell style={{ fontSize: '1rem' }}>Note</TableCell>
        <TableCell style={{ fontSize: '1rem' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {submissionsData.map((row, index) => (
        <TableRow key={index}>
          <TableCell style={{ fontSize: '1rem' }}>{row.student}</TableCell>
          <TableCell style={{ fontSize: '1rem' }}>{row.subject}</TableCell>
          <TableCell style={{ fontSize: '1rem' }}>{row.date}</TableCell>
          <TableCell>
            <Box
              style={{
                backgroundColor: statusColors[row.status],
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              {row.status}
            </Box>
          </TableCell>
          <TableCell style={{ fontSize: '1rem', color: gradeColors(row.grade) }}>
            {row.grade}
          </TableCell>
          <TableCell>
            <IconButton style={{ fontSize: '1rem', color: '#000' }}>
              <VisibilityIcon />
            </IconButton>
            <IconButton style={{ fontSize: '1rem', color: '#000' }}>
              <EditIcon />
            </IconButton>
            <IconButton style={{ fontSize: '1rem', color: '#000' }}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    </div>
  );
}

export default Home;