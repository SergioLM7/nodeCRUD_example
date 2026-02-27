require("dotenv").config();

const express = require("express");

//Importamos el objeto repo que contiene los métodos de acceso a datos (getAll, getById, create, update, remove)
//El repo se encarga de exportar el módulo correcto según la variable de entorno DATA_ACCESS
const repo = require("./repository");

//Crear la aplicación Express que lanza el servidor
const app = express();

//Me sirve para gestionar rutas de forma relativa según la ubicación del archivo
const path = require("path");

// -----------------------------------------------------
// 4. MIDDLEWARES
// -----------------------------------------------------

// Middleware para que Express pueda interpretar JSON
// en el cuerpo (body) de las peticiones HTTP.
//
// SIN este middleware:
// - req.body === undefined
//
// CON este middleware:
// - req.body contiene el objeto enviado en JSON
app.use(express.json());

// Middleware para servir archivos estáticos
// Permite acceder a HTML, CSS y JS desde la carpeta /public
//__dirname es el directorio donde está app.js
//.. nos lleva a la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, "..", "public")));


// GET /componentes
// Devuelve el listado completo de componentes ordenado ASC por el id del componente
app.get("/componentes", async (req, res) => {

    try {
        const result = await repo.getAll();
        res.json(Array.isArray(result) ? result : []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al listar componentes", detalle: err.message });
    }
});

//GET /componentes/:id (parametro id)
//Devuelve el componente con el id que llega como param por la URL
app.get("/componentes/:id", async (req, res) => {
    const id = Number(req.params.id) || req.params.id;

    if(Number.isNaN(id)) return res.status(400).json({error: "ID inválido"});

    try {
        const item = await repo.getById(id);

        if(!item) return res.status(404).json({error: "Componente no encontrado"});

        res.json(item);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el componente", detalle: err.message });
    }

});

app.post("/componentes", async (req, res) => {

    //Aquellas variables que sean susceptibles de quedar vacías, les damos un valor por defecto
    const {nombre, tipo, marca = null, precio = 0, stock = 0} = req.body;

    if(!nombre || !tipo) return res.status(400).json({error: "Campos obligatorios: nombre y tipo"});

    try {
        const result = await repo.create({nombre, tipo, marca, precio, stock});
        
        res.status(201).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear un componente nuevo", detalle: err.message });
    }
});

app.put("/componentes/:id", async (req,res) => {

    const id = Number(req.params.id) || req.params.id;
    if(Number.isNaN(id)) return res.status(400).json({error: "ID inválido"});

    const { nombre, tipo, marca, precio, stock } = req.body;

    try {
        if(!nombre || !tipo) return res.status(400).json({error: "Campos obligatorios: nombre y tipo"});

        const result  = await repo.update(id, {nombre, tipo, marca, precio, stock});

        if(!result) return res.status(404).json({error: "Componente no encontrado"});

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar el componente", detalle: err.message });
    }
});

app.delete("/componentes/:id", async (req,res) => {
    const id = Number(req.params.id) || req.params.id;
    if(Number.isNaN(id)) return res.status(400).json({error: "ID inválido"});

    try {
        const result = await repo.remove(id);

        if (!result) return res.status(404).json({error: "Componente no encontrado"});

        res.status(204).send();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar el componente", detalle: err.message });
    }
});


/*
-----ARRANQUE DEL SERVIDOR-----
*/
// Puerto donde escucha el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor HTTP
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));