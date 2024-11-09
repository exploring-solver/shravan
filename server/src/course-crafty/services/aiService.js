const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.generateLectureNotes = async (topic) => {
  const prompt = `Create detailed lecture notes for a lesson on: "${topic}"`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating lecture notes:', error);
    throw new Error('Failed to generate lecture notes');
  }
};

exports.translateContent = async (content, targetLanguage) => {
  const prompt = `Translate the following text into ${targetLanguage}: "${content}"`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error translating content:', error);
    throw new Error('Failed to translate content');
  }
};

exports.generateImages = async (topic) => {
  const prompt = `Provide image descriptions related to the topic: "${topic}"`;
  try {
    const result = await model.generateContent(prompt);
    // Assume the result is a list of image descriptions
    return result.response.text().trim().split('\n');
  } catch (error) {
    console.error('Error generating images:', error);
    throw new Error('Failed to generate images');
  }
};

exports.generateVoiceover = async (text, language) => {
  // Placeholder for voiceover generation using Sarvam APIs
  // You need to integrate Sarvam's TTS API here
  try {
    // Implement the API call to Sarvam's TTS service
    const voiceoverUrl = await sarvamTTS(text, language);
    return [voiceoverUrl];
  } catch (error) {
    console.error('Error generating voiceover:', error);
    throw new Error('Failed to generate voiceover');
  }
};

// Placeholder function for Sarvam TTS API integration
const sarvamTTS = async (text, language) => {
  // Implement the API call
  return 'voiceover_url_placeholder';
};
