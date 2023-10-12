const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
/* GET users listing. */

router.get('/all', usersController.getAllUsers);

router.post('/new', usersController.createUser);

router.get('/:id', usersController.getOneUser);

router.put('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;
