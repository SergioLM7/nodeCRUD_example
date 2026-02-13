require("dotenv").config();

const express = require("express");
const pool = require("./db");

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
        const result = await pool.query("SELECT * FROM componentes ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al listar componentes", detalle: err.message });
    }
});

//GET /componentes/:id (parametro id)
//Devuelve el componente con el id que llega como param por la URL
app.get("/componentes/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query("SELECT * FROM componentes WHERE id = $1", [id])

        if(result.rowCount === 0) return res.status(404).json({error: "Componente no encontrado"});

        res.json(result.rows[0]);

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

        const result = await pool.query(
            `INSERT INTO componentes (nombre, tipo, marca, precio, stock) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`, [nombre, tipo, marca, precio, stock]
        );
        
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear un componente nuevo", detalle: err.message });
    }
});

app.put("/componentes/:id", async (req,res) => {

    const { id } = req.params;
    const { nombre, tipo, marca, precio, stock } = req.body;

    try {

        if(!nombre || !tipo) return res.status(400).json({error: "Campos obligatorios: nombre y tipo"});

        const exists = await pool.query("SELECT * FROM componentes WHERE id = $1", [id])

        if(exists.rows.length === 0) return res.status(404).json({error: "Componente no encontrado"});

        //Si algunos de los campos vienen vacíos, metemos null como valor default (doble comprobación) 
        // (si no, daría error en el caso de que un campo viniera vacío)
        const result  = await pool.query(
            `UPDATE componentes
            SET 
                nombre = COALESCE($1, nombre),
                tipo = COALESCE($2, tipo),
                marca = COALESCE($3, marca),
                precio = COALESCE($4, precio),
                stock = COALESCE($5, stock)
            WHERE id = $6
            RETURNING * `, [nombre ?? null, tipo ?? null, marca ?? null, precio ?? null, stock ?? null, id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar el componente", detalle: err.message });
    }
});

app.delete("/componentes/:id", async (req,res) => {
    const { id } = req.params;

    try {
        
        //En POSTGRESQL se devuelve el registro tal cual estaba antes de borrarse
        const result = await pool.query("DELETE FROM componentes WHERE id=$1 RETURNING *", [id]);

        if (result.rows.length === 0) return res.status(404).json({error: "Componente no encontrado"});

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