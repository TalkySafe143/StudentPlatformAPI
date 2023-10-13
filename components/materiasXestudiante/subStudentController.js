const express = require('express');
const router = express.Router();
const boom = require('@hapi/boom');
const RDS = require('../../lib/rds');
const rds = new RDS();
const materiasController = require('../materias/materiasController');
const usersController = require('../users/usersController');
const encryptionWorker = require('../../utils/encryptionWorker');

async function getAllSubEst(req, res ,next) {
    try {
        const data = await rds.getData('materiaxestu', []);

        return res.status(200).json({
            message: 'Relaciones obtenidas exitosamente',
            data
        })
    } catch (e) {
        next(e);
    }
}

async function getOneSubEst(req, res, next) {
    const { idSub, idEst } = req.params;

    const queryObject = {
        "FROM": ["materiaxestu"],
        "WHERE": [
            {
                "column": "materia_materia_id",
                "type": "=",
                "value": `'${idSub}'`,
                "connector": "AND"
            },
            {
                "column": "estudiante_cc",
                "type": "=",
                "value": `'${idEst}'`
            }
        ]
    }

    try {
        const data = await rds.buildSelectQuery(queryObject);

        if (!data[0]) return next(boom.badRequest('Esa relacion no existe'));

        return res.status(200).json({
            message: 'Relacion extraida correctamente',
            data
        });
    } catch (e) {
        next(e)
    }
}

async function createSubEst(req, res, next) {
    const { materia_materia_id, estudiante_cc } = req.body;

    if (encryptionWorker.checkSQLEntry(req.body)) {
        return res.status(401).json({
            err: 'Ups, algo sucedio con tu pregunta'
        })
    }

    try {
        const estudiante = await usersController.getOneUser(
            { params: { id: estudiante_cc }, jwtProcess: true },
            {},
            () => {}
        );

        if (!estudiante[0]) return next(boom.badRequest('No existe el estudiante'));

        const materia = await materiasController.getOneSubject(
            { params: { id: materia_materia_id }, jwtProcess:true },
            {},
            () => {}
        );

        if (!materia[0]) return next(boom.badRequest('No existe la materia'));

        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') req.body[key] = `'${value}'`;
        }

        const data = await rds.insertData('materiaxestu', req.body);

        return res.status(200).json({
            message: 'Relacion creada correctamente',
            data
        });

    } catch (e) {
        next(e);
    }
}

async function updateSubEst(req, res, next) {
    const { idSub, idEst } = req.params;

    if (encryptionWorker.checkSQLEntry(req.body)) {
        return res.status(404).json({
            error: "Ups, algo paso en la consulta"
        });
    }

    const updateObject = {
        "column": Object.entries(req.body)[0][0],
        "newValue": `'${Object.entries(req.body)[0][1]}'`,
        "condition": [
            {
                "column": "materia_materia_id",
                "type": "=",
                "value": `'${idSub}'`,
                "connector": "AND"
            },
            {
                "column": "estudiante_cc",
                "type": "=",
                "value": `'${idEst}'`
            }
        ]
    }

    try {
        const data = await rds.buildUpdateQuery('materiaxestu', updateObject);

        if (data.affectedRows === 0) return next(boom.badRequest('No existe esa relacion'));

        return res.status(200).json({
            message: 'Relacion actualizada correctamente',
            data
        })
    } catch (e) {
        next(e);
    }
}

async function deleteSubEst(req, res, next) {
    const { idEst, idSub } = req.params;

    const deleteObject = {
        "condition": [
            {
                "column": "materia_materia_id",
                "type": "=",
                "value": `'${idSub}'`,
                "connector": "AND"
            },
            {
                "column": "estudiante_cc",
                "type": "=",
                "value": `'${idEst}'`
            }
        ]
    }

    try {
        const data = await rds.buildDeleteQuery("materiaxestu", deleteObject);

        if (data.affectedRows === 0) return next(boom.badRequest('No existe una relacion con esos IDs'))

        return res.status(200).json({
            message: "Relacion eliminada exitosamente",
            data
        })
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getAllSubEst,
    getOneSubEst,
    createSubEst,
    updateSubEst,
    deleteSubEst
};