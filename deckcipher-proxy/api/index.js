const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes (this allows GitHub Pages to talk to this proxy)
app.use(cors());
app.use(express.json());

app.post('/api', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const { model, messages, temperature, max_tokens } = req.body;
    
    // The NVIDIA API Key should be stored in Vercel Environment Variables
    const nvidiaApiKey = process.env.NVIDIA_API_KEY;
    
    if (!nvidiaApiKey) {
      return res.status(500).json({ error: "Server Configuration Error: NVIDIA_API_KEY is not set in the Vercel environment." });
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaApiKey}`,
      },
      body: JSON.stringify({
        model: model || 'meta/llama-3.3-70b-instruct',
        messages: messages,
        temperature: temperature || 0.2,
        max_tokens: max_tokens || 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(`NVIDIA API Error: ${errorText}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
}

module.exports = app;
