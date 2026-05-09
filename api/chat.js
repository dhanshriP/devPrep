export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages,
        ],
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      return res.status(groqRes.status).json({ error: errBody });
    }

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
