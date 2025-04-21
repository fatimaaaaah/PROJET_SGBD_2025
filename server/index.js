require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// MIDDLEWARE
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // autoriser spécifiquement votre frontend
  credentials: true // autoriser les credentials
}));

app.use(express.json()); // Pour parser les requêtes JSON
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Pour les navigateurs legacy
};

app.use(cors(corsOptions));

// Gérer explicitement les requêtes OPTIONS pour le preflight
app.options('*', cors(corsOptions));


//Stockage information utilisateur
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');


// Fonction de normalisation
const normalizeUser = (userData, authMethod) => {
  let firstName, lastName;

  switch(authMethod) {
    case 'local':
      [firstName, lastName] = userData.fullname.split(' ');
      break;
    case 'google':
      firstName = userData.given_name;
      lastName = userData.family_name;
      break;
    case 'microsoft':
      firstName = userData.givenName;
      lastName = userData.surname;
      break;
    case 'github':
      const names = userData.name?.split(' ') || [userData.login, ''];
      [firstName, lastName] = [names[0], names.slice(1).join(' ')];
      break;
  }

  return {
    id: userData.id || userData.sub || userData.githubId,
    email: userData.email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    authMethod,
    avatar: userData.picture || userData.avatar_url
  };
};

// Routes d'authentification
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

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }

    // Créer le token JWT
    const userData = { 
      id: user.rows[0].idprof,
      email: user.rows[0].email,
      nom: user.rows[0].nom,
      prenom: user.rows[0].prenom
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Envoyer la réponse
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 heure
    });

    res.json({
      success: true,
      user: userData,
      token: token // Envoyer aussi le token dans le body si nécessaire
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur serveur" });
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
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route pour la connexion Google
app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token manquant" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log("Informations Google:", payload); // Debug

    // Vérifier si l'utilisateur existe déjà
    let user = await pool.query(
      "SELECT * FROM professeur WHERE email = $1", 
      [payload.email]
    );

    // Si nouvel utilisateur
    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO professeur 
         (nom, prenom, email, auth_provider, avatar) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          payload.family_name,
          payload.given_name,
          payload.email,
          'google',
          payload.picture
        ]
      );
    }

    // Créer le token JWT
    const userData = {
      id: user.rows[0].idprof,
      email: user.rows[0].email,
      nom: user.rows[0].nom,
      prenom: user.rows[0].prenom,
      authMethod: 'google'
    };
    
    const jwtToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      user: userData,
      token: jwtToken
    });

  } catch (error) {
    console.error("Erreur Google Login:", error);
    res.status(500).json({ error: "Échec de l'authentification Google" });
  }
});

// Route pour la connexion Google
// GITHUB
// Configuration GitHub
const githubConfig = {
  clientId: "Ov23liXiPg89uvMwvlMY",
  clientSecret: "b3c4ea7ccd79fb9d854db53da218486dffa8c6d2"
};

// Route pour la connexion GitHub
app.post("/github-login", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code manquant." });
  }

  try {
    // Échanger le code contre un token d'accès
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: githubConfig.clientId,
        client_secret: githubConfig.clientSecret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Obtenir les infos utilisateur
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const { login, name, email } = userResponse.data;
    const [firstName, lastName] = name ? name.split(' ') : [login, ''];

    // Vérifier si l'utilisateur existe déjà
    const user = await pool.query("SELECT * FROM professeur WHERE email = $1", [email || `${login}@github.com`]);

    if (user.rows.length === 0) {
      // Créer un nouvel utilisateur
      const newUser = await pool.query(
        "INSERT INTO professeur (nom, prenom, email, auth_provider) VALUES ($1, $2, $3, $4) RETURNING *",
        [lastName || login, firstName || login, email || `${login}@github.com`, "github"]
      );
      return res.status(201).json({ success: true, user: newUser.rows[0] });
    }

    // Connecter l'utilisateur existant
    res.status(200).json({ success: true, user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la vérification du code GitHub" });
  }
});

// MICROSOFT
// const { Client } = require('@microsoft/microsoft-graph-client');
// const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
// const { ClientSecretCredential } = require('@azure/identity');

// // Configuration Microsoft
// const microsoftConfig = {
//   clientId: "VOTRE_CLIENT_ID_MICROSOFT",
//   tenantId: "VOTRE_TENANT_ID",
//   clientSecret: "VOTRE_CLIENT_SECRET"
// };

// Route pour la connexion Microsoft
app.post("/microsoft-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token manquant." });
  }

  try {
    const credential = new ClientSecretCredential(
      microsoftConfig.tenantId,
      microsoftConfig.clientId,
      microsoftConfig.clientSecret
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });

    const client = Client.initWithMiddleware({
      authProvider
    });

    // Vérifier le token et obtenir les infos utilisateur
    const userInfo = await client.api('/me').get();
    const { mail, givenName, surname } = userInfo;

    // Vérifier si l'utilisateur existe déjà
    const user = await pool.query("SELECT * FROM professeur WHERE email = $1", [mail]);

    if (user.rows.length === 0) {
      // Créer un nouvel utilisateur
      const newUser = await pool.query(
        "INSERT INTO professeur (nom, prenom, email, auth_provider) VALUES ($1, $2, $3, $4) RETURNING *",
        [surname, givenName, mail, "microsoft"]
      );
      return res.status(201).json({ success: true, user: newUser.rows[0] });
    }

    // Connecter l'utilisateur existant
    res.status(200).json({ success: true, user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la vérification du token Microsoft" });
  }
});

//GITHUB

// HOME ..........


// SUJETS 


// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
    cb(null, true);
  }
});

// Créer le dossier uploads s'il n'existe pas
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes pour les Cours
// Dans votre route POST /cours

// Créer un cours
app.post('/cours', async (req, res) => {
  try {
    const { nom, code } = req.body;

    // Vérifier si le code existe déjà
    const codeExists = await pool.query(
      'SELECT * FROM cours WHERE code = $1', 
      [code]
    );
    
    if (codeExists.rows.length > 0) {
      return res.status(400).json({ error: 'Un cours avec ce code existe déjà.' });
    }
    
const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newCours = await pool.query(
      "INSERT INTO cours (nom, code, idprof) VALUES ($1, $2, $3) RETURNING *",
      [nom, code, decoded.user.id]
    );
    res.json(newCours.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la création du cours.' });
  }
});
// Dans index.js
const authenticate = require('./middleware/auth');

// Route protégée exemple
app.post('/cours', authenticate, async (req, res) => {
  try {
    const { nom, code } = req.body;
    const idprof = req.user.id; // ID du prof connecté

    const newCours = await pool.query(
      "INSERT INTO cours (nom, code, idprof) VALUES ($1, $2, $3) RETURNING *",
      [nom, code, idprof]
    );

    res.json(newCours.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// Récupérer tous les cours avec leurs sujets
app.get('/cours', async (req, res) => {
  try {
    const allCours = await pool.query(`
      SELECT c.*, 
             json_agg(
               json_build_object(
                 'idsujet', s.idsujet,
                 'titre', s.titre,
                 'description', s.description,
                 'type_sujet', s.type_sujet,
                 'date_depot', s.date_depot,
                 'date_fin', s.date_fin,
                 'fichier_pdf', s.fichier_pdf,
                 'idprof', s.idprof
               )
             ) FILTER (WHERE s.idsujet IS NOT NULL) as sujets
      FROM cours c
      LEFT JOIN sujet s ON c.idcours = s.idcours
      GROUP BY c.idcours
    `);

    res.json(allCours.rows.map(c => ({
      ...c,
      sujets: c.sujets || []
    })));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des cours.' });
  }
});

// Récupérer un cours spécifique
app.get('/cours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cours = await pool.query(
      'SELECT * FROM cours WHERE idcours = $1', 
      [id]
    );

    if (cours.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    const sujets = await pool.query(
      'SELECT * FROM sujet WHERE idcours = $1',
      [id]
    );

    res.json({ ...cours.rows[0], sujets: sujets.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du cours.' });
  }
});

// Modifier un cours
app.put('/cours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, code } = req.body;

    // Vérifier si le cours existe
    const coursExists = await pool.query(
      'SELECT * FROM cours WHERE idcours = $1', 
      [id]
    );
    
    if (coursExists.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Vérifier si le nouveau code est déjà utilisé
    if (code) {
      const codeExists = await pool.query(
        'SELECT * FROM cours WHERE code = $1 AND idcours != $2', 
        [code, id]
      );
      
      if (codeExists.rows.length > 0) {
        return res.status(400).json({ error: 'Un cours avec ce code existe déjà.' });
      }
    }

    const updatedCours = await pool.query(
      'UPDATE cours SET nom = COALESCE($1, nom), code = COALESCE($2, code) WHERE idcours = $3 RETURNING *',
      [nom, code, id]
    );

    res.json(updatedCours.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du cours.' });
  }
});

// Supprimer un cours
app.delete('/cours/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le cours existe
    const coursExists = await pool.query(
      'SELECT * FROM cours WHERE idcours = $1', 
      [id]
    );
    
    if (coursExists.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Supprimer d'abord les sujets associés
    await pool.query('DELETE FROM sujet WHERE idcours = $1', [id]);
    
    // Puis supprimer le cours
    await pool.query('DELETE FROM cours WHERE idcours = $1', [id]);

    res.json({ message: 'Cours et sujets associés supprimés avec succès.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression du cours.' });
  }
});

// Routes pour les Sujets

// Ajouter un sujet à un cours
app.post('/cours/:id/sujets', upload.single('fichier_pdf'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, date_fin, type_sujet = 'TD' } = req.body;
    const fichier_pdf = req.file ? req.file.filename : null;

    // Récupérer l'ID du professeur depuis le token JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idprof = decoded.user.id;

    // Vérifier que le professeur existe
    const profExists = await pool.query(
      'SELECT idprof FROM professeur WHERE idprof = $1', 
      [idprof]
    );
    
    if (profExists.rows.length === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }

    // Vérifier que le cours existe
    const coursExists = await pool.query(
      'SELECT idcours FROM cours WHERE idcours = $1', 
      [id]
    );
    
    if (coursExists.rows.length === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    const newSujet = await pool.query(
      `INSERT INTO sujet 
       (titre, description, date_depot, date_fin, fichier_pdf, idprof, idcours, type_sujet) 
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [titre, description, date_fin, fichier_pdf, idprof, id, type_sujet]
    );

    res.json(newSujet.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de l'ajout du sujet" });
  }
});
// Modifier un sujet
app.put('/sujets/:id', upload.single('fichier_pdf'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, date_fin, type_sujet } = req.body;
    const fichier_pdf = req.file ? req.file.filename : undefined;

    // Validation des types de sujet si fourni
    if (type_sujet) {
      const typesValides = ['CC', 'TP', 'TD', 'DS'];
      if (!typesValides.includes(type_sujet)) {
        return res.status(400).json({ 
          error: 'Type de sujet invalide. Types valides: ' + typesValides.join(', ')
        });
      }
    }

    // Vérifier si le sujet existe
    const sujetExists = await pool.query(
      'SELECT * FROM sujet WHERE idsujet = $1', 
      [id]
    );
    
    if (sujetExists.rows.length === 0) {
      return res.status(404).json({ error: 'Sujet non trouvé.' });
    }

    const updateSujet = await pool.query(
      `UPDATE sujet SET 
       titre = COALESCE($1, titre), 
       description = COALESCE($2, description), 
       date_fin = COALESCE($3, date_fin), 
       fichier_pdf = COALESCE($4, fichier_pdf),
       type_sujet = COALESCE($5, type_sujet)
       WHERE idsujet = $6 
       RETURNING *`,
      [titre, description, date_fin, fichier_pdf, type_sujet, id]
    );

    res.json(updateSujet.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du sujet.' });
  }
});

// Supprimer un sujet
app.delete('/sujets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le sujet existe
    const sujetExists = await pool.query(
      'SELECT * FROM sujet WHERE idsujet = $1', 
      [id]
    );
    
    if (sujetExists.rows.length === 0) {
      return res.status(404).json({ error: 'Sujet non trouvé.' });
    }

    await pool.query('DELETE FROM sujet WHERE idsujet = $1', [id]);

    res.json({ message: 'Sujet supprimé avec succès.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression du sujet.' });
  }
});

// Télécharger le fichier PDF d'un sujet
app.get('/sujets/:id/fichier', async (req, res) => {
  try {
    const { id } = req.params;

    const sujet = await pool.query(
      'SELECT fichier_pdf FROM sujet WHERE idsujet = $1', 
      [id]
    );
    
    if (sujet.rows.length === 0 || !sujet.rows[0].fichier_pdf) {
      return res.status(404).json({ error: 'Fichier non trouvé.' });
    }

    const filePath = path.join(__dirname, 'uploads', sujet.rows[0].fichier_pdf);
    res.download(filePath);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors du téléchargement du fichier.' });
  }
});

