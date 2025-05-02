CREATE DATABASE ELearning;

-- Table Classe
CREATE TABLE Classe (
    idClasse SERIAL PRIMARY KEY,
    nom VARCHAR(100)
);

-- Table Professeur
CREATE TABLE Professeur (
    idProf SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100),
    mot_de_passe VARCHAR(255),
    auth_provider VARCHAR(50) DEFAULT 'local';
    --google_id VARCHAR(255);
);
-- Table Note
CREATE TABLE Note (
    note FLOAT,
    idProf_N INT,
    idEtu_N INT,
    FOREIGN KEY (idProf_N) REFERENCES Professeur(idProf),
    FOREIGN KEY (idEtu_N) REFERENCES Etudiant(idEtu)
);



-- Table Etudiant
CREATE TABLE Etudiant (
    idEtu SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100),
    idClasse_E INT,
    FOREIGN KEY (idClasse_E) REFERENCES Classe(idClasse),
    mot_de_passe VARCHAR(255),
);

-- Table cours
CREATE TABLE cours (
    idcours SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table sujet
CREATE TABLE sujet (
    idsujet SERIAL PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    date_depot DATE NOT NULL DEFAULT CURRENT_DATE,
    date_fin DATE NOT NULL,
    fichier_pdf VARCHAR(255),
    idprof INTEGER NOT NULL REFERENCES professeur(idprof),
    idcours INTEGER NOT NULL REFERENCES cours(idcours) ON DELETE CASCADE,
    type_sujet VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Modele
CREATE TABLE Modele (
    idModele SERIAL PRIMARY KEY,
    titre VARCHAR(100)
);

-- Table consulter_sujet
CREATE TABLE consulter_sujet (
    idEtu_C INT,
    idSujet_C INT,
    PRIMARY KEY (idEtu_C, idSujet_C),
    FOREIGN KEY (idEtu_C) REFERENCES Etudiant(idEtu),
    FOREIGN KEY (idSujet_C) REFERENCES Sujet(idSujet)
);