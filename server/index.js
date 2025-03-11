const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//MIDDELWARE
app.use(cors());
app.use(express.json()); //req.body

// ROUTES

// Creer un professeur 

app.post("/professeurs", async (req, res) => {
    try {
        const { nom, prenom, date_naissance, email } = req.body;
        const newProfesseur = await pool.query(
            "INSERT INTO professeur (nom, prenom, date_naissance, email) VALUES ($1, $2, $3, $4) RETURNING *",
            [nom, prenom, date_naissance, email]
        );
        res.json(newProfesseur.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


// Afficher tous les professeurs

app.get("/professeurs", async (req, res)  => {

    try {
        const allProfesseurs = await pool.query("SELECT * FROM professeur");
        res.json(allProfesseurs.rows);
    } catch (err) {
        console.error(err.message);
        
    }
    
});

// Afficher un professeur

app.get("/professeurs/:id", async (req, res)  => {

    try {
        const { id } = req.params;
        const professeur = await pool.query("SELECT * FROM professeur WHERE ID = $1", [id]);
        res.json(professeur.rows);
    } catch (err) {
        console.error(err.message);
        
    }
    
});

// modifier un professeur

app.put("/professeurs/:id", async (req, res)  => {

    try {
        const { id } = req.params;
        const { nom, prenom, date_naissance, email } = req.body;
        const updateProfesseur = await pool.query(
            "UPDATE professeur SET nom = $1, prenom = $2,date_naissance = $3, email = $4 WHERE ID = $5 RETURNING *",
            [nom, prenom, date_naissance, email, id]);
        res.json("mise a jour reussi");
    } catch (err) {
        console.error(err.message);
        
    }
    
});

// Supprimer un professeur

app.delete("/professeurs/:id", async (req, res)  => {

    try {
        const { id } = req.params;
        const deleteProfesseur = await pool.query("DELETE FROM professeur WHERE ID = $1", [id]);
        res.json("Professeur supprimée");
    } catch (err) {
        console.error(err.message);
        
    }
    
});
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});