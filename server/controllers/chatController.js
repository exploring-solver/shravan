const ChatService = require('../services/chatService');

class ChatController {
  async initializeChat(req, res) {
    try {
      const { userId, chatType } = req.body;
      const chat = await ChatService.getOrCreateChat(userId, chatType);
      res.json({ success: true, chatId: chat._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { chatId, message, chatType } = req.body;
      const response = await ChatService.processMessage(chatId, message, chatType);
      res.json({ success: true, response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getChatHistory(req, res) {
    try {
      const { chatId } = req.params;
      const history = await ChatService.getChatHistory(chatId);
      res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateContext(req, res) {
    try {
      const { chatId, context } = req.body;
      const updatedContext = await ChatService.updateContext(chatId, context);
      res.json({ success: true, context: updatedContext });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ChatController();