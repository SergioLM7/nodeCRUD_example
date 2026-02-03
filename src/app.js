require("dotenv").config();

const express = require("express");
const pool = require("./db");

//Crear la aplicación Express que lanza el servidor
const app = express();

//Me sirve para gestionar rutas de forma relativa según la ubicación del archivo
const path = require("path");

// Middleware para servir archivos estáticos
// Permite acceder a HTML, CSS y JS desde la carpeta /public
//__dirname es el directorio donde está app.js
//.. nos lleva a la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, "..", "public")));


// GET /componentes
// Devuelve el listado completo de componentes
app.get("/componentes", async (req, res) => {

});

// Puerto donde escucha el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor HTTP
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));