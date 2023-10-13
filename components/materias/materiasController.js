const RDS = require('../../lib/rds');
const rds = new RDS();
const encryptionWorker = require('../../utils/encryptionWorker');
const boom = require('@hapi/boom')
async function getAllSubjects(req, res, next) {
    try {
        const data = await rds.getData('materia', []);
        return res.status(200).json({
            data,
            error: ""
        })
    } catch (e) {
        next(e)
    }
}

async function getOneSubject(req, res, next) {
    const {id} = req.params;
    const queryObject = {
        "SELECT": ["name"],
        "FROM": ["materia"],
        "WHERE": [{
            column: "materia_id",
            type: "=",
            value: id
        }]
    }

    try {
        const data = await rds.buildSelectQuery(queryObject);

        if (req.jwtProcess) return data;

        return res.status(200).json({
            data,
            err: null
        })
    } catch(e){
        return res.status(400).json({
            message: "Ups, ocurrió un error",
            err: e
        })
    }
}

async function createSubject(req, res, next) {
    const subject = req.body;

    if (!subject.materia_id) return next(boom.badData('Los datos no estan comlpetos'))

    if (encryptionWorker.checkSQLEntry(subject)){
        return res.status(401).json({
            err: "Ups, sucedio algo con la consulta"
        });
    }

    try {
        for (const [key, value] of Object.entries(subject)) {
            if (typeof value === 'string') subject[key] = `'${value}'`
        }

        const data = await rds.insertData('materia', subject);

        return res.status(200).json({
            message: 'Materia creada correctamente',
            data
        });

    } catch (e) {
        next(e)
    }
}

async function updateSubject(req, res, next) {
    const { id } = req.params;

    if (encryptionWorker.checkSQLEntry(req.body)) {
        return res.status(401).json({
            err: 'Algo salio mal con tu peticion'
        });
    }

    if (!Object.entries(req.body)[0]) return next(boom.badData('Escriba los campos bien'))

    const updateObject = {
        "column": Object.entries(req.body)[0][0],
        "newValue": `'${Object.entries(req.body)[0][1]}'`,
        "condition": [{
            "column": "materia_id",
            "type" : "=",
            "value": `'${id}'`
        }]
    }

    try {
        const data = await rds.buildUpdateQuery('materia', updateObject);

        return res.status(200).json({
            message: 'Materia actualizada correctamente',
            data
        })
    } catch (e) {
        next(e)
    }
}

async function deleteSubject(req, res, next) {
    const { id } = req.params;
    const deleteObject = {
        "condition": [{
            "column": "materia_id",
            "type": "=",
            "value": `'${id}'`
        }]
    }
    try {
        const data = await rds.buildDeleteQuery('materia', deleteObject);

        if (data.affectedRows === 0) return next(boom.badRequest('No existe una materia con ese ID'))

        return res.status(200).json({
            message: 'Materia eliminada correctamente',
            data
        })

    } catch (e) {
        next(e)
    }
}

module.exports = { getAllSubjects, getOneSubject, createSubject, updateSubject, deleteSubject }