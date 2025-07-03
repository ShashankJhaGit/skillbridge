// gemini-proxy.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 1. Put your Gemini API key here:
const GEMINI_API_KEY = 'AIzaSyDextssogJdn7qqOXjz1sYZoJN8GjZntJw';

app.post('/api/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    // Log the full response for debugging
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    if (!response.ok) {
      // Log error details
      console.error('Gemini API error:', response.status, response.statusText, data);
      res.status(response.status).json(data);
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error('Proxy server error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Gemini proxy running on http://localhost:${PORT}`));