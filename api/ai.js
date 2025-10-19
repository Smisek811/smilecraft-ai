// api/ai.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing API key on server' });

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error || 'OpenAI error' });

    res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'Bez odpovědi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
