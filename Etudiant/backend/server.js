const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elearning'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err);
        return;
    }
    console.log('✅ Connecté à la base de données MySQL');
});

app.use(cors());
app.use(express.json());

// Configuration de multer pour la gestion des fichiers PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 🔹 Récupérer tous les sujets
app.get('/api/sujets', (req, res) => {
    const query = 'SELECT * FROM sujet';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur.' });
        return res.json(results);
    });
});

// 🔹 Soumettre une réponse
app.post('/api/reponses', upload.single('fichier_pdf'), (req, res) => {
    const { id_utilisateur, id_sujet } = req.body;
    const fichier_pdf = req.file ? req.file.filename : null;

    if (!id_utilisateur || !id_sujet || !fichier_pdf) {
        return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const query = 'INSERT INTO reponse (id_utilisateur, id_sujet, fichier_pdf) VALUES (?, ?, ?)';
    db.query(query, [id_utilisateur, id_sujet, fichier_pdf], (err) => {
        if (err) return res.status(500).json({ message: 'Erreur lors de la soumission.' });
        return res.status(201).json({ message: 'Réponse soumise avec succès.' });
    });
});

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});