import { Router } from 'express';
import { analyzeComplexity } from '../lib/gemini.js';

const router = Router();

router.post('/analyze-complexity', async (req, res) => {
  const { code, language } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Valid code snippet is required.' });
  }

  try {
    const result = await analyzeComplexity(code, language);
    res.json(result);
  } catch (error) {
    console.error('Complexity analysis API error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({ error: 'Server misconfiguration: API key is missing.' });
    }
    
    res.status(500).json({ error: 'Failed to analyze code complexity. Please try again later.' });
  }
});

export default router;
