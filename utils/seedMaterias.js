const RDS = require('../lib/rds');
const rds = new RDS();
const events = require("node:events");
const debug = require('debug')('SeedMaterias');
const materias = ["Estructuras de datos", "Bases de datos", "Ingenieria de software", "Sistemas de informacion", "Introduccion a la progr."];

const evento = new events.EventEmitter();

let i = 0;
materias.forEach(async (materia, index) => {
    await rds.insertData('materia', {
        name: `'${materia}'`,
        dept: `'Ing. de sistemas'`,
        materia_id: index+1
    })
    i++;
    evento.emit('agregado', i++);
})

evento.on('agregado', times => {
    if (times === materias.length) {
        debug("Se han agregado a la BD correctamente")
        process.exit(0);
    }
})
