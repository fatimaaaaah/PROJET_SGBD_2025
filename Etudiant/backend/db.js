const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ou ton nom d’utilisateur MySQL
    password: '', // ton mot de passe
    database: 'ELearning' // le nom exact de ta base
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err.message);
    } else {
        console.log('Connecté à la base de données MySQL ✅');
    }
});

module.exports = db;