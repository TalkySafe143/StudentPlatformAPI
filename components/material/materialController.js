const awsS3 = require('../../lib/s3')
const RDS = require('../../lib/rds');
const fs = require("fs/promises");
const S3 = new awsS3();
const rds = new RDS();
const uuid = require('uuid').v4
async function uploadFile(req, res, next) {
    const key = uuid();
    const { title, desc, materia_materia_id, estudiante_cc } = req.body;
    try {
        await fs.writeFile(`${__dirname}/uploads/${key}-desc.txt`, desc, {encoding:"utf8"});
        console.log("dsadasda")
        const descFile = await fs.readFile(`${__dirname}/uploads/${key}-desc.txt`);

        let ruta = await S3.createFileObject(`${key}-desc.txt`, descFile, key);
        if (req.file) ruta = await S3.createFileObject(req.file.originalname, req.file.buffer, key);
        const queryEntries = {
            title: `'${title}'`,
            description: `'${desc.substring(0, 20)}'`,
            link: `'https://materiales-javeplatform.s3.amazonaws.com/${ruta}'`,
            estudiante_cc: `'${estudiante_cc}'`,
            material_id: `'${key}'`,
            materia_materia_id: `'${materia_materia_id}'`
        }
        await rds.insertData('material', queryEntries);
        return res.status(200).json({
            data: "Material publicado correctamente",
            error: null
        })
    } catch (e) {
        if (e === {}) {
            return res.status(200).json({
                data: "Material publicado correctamente",
                error: null
            })
        }
        return res.status(400).json({
            message: 'Ups, ocurrió un error',
            error: e
        })
    }

}

async function getAllFiles(req, res, next) {
    try {
        let data = [];
        
        if (!Object.entries(req.query).length) data = await rds.getData('material', []);
        else if (req.query["estudiante_cc"]){
            const queryObject = {
                "FROM": ["material"],
                "WHERE": [{
                    column: "estudiante_cc",
                    type: "=",
                    value: `'${req.query["estudiante_cc"]}'`
                }]
            }

            data = await rds.buildSelectQuery(queryObject);
        }

        return res.status(200).json({
            message: 'Objetos recuperados correctamente',
            data
        })
    } catch (e) {
        return res.status(400).json({
            message: 'Ups, ocurrió un error',
            error: e
        })
    }
}

async function deleteMaterial(req, res, next) {
    try {
        const {key} = req.params;
        const deleteObject = {
            condition: [{
                column: 'material_id',
                type: '=',
                value: `'${key}'`
            }]
        }
        await rds.buildDeleteQuery('material', deleteObject);
        await S3.deleteFolder(key);

        return res.status(203).json({
            data: "Eliminado correctamente",
            error: null
        })

    } catch (e) {
        return res.status(400).json({
            message: 'Ups, ocurrió un error',
            error: e
        })
    }
}

module.exports = { uploadFile, getAllFiles, deleteMaterial }