import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google Gen AI SDK (only if the key is present)
let ai;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here') {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

/**
 * Calls Gemini to analyze the time and space complexity of a code snippet.
 * Uses structured output to force Gemini to return exactly the JSON we need.
 */
export const analyzeComplexity = async (code, language) => {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured or missing on the server.');
  }

  const prompt = `Analyze the following ${language || 'programming'} code and determine its time and space complexity.

IMPORTANT INSTRUCTIONS:
- Use conventional complexity analysis as typically used in software engineering technical interviews.
- Treat standard library hash-based structures (e.g., unordered_set, unordered_map, HashMap, dict, HashSet) using their typically cited average-case complexity of O(1) for insertions and lookups.
- Default to this O(1) average-case reasoning for hash structures unless the code explicitly uses a tree-based structure (e.g., std::set, TreeMap) where O(log N) should be noted, or if precision regarding worst-case hash collisions is explicitly requested.

Return a structured JSON object containing:
- language (auto-detect if missing)
- currentTimeComplexity: The dominant time complexity of the current code.
- currentSpaceComplexity: The dominant space complexity of the current code.
- suggestedTimeComplexity: The optimal possible time complexity for this problem/algorithm.
- suggestedSpaceComplexity: The optimal possible space complexity for this problem/algorithm.
- suggestions: A short, encouraging message explaining if it's already optimal, or how it could be improved (e.g. "Perfect efficiency! Your solution already achieves the optimal time and space complexity." or "You can optimize this to O(N) by using a hash map instead of a nested loop.")

Code to analyze:
\`\`\`
${code}
\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: {
              type: Type.STRING,
              description: 'The programming language of the code snippet.',
            },
            currentTimeComplexity: {
              type: Type.STRING,
              description: 'The dominant time complexity in Big O notation (e.g., O(N)). Use capital N.',
            },
            currentSpaceComplexity: {
              type: Type.STRING,
              description: 'The dominant space complexity in Big O notation (e.g., O(1)).',
            },
            suggestedTimeComplexity: {
              type: Type.STRING,
              description: 'The optimal possible time complexity for this logic in Big O notation (e.g., O(N)).',
            },
            suggestedSpaceComplexity: {
              type: Type.STRING,
              description: 'The optimal possible space complexity for this logic in Big O notation.',
            },
            suggestions: {
              type: Type.STRING,
              description: 'A 2-3 sentence suggestion on how to improve the code, or praise if it is already optimal.',
            },
          },
          required: ['language', 'currentTimeComplexity', 'currentSpaceComplexity', 'suggestedTimeComplexity', 'suggestedSpaceComplexity', 'suggestions'],
        },
      },
    });

    if (response.text) {
      let text = response.text;
      // Robust JSON extraction in case the model outputs conversational text before/after
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
      }
      
      return JSON.parse(text);
    } else {
      throw new Error('No text returned from Gemini API.');
    }
  } catch (error) {
    console.error('Error in analyzeComplexity:', error);
    throw error;
  }
};
