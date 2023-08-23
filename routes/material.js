const express = require('express');
const router = express.Router();
const upload = require('multer')();
const materialesController = require('../controllers/materialController');

router.post('/', upload.single('uploadedFile'), materialesController.uploadFile)
router.get('/', materialesController.getAllFiles);

module.exports = router;