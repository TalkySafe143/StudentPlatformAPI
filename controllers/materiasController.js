const RDS = require('../lib/rds');
const rds = new RDS();
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

module.exports = { getAllSubjects, getOneSubject }