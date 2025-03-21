import React from 'react';
import { Typography, Grid, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';


const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue, Professeur Dupont
      </Typography>

      {/* Cartes de Statistiques */}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Sujets déposés</Typography>
              <Typography variant="h3">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Copies corrigées</Typography>
              <Typography variant="h3">120</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Taux de réussite</Typography>
              <Typography variant="h3">75%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Étudiants actifs</Typography>
              <Typography variant="h3">50</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dernières Soumissions */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Dernières Soumissions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Sujet</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Jean Dupont</TableCell>
              <TableCell>Requêtes SQL</TableCell>
              <TableCell>2023-10-01</TableCell>
              <TableCell>Corrigé</TableCell>
              <TableCell>15/20</TableCell>
              <TableCell>
                <Button color="primary">Voir</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Home;