const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const auth = require('../middleware/auth'); // Your existing auth middleware

router.post('/initialize', auth, ChatController.initializeChat);
router.post('/message', auth, ChatController.sendMessage);
router.get('/history/:chatId', auth, ChatController.getChatHistory);
router.post('/context', auth, ChatController.updateContext);

module.exports = router;