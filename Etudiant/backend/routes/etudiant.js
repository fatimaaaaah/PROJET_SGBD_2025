const express = require('express');
const router = express.Router();
const db = require('../db');

// Exemple : récupérer tous les étudiants
router.get('/', (req, res) => {
    db.query('SELECT * FROM Etudiant', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;