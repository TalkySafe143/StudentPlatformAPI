const express = require('express');
const router = express.Router();
const upload = require('multer')();
const materialesController = require('../controllers/materialController');
const { multerMiddleware } = require('../utils/multerConfig')

/**
 * @swagger
 * /api/material:
 *  post:
 *      summary: Agrega un nuevo material a S3 y RDS
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *      responses:
 *          200:
 *              description: El material fue creado correctamente
 *          400:
 *              description: Algo ocurrió al momento de crear el material
 *
 */
router.post('/',upload.single('uploadedFiles'), materialesController.uploadFile);

/**
 * @swagger
 * /api/material:
 *  get:
 *      summary: Obtiene todos los materiales que estan publicados hasta el momento
 *      responses:
 *          200:
 *              description: Los materiales fueron recuperados correctamente
 *          400:
 *              description: Algo ocurrió al momento de recuperar los materiales
 *
 */
router.get('/', materialesController.getAllFiles);

router.delete('/:key', materialesController.deleteMaterial);

module.exports = router;