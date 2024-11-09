const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

router.post('/:projectId/execute', projectController.executeCommand);
router.get('/:projectId/current-command', projectController.getCurrentCommand);
router.post('/:projectId/parse-code', projectController.parseCode);
module.exports = router;