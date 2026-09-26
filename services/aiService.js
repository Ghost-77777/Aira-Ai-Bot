import { GoogleGenAI } from '@google/genai';

// Yeh code seedha aapki Google AI Studio wali GEMINI_API_KEY ko use karega
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export async function getAIResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } code catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('AI processing failed');
  }
}
