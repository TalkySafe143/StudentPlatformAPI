const express = require('express');
const router = express.Router();
const upload = require('multer')();
const materialesController = require('./materialController');
const { multerMiddleware } = require('../../utils/multerConfig')
const passport = require("passport");
require("../../utils/auth/strategies/jwt");

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
router.post('/', passport.authenticate('jwt', { session: false }) ,upload.single('uploadedFiles'), materialesController.uploadFile);

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
router.get('/', passport.authenticate('jwt', { session: false }) ,materialesController.getAllFiles);

router.delete('/:key', passport.authenticate('jwt', { session: false }) ,materialesController.deleteMaterial);

module.exports = router;