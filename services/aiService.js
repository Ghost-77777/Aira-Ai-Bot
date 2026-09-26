import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAIResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('AI Service Detailed Error:', error);
    return 'Maaf kijiye, AI response generate karne mein koi problem aa gayi hai.';
  }
}
