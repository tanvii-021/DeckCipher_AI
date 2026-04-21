export default async function handler(req, res) {
  // CORS Headers for cross-origin requests (if the frontend is on a different domain)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // 1. Get the NVIDIA API Key
    // If the frontend sent a custom key, use it. Otherwise, use the environment variable.
    const authHeader = req.headers.authorization;
    let apiKey = '';
    
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 20) {
      apiKey = authHeader.split(' ')[1];
    } else {
      apiKey = process.env.NVIDIA_API_KEY;
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Server Configuration Error: No NVIDIA_API_KEY provided by client or Vercel environment." 
      });
    }

    // 2. Extract payload
    const { model, messages, temperature, max_tokens } = req.body;

    // 3. Forward request to NVIDIA
    const nvidiaResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'meta/llama-3.3-70b-instruct',
        messages: messages,
        temperature: temperature || 0.2,
        max_tokens: max_tokens || 1024,
      }),
    });

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text();
      return res.status(nvidiaResponse.status).send(`NVIDIA API Error: ${errorText}`);
    }

    // 4. Return NVIDIA's response to the client
    const data = await nvidiaResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Vercel API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
