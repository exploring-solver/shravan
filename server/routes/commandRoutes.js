const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');

router.post('/', commandController.createCommand);
router.get('/project/:projectId', commandController.getCommandsByProject);
router.put('/:commandId', commandController.updateCommand);
router.delete('/:commandId', commandController.deleteCommand);
router.post('/assistant-command', commandController.handleAssistantCommand);

module.exports = router;