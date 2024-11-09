const Chat = require('../models/chat');
const { processWithGemini } = require('../utils/geminiProcessor'); // You'll need to implement this

class ChatService {
  async createChat(userId, chatType) {
    const chat = new Chat({
      userId,
      chatType,
      messages: [],
      context: new Map()
    });
    return await chat.save();
  }

  async getOrCreateChat(userId, chatType) {
    let chat = await Chat.findOne({ userId, chatType });
    if (!chat) {
      chat = await this.createChat(userId, chatType);
    }
    return chat;
  }

  async addMessage(chatId, content, sender) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');

    chat.messages.push({ content, sender });
    chat.lastActive = new Date();
    await chat.save();
    return chat;
  }

  async processMessage(chatId, message, chatType) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');

    // Add user message
    await this.addMessage(chatId, message, 'user');

    // Process based on chat type
    let response;
    switch (chatType) {
      case 'voice':
        response = await processWithGemini(message, chat.context, 'voice_assistant');
        break;
      case 'task':
        response = await processWithGemini(message, chat.context, 'task_executor');
        break;
      case 'general':
        response = await processWithGemini(message, chat.context, 'general_assistant');
        break;
      default:
        throw new Error('Invalid chat type');
    }

    // Add assistant response
    await this.addMessage(chatId, response, 'assistant');
    return response;
  }

  async getChatHistory(chatId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');
    return chat.messages;
  }

  async updateContext(chatId, contextUpdates) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');

    for (const [key, value] of Object.entries(contextUpdates)) {
      chat.context.set(key, value);
    }
    await chat.save();
    return chat.context;
  }
}

module.exports = new ChatService();