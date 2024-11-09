const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ChromaClient } = require('chromadb');
const { Document } = require('langchain/document');
const { GoogleGenerativeAIEmbeddings } = require('@google/generative-ai');

class GeminiChatProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.chromaClient = new ChromaClient();
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "embedding-001",
      taskType: "retrieval_document",
      title: "Chat memory embeddings"
    });
  }

  async initializeUserCollection(userId, chatType) {
    const collectionName = `${userId}_${chatType}`;
    try {
      await this.chromaClient.createCollection({
        name: collectionName,
        metadata: { userId, chatType }
      });
      console.log(`Created collection for user ${userId} with chat type ${chatType}`);
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async storeMessageInMemory(userId, chatType, message, response) {
    const collectionName = `${userId}_${chatType}`;
    const collection = await this.chromaClient.getCollection(collectionName);

    const conversationChunk = new Document({
      pageContent: `User: ${message}\nAssistant: ${response}`,
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'conversation'
      }
    });

    const embedding = await this.embeddings.embedQuery(conversationChunk.pageContent);
    
    await collection.add({
      ids: [Date.now().toString()],
      embeddings: [embedding],
      documents: [conversationChunk.pageContent],
      metadatas: [conversationChunk.metadata]
    });
  }

  async retrieveRelevantContext(userId, chatType, query) {
    const collectionName = `${userId}_${chatType}`;
    const collection = await this.chromaClient.getCollection(collectionName);

    const queryEmbedding = await this.embeddings.embedQuery(query);
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5
    });

    return results.documents[0];  // Return the most relevant previous conversations
  }

  getSystemPromptForType(chatType) {
    switch(chatType) {
      case 'voice':
        return `You are a voice assistant. Focus on providing clear, concise responses that would work well when read aloud. 
                Previous conversation context will be provided to maintain continuity.`;
      case 'task':
        return `You are a task execution assistant. You help users by generating Python code and processing commands. 
                Maintain context of previous tasks and their outputs.`;
      case 'general':
        return `You are a helpful assistant for general questions and discussions. 
                Use previous conversation context to provide more relevant and personalized responses.`;
      default:
        return 'You are a helpful assistant.';
    }
  }

  async processOSCommand(command) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a command processing assistant. Please analyze the following command and provide appropriate guidance or execution steps:
                    Command: ${command}
                    
                    Provide your response in the following JSON format:
                    {
                      "understanding": "Brief explanation of what the command does",
                      "validation": "Any safety/security concerns",
                      "executionSteps": ["Step 1", "Step 2", ...],
                      "pythonCode": "Python code to execute this command if applicable"
                    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  async processChatMessage(userId, chatType, message) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      }
    });

    // Retrieve relevant context from vector storage
    const previousContext = await this.retrieveRelevantContext(userId, chatType, message);
    
    const systemPrompt = this.getSystemPromptForType(chatType);
    const contextualPrompt = `
      ${systemPrompt}
      
      Previous relevant context:
      ${previousContext ? previousContext.join('\n') : 'No relevant context found.'}
      
      Current user message: ${message}
      
      Please provide a response that:
      1. Maintains consistency with previous interactions
      2. Is appropriate for the chat type (${chatType})
      3. Includes any relevant information from previous context
    `;

    const result = await chat.sendMessage(contextualPrompt);
    const response = result.response.text();

    // Store the conversation in vector memory
    await this.storeMessageInMemory(userId, chatType, message, response);

    return response;
  }
}

module.exports = new GeminiChatProcessor();