const express = require('express');
const router = express.Router();
const osCommandsController = require('../controllers/osCommandsController');
const { authMiddleware } = require('../controllers/authControllers');

router.post('/execute', osCommandsController.handleOSCommand);
router.post('/module-execute', authMiddleware, osCommandsController.handleModuleOsCommand);

module.exports = router;