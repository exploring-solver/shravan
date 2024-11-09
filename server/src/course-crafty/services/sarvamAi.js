const axios = require('axios');

exports.generateVoiceover = async (text, language) => {
  try {
    const response = await axios.post('https://sarvam-api-url/tts', {
      text,
      language,
    });
    return [response.data.audioUrl];
  } catch (error) {
    console.error('Error generating voiceover:', error);
    throw new Error('Failed to generate voiceover');
  }
};
