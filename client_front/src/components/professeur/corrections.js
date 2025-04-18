import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import Navbar from '../Navbar/navbar';
import ThemeSwitcher from '../../context/ThemeSwitcher ';
const Corrections = () =>  {
  return (
    <div style={{ padding: '20px' }}>
      <Navbar/>
      <ThemeSwitcher />
      <Typography variant="h4" gutterBottom>
        Corrections
      </Typography>
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

export default Corrections;