const express = require('express')
const materiasController = require("../controllers/materiasController");
const router = express.Router();

/**
 * @swagger
 * /api/materias:
 *  get:
 *      summary: Obtiene todas las materias registradas
 *      responses:
 *          200:
 *              description: Las materias fueron recuperadas correctamente
 *          400:
 *              description: Algo ocurrió al momento de crear el material
 *
 */
router.get('/', materiasController.getAllSubjects);

router.get('/:id', materiasController.getOneSubject)

module.exports = router;