const awsS3 = require('../lib/s3')
const S3 = new awsS3();
async function uploadFile(req, res, next) {
    let key = null;
    if (req.file) {
        try {
            key = await S3.createFileObject(req.file.originalname, req.file.buffer);
            return res.status(200).json({
                message: 'Objeto creado correctamente',
                key
            })
        } catch (e) {
            return res.status(400).json({
                message: 'Ups, ocurrió un error',
                error: e
            })
        }
    }
}

async function getAllFiles(req, res, next) {
    try {
        const data = await S3.getAllFileObjects();
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

module.exports = { uploadFile, getAllFiles }