const express = require('express');
const router = express.Router();
const { testQuery } = require('../controllers/testController');

router.get('/', async (req, res, next) => {
    const data = await testQuery();
    res.send(data)
})

module.exports = router;