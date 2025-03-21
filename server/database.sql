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

);

-- Table Cours
CREATE TABLE Cours (
    idCours SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    code VARCHAR(100)
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

-- Table Note
CREATE TABLE Note (
    note FLOAT,
    idProf_N INT,
    idEtu_N INT,
    FOREIGN KEY (idProf_N) REFERENCES Professeur(idProf),
    FOREIGN KEY (idEtu_N) REFERENCES Etudiant(idEtu)
);

-- Table Sujet
CREATE TABLE Sujet (
    idSujet SERIAL PRIMARY KEY,
    titre VARCHAR(100),
    date_depot DATE,
    date_fin DATE,
    description VARCHAR(100)
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