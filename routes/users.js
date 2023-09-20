const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
/* GET users listing. */

router.get('/all', usersController.getAllUsers);

router.post('/new', usersController.createUser);

module.exports = router;
