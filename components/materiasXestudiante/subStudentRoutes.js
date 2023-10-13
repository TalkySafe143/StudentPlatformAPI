const express = require('express');
const router = express.Router();
const passport = require("passport");
const subStudentController = require("./subStudentController");
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    subStudentController.getAllSubEst
)

router.get(
    '/:idSub/:idEst',
    passport.authenticate('jwt', { session: false }),
    subStudentController.getOneSubEst
)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    subStudentController.createSubEst
)

router.put(
    '/:idSub/:idEst',
    passport.authenticate('jwt', { session: false }),
    subStudentController.updateSubEst
)

router.delete(
    '/:idSub/:idEst',
    passport.authenticate('jwt', { session: false }),
    subStudentController.deleteSubEst
)

module.exports = router;