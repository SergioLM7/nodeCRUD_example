const mode = (process.env.DATA_ACCESS || 'pg').toLowerCase();

console.log("Repo mode:", process.env.DATA_ACCESS);

if (mode === 'prisma') {
    module.exports = require('./components.prisma.repo');
} else {
    module.exports = require('./components.pg.repo');
    console.log("Cargando repo PG");
}