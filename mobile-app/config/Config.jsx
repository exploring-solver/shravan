// Config.jsx

export const backendUrl = "https://bylexa.onrender.com";
// export const backendUrl = process.env.EXPO_PUBLIC_API_URL;
export const apiKey = process.env.EXPO_PUBLIC_API_KEY;
export const authDomain = process.env.EXPO_PUBLIC_AUTH_DOMAIN;
export const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
export const sarvamAiKey = process.env.EXPO_PUBLIC_SARVAM_AI_KEY;

const Config = {
    backendUrl,
    apiKey,
    authDomain,
    projectId,
    sarvamAiKey
};

export default Config;
