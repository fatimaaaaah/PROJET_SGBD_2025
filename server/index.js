const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

// MIDDLEWARE
app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON

// ROUTES

// Route pour la connexion
app.post("/login", async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await pool.query(
            "SELECT * FROM professeur WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Aucun utilisateur trouvé avec cet email." });
        }

        // Vérifier si le mot de passe est correct
        const isValidPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);

        if (!isValidPassword) {
            return res.status(400).json({ error: "Mot de passe incorrect.Veuillez réessayer." });
        }

        // Si tout est bon, renvoyer les informations de l'utilisateur (sans le mot de passe)
        const userInfo = { ...user.rows[0] };
        delete userInfo.mot_de_passe; // Ne pas renvoyer le mot de passe
        res.json(userInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Une erreur s'est produite lors de la connexion. Veuillez réessayer." });
    }
});

// Créer un professeur
app.post("/professeurs", async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe } = req.body;

        // Vérifier si l'email existe déjà
        const emailExists = await pool.query(
            "SELECT * FROM professeur WHERE email = $1",
            [email]
        );

        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: "Cet email est déjà utilisé. Veuillez utiliser une autre adresse email." });
        }

        // Vérifier si un utilisateur avec le même nom et prénom existe déjà
        const userExists = await pool.query(
            "SELECT * FROM professeur WHERE nom = $1 AND prenom = $2",
            [nom, prenom]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Un utilisateur avec ce nom et prénom existe déjà. Veuillez vérifier vos informations." });
        }

        // Si tout est bon, hacher le mot de passe et insérer le nouvel utilisateur
        const saltRounds = 10;
        const motDePasseHache = await bcrypt.hash(mot_de_passe, saltRounds);
        const newProfesseur = await pool.query(
            "INSERT INTO professeur (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING *",
            [nom, prenom, email, motDePasseHache]
        );

        res.json(newProfesseur.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard." });
    }
});

// Afficher tous les professeurs
app.get("/professeurs", async (req, res) => {
    try {
        const allProfesseurs = await pool.query("SELECT * FROM professeur");
        res.json(allProfesseurs.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Afficher un professeur
app.get("/professeurs/:idProf", async (req, res) => {
    try {
        const { idProf } = req.params;
        const professeur = await pool.query("SELECT * FROM professeur WHERE idProf = $1", [idProf]);
        res.json(professeur.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Modifier un professeur
app.put("/professeurs/:idProf", async (req, res) => {
    try {
        const { idProf } = req.params;
        const { nom, prenom, email, mot_de_passe } = req.body;
        const updateProfesseur = await pool.query(
            "UPDATE professeur SET nom = $1, prenom = $2, email = $3, mot_de_passe = $4 WHERE idProf = $5 RETURNING *",
            [nom, prenom, email, mot_de_passe, idProf]
        );
        res.json("Mise à jour réussie");
    } catch (err) {
        console.error(err.message);
    }
});

// Supprimer un professeur
app.delete("/professeurs/:idProf", async (req, res) => {
    try {
        const { idProf } = req.params;
        const deleteProfesseur = await pool.query("DELETE FROM professeur WHERE idProf = $1", [idProf]);
        res.json("Professeur supprimé");
    } catch (err) {
        console.error(err.message);
    }
});

// Créer un étudiant
app.post("/etudiants", async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, idClasse_E } = req.body;
        const saltRounds = 10;
        const motDePasseHache = await bcrypt.hash(mot_de_passe, saltRounds);
        const newEtudiant = await pool.query(
            "INSERT INTO etudiant (nom, prenom, email, mot_de_passe, idClasse_E) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nom, prenom, email, motDePasseHache, idClasse_E]
        );
        res.json(newEtudiant.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Afficher tous les étudiants
app.get("/etudiants", async (req, res) => {
    try {
        const allEtudiants = await pool.query("SELECT * FROM etudiant");
        res.json(allEtudiants.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Afficher un étudiant
app.get("/etudiants/:idEtu", async (req, res) => {
    try {
        const { idEtu } = req.params;
        const etudiant = await pool.query("SELECT * FROM etudiant WHERE idEtu = $1", [idEtu]);
        res.json(etudiant.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Modifier un étudiant
app.put("/etudiants/:idEtu", async (req, res) => {
    try {
        const { idEtu } = req.params;
        const { nom, prenom, email, mot_de_passe, idClasse_E } = req.body;
        const updateEtudiant = await pool.query(
            "UPDATE etudiant SET nom = $1, prenom = $2, email = $3, mot_de_passe = $4, idClasse_E = $5 WHERE idEtu = $6 RETURNING *",
            [nom, prenom, email, mot_de_passe, idClasse_E, idEtu]
        );
        res.json("Mise à jour réussie");
    } catch (err) {
        console.error(err.message);
    }
});

// Supprimer un étudiant
app.delete("/etudiants/:idEtu", async (req, res) => {
    try {
        const { idEtu } = req.params;
        const deleteEtudiant = await pool.query("DELETE FROM etudiant WHERE idEtu = $1", [idEtu]);
        res.json("Étudiant supprimé");
    } catch (err) {
        console.error(err.message);
    }
});

// Créer une classe
app.post("/classes", async (req, res) => {
    try {
        const { nom } = req.body;
        const newClasse = await pool.query(
            "INSERT INTO classe (nom) VALUES ($1) RETURNING *",
            [nom]
        );
        res.json(newClasse.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Afficher toutes les classes
app.get("/classes", async (req, res) => {
    try {
        const allClasses = await pool.query("SELECT * FROM classe");
        res.json(allClasses.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Afficher une classe
app.get("/classes/:idClasse", async (req, res) => {
    try {
        const { idClasse } = req.params;
        const classe = await pool.query("SELECT * FROM classe WHERE idClasse = $1", [idClasse]);
        res.json(classe.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Modifier une classe
app.put("/classes/:idClasse", async (req, res) => {
    try {
        const { idClasse } = req.params;
        const { nom } = req.body;
        const updateClasse = await pool.query(
            "UPDATE classe SET nom = $1 WHERE idClasse = $2 RETURNING *",
            [nom, idClasse]
        );
        res.json("Mise à jour réussie");
    } catch (err) {
        console.error(err.message);
    }
});

// Supprimer une classe
app.delete("/classes/:idClasse", async (req, res) => {
    try {
        const { idClasse } = req.params;
        const deleteClasse = await pool.query("DELETE FROM classe WHERE idClasse = $1", [idClasse]);
        res.json("Classe supprimée");
    } catch (err) {
        console.error(err.message);
    }
});

// Démarrer le serveur
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


///GOOGLE 

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("608829330179-fjkmteld0kvu5fi3dmks192cia6mlt9i.apps.googleusercontent.com");

// Route pour la connexion Google
app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "608829330179-fjkmteld0kvu5fi3dmks192cia6mlt9i.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await pool.query("SELECT * FROM professeur WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      // Créer un nouveau compte s'il n'existe pas
      const newUser = await pool.query(
        "INSERT INTO professeur (nom, prenom, email) VALUES ($1, $2, $3) RETURNING *",
        [name.split(" ")[0], name.split(" ")[1] || "", email]
      );
      return res.status(201).json({ success: true, user: newUser.rows[0] });
    }

    // Connecter l'utilisateur existant
    res.status(200).json({ success: true, user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la vérification du token Google" });
  }
});
