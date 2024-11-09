const express = require('express');
const { translateCourse } = require('../controllers/translationController');
const router = express.Router();

router.post('/translate', translateCourse);

module.exports = router;
