/**
 * Calls our own /api/chat serverless function,
 * which proxies to Groq and keeps the API key server-side.
 */
export async function callLLM(userPrompt, systemPrompt = '') {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.content;
}

/**
 * Safely parses JSON from LLM output,
 * stripping markdown code fences if present.
 */
export function safeParseJSON(raw) {
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
