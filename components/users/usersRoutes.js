const express = require('express');
const router = express.Router();
const usersController = require('./usersController');
const passport = require("passport");
require("../../utils/auth/strategies/jwt");

/* GET users listing. */

router.get('/all', passport.authenticate('jwt', { session: false }),usersController.getAllUsers);

router.post('/new', passport.authenticate('jwt', { session: false }),usersController.createUser);

router.get('/:id', passport.authenticate('jwt', { session: false }),usersController.getOneUser);

router.put('/:id', passport.authenticate('jwt', { session: false }),usersController.updateUser);

router.delete('/:id', passport.authenticate('jwt', { session: false }),usersController.deleteUser);

module.exports = router;

