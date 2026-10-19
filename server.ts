import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Invitation Wording Generator Endpoint
  app.post('/api/ai-invite', async (req, res) => {
    try {
      const { occasion, hosts, tone, details } = req.body;
      const prompt = `You are an expert invitation copywriter and event designer.
Create gorgeous, elegant, poetic, and heartwarming digital invitation wording for a ${occasion || 'celebration'}.
Hosts / Honorees: ${hosts || 'Aarav & Meera'}
Tone / Style: ${tone || 'Romantic & Warm'}
Additional Context: ${details || 'A joyous celebration with family and friends.'}

Return a valid JSON object (without markdown code blocks) with the following exact keys:
- "title": main headline name (e.g. "Aarav & Meera" or "Sophia's 30th")
- "eyebrow": small top banner kicker (e.g. "Together with their families")
- "tagline": subtitle invitation phrase (e.g. "invite you to celebrate their wedding")
- "message": a warm, touching paragraph inviting guests
- "dressCode": recommended attire (e.g. "Black Tie / Elegant Traditional")
- "eventsTitle": section heading for events (e.g. "Celebration Schedule")
- "eventsText": 2-3 events formatted with # headings and | separators, e.g.:
# Day 1
Mehendi Night | 11 Dec, 4 PM | Garden Lawn
# Day 2
Wedding Ceremony | 12 Dec, 6 PM | Grand Palace
Reception | 12 Dec, 9 PM | Ballroom
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      // Clean up markdown block if present
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleaned);
      res.json(data);
    } catch (error: any) {
      console.error('Gemini AI error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI invitation wording' });
    }
  });

  // AI Translation Endpoint for Indian Languages
  app.post('/api/translate', async (req, res) => {
    try {
      const { config, targetLanguage } = req.body;
      if (!targetLanguage || targetLanguage === 'en') {
        return res.json(config);
      }

      const sanitizeForTranslation = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) {
          return obj.map(item => typeof item === 'string' && (item.startsWith('data:') || item.length > 200) ? '[IMAGE]' : sanitizeForTranslation(item));
        }
        const sanitized: any = {};
        for (const [key, val] of Object.entries(obj)) {
          if (
            (key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('bg')) &&
            typeof val === 'string' &&
            (val.startsWith('data:') || val.length > 200)
          ) {
            sanitized[key] = '[IMAGE]';
          } else if (Array.isArray(val) && (key === 'gallery' || key === 'slides')) {
            sanitized[key] = val.map(item => typeof item === 'string' ? '[IMAGE]' : sanitizeForTranslation(item));
          } else {
            sanitized[key] = sanitizeForTranslation(val);
          }
        }
        return sanitized;
      };

      const cleanConfigForAI = sanitizeForTranslation(config);

      const prompt = `You are an expert professional translator specializing in Indian languages and festive event invitations.
Translate all human-readable text values inside the following JSON invitation configuration object into ${targetLanguage}.
Maintain the exact JSON structure, keys, numbers, URLs, and formatting markers (such as # and |). Only translate titles, descriptions, messages, event names, locations, and labels into natural, culturally warm, and polished ${targetLanguage}. Keep '[IMAGE]' placeholders exactly as they are.

Input JSON:
${JSON.stringify(cleanConfigForAI, null, 2)}

Return ONLY the translated JSON object without any markdown code blocks or additional text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const translatedData = JSON.parse(cleaned);

      const restoreImages = (translated: any, original: any): any => {
        if (!translated || typeof translated !== 'object') return original;
        if (Array.isArray(translated)) {
          return translated.map((item, idx) => restoreImages(item, original?.[idx]));
        }
        const restored: any = { ...translated };
        for (const [key, val] of Object.entries(original || {})) {
          if (
            (key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('bg')) ||
            val === '[IMAGE]' ||
            (typeof val === 'string' && val.startsWith('data:'))
          ) {
            restored[key] = val;
          } else if (typeof val === 'object' && val !== null && restored[key] && original[key]) {
            restored[key] = restoreImages(restored[key], original[key]);
          }
        }
        return restored;
      };

      const finalTranslatedConfig = restoreImages(translatedData, config);
      res.json(finalTranslatedConfig);
    } catch (error: any) {
      console.error('Translation error:', error);
      res.status(500).json({ error: error.message || 'Translation failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
