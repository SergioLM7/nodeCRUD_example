const { PrismaClient } = require("@prisma/client"); //Importo la clase PrismaClient del paquete @prisma/client

const prisma = new PrismaClient(); //Creo una instancia de PrismaClient

module.exports = prisma;