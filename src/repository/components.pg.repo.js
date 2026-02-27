const pool = require('../db');

const TABLE = 'componentes';

module.exports = { 
    async getAll() {
        const { rows } = await pool.query(`SELECT * FROM ${TABLE} ORDER BY id ASC`); 

        return rows;
    },
    async getById(id) {
        const {rows} = await pool.query("SELECT * FROM componentes WHERE id = $1", [id])
        return rows[0];
    },
    async create(datos) {
        const {nombre, tipo, marca = null, precio = 0, stock = 0} = datos;

        const { rows } = await pool.query(
            `INSERT INTO componentes (nombre, tipo, marca, precio, stock) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`, [nombre, tipo, marca, precio, stock]
        );
        return rows[0];
    },
    async update (id, datos) {
        const payload = {};

        if(datos.nombre !== undefined && datos.nombre !== null) payload.nombre = datos.nombre;
        if(datos.tipo !== undefined && datos.tipo !== null) payload.tipo = datos.tipo;
        if(datos.marca !== undefined && datos.marca !== null) payload.marca = datos.marca;
        if(datos.precio !== undefined && datos.precio !== null) payload.precio = datos.precio;
        if(datos.stock !== undefined && datos.stock !== null) payload.stock = datos.stock;

        const result  = await pool.query(
            `UPDATE componentes
            SET 
                nombre = COALESCE($1, nombre),
                tipo = COALESCE($2, tipo),
                marca = COALESCE($3, marca),
                precio = COALESCE($4, precio),
                stock = COALESCE($5, stock)
            WHERE id = $6
            RETURNING * `, [payload.nombre, payload.tipo, payload.marca, payload.precio, payload.stock, id]
        );
        return result.rows[0];
    },
    async remove(id) {
        const result = await pool.query("DELETE FROM componentes WHERE id=$1 RETURNING *", [id]);

        if (result.rows.length !== 0) {
            return true;
        } else {
            return false;
        }
    }
};