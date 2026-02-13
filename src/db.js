require("dotenv").config();

const { Pool } = require('pg');

//Objeto de conexión a la base de datos
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

//Exportamos el objeto de conexión para usarlo en otros módulos
module.exports = pool;