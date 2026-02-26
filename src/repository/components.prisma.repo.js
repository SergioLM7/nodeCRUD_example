const prisma = require('../prismaClient');

const model = prisma.componentes;

module.exports = { 
    async getAll() {
        return model.findMany({ orderBy: {id: 'asc'}});
    },
    async getById(id) {
        return model.findUnique({where: {id}});
    },
    //Create -> inserta en orden de los campos de la tabla
    async create(datos) {
        const {nombre, tipo, marca = null, precio = 0, stock = 0} = datos;
        return model.create({ data: {nombre, tipo, marca, precio, stock} });
    },
    //Update -> actualiza solo los campos que vengan en el body (si no vienen, no los toca)
    async update (id, datos) {
        const payload = {};

        if(datos.nombre !== undefined && datos.nombre !== null) payload.nombre = datos.nombre;
        if(datos.tipo !== undefined && datos.tipo !== null) payload.tipo = datos.tipo;
        if(datos.marca !== undefined && datos.marca !== null) payload.marca = datos.marca;
        if(datos.precio !== undefined && datos.precio !== null) payload.precio = datos.precio;
        if(datos.stock !== undefined && datos.stock !== null) payload.stock = datos.stock;

        return model.update({ where: {id}, data: payload });
    },
    //Delete -> elimina el componente con el id que se le pasa por parámetro; no devuelve ningún registro por default
    async remove(id) {
        await model.delete({ where: {id} });
        return true;
    }
};