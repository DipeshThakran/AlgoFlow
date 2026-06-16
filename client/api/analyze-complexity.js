import { GoogleGenAI, Type } from '@google/genai';

let ai;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here') {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, language } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Valid code snippet is required.' });
  }

  if (!ai) {
    return res.status(500).json({ error: 'Server misconfiguration: API key is missing. Add GEMINI_API_KEY to your Vercel Environment Variables.' });
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
            language: { type: Type.STRING, description: 'The programming language of the code snippet.' },
            currentTimeComplexity: { type: Type.STRING, description: 'The dominant time complexity in Big O notation (e.g., O(N)). Use capital N.' },
            currentSpaceComplexity: { type: Type.STRING, description: 'The dominant space complexity in Big O notation (e.g., O(1)).' },
            suggestedTimeComplexity: { type: Type.STRING, description: 'The optimal possible time complexity for this logic in Big O notation (e.g., O(N)).' },
            suggestedSpaceComplexity: { type: Type.STRING, description: 'The optimal possible space complexity for this logic in Big O notation.' },
            suggestions: { type: Type.STRING, description: 'A 2-3 sentence suggestion on how to improve the code, or praise if it is already optimal.' },
          },
          required: ['language', 'currentTimeComplexity', 'currentSpaceComplexity', 'suggestedTimeComplexity', 'suggestedSpaceComplexity', 'suggestions'],
        },
      },
    });

    if (response.text) {
      let text = response.text;
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
      }
      
      return res.status(200).json(JSON.parse(text));
    } else {
      return res.status(500).json({ error: 'No text returned from Gemini API.' });
    }
  } catch (error) {
    console.error('Error in analyzeComplexity:', error);
    if (error.message && error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({ error: 'Server misconfiguration: API key is missing.' });
    }
    return res.status(500).json({ error: 'Failed to analyze code complexity. Please try again later.' });
  }
}
