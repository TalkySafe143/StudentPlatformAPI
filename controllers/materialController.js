const awsS3 = require('../lib/s3')
const RDS = require('../lib/rds');
const fs = require("fs");
const S3 = new awsS3();
const rds = new RDS();
const uuid = require('uuid').v4
async function uploadFile(req, res, next) {
    const key = uuid();
    const { title, desc, materia_materia_id, estudiante_cc } = req.body;
    if (req.file) {
        try {
            fs.writeFileSync(`${__dirname}/uploads/${key}-desc.txt`, desc, {encoding:"utf8"});
            const descFile = fs.readFileSync(`${__dirname}/uploads/${key}-desc.txt`);
            await S3.createFileObject(`${key}-desc.txt`, descFile, key);
            const ruta = await S3.createFileObject(req.file.originalname, req.file.buffer, key);
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
            console.log(e)
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
}

async function getAllFiles(req, res, next) {
    try {
        const data = await rds.getData('material', []);
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