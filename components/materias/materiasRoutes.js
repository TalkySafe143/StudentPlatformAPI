const express = require('express')
const materiasController = require("./materiasController");
const subStudentController = require('../materiasXestudiante/subStudentController');
const router = express.Router();
const passport = require("passport");
require("../../utils/auth/strategies/jwt");


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
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    materiasController.getAllSubjects
);

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    materiasController.getOneSubject
);

router.post(
    '/',
    passport.authenticate('jwt', {session: false}),
    materiasController.createSubject
);

router.put(
    '/:id',
    passport.authenticate('jwt', {session: false}),
    materiasController.updateSubject
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    materiasController.deleteSubject
);

module.exports = router;