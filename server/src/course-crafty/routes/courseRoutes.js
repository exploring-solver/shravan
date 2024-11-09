const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/courses', courseController.createCourse);
router.post('/courses/:courseId/generate', courseController.generateCourseContent);

module.exports = router;
