import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleCsvData = async (topic: string): Promise<string> => {
  try {
    const prompt = `
      Generate a valid CSV string with 6 rows of data (including headers) about the following topic: "${topic}".
      Strictly return ONLY the CSV raw string. 
      Do not include markdown code blocks (e.g., \`\`\`csv).
      Do not include any introductory text.
      Ensure the data is realistic and varied.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    // Clean up any potential markdown formatting just in case
    return text.replace(/```csv/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error("Failed to generate sample data:", error);
    throw error;
  }
};
