const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "projetSGBD2025",
    database: "classroom",
    host:"localhost",
    port: 5432,
});

module.exports = pool;