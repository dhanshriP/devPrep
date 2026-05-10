/**
 * Calls our own /api/chat serverless function,
 * which proxies to Groq and keeps the API key server-side.
 */
export async function callLLM(userPrompt, systemPrompt = '') {
  try {
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
    if (!data || !data.content) {
      throw new Error("Empty response from AI service");
    }
    return data.content;
  } catch (error) {
    console.error("LLM Call Failed:", error);
    throw error;
  }
}

/**
 * Safely parses JSON from LLM output.
 * Uses a robust regex/substring approach to find the JSON block even if the AI adds prose.
 */
export function safeParseJSON(raw) {
  if (!raw) throw new Error("No data received from AI");
  
  let clean = raw.trim();
  
  // Try to find the first '{' or '[' and last '}' or ']'
  const startBrace = clean.indexOf('{');
  const startBracket = clean.indexOf('[');
  let startIndex = -1;
  let mode = '';

  if (startBrace !== -1 && (startBracket === -1 || startBrace < startBracket)) {
    startIndex = startBrace;
    mode = 'object';
  } else if (startBracket !== -1) {
    startIndex = startBracket;
    mode = 'array';
  }

  if (startIndex !== -1) {
    const lastIndex = mode === 'object' ? clean.lastIndexOf('}') : clean.lastIndexOf(']');
    if (lastIndex !== -1) {
      const jsonStr = clean.substring(startIndex, lastIndex + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (parseErr) {
        console.error("Partial JSON Parse Failure. Extracted:", jsonStr);
      }
    }
  }

  // Fallback to direct parse
  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("Final JSON Parse Failure. Raw content:", raw);
    throw new Error("AI response format was invalid. Please try another session.");
  }
}
