/**
 * Vercel Serverless Function: /api/chat
 * Securely relays prompts to 9Router AI without exposing API secrets to the client.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.NINE_ROUTER_API_KEY;
  const model = process.env.NINE_ROUTER_MODEL || 'gpt-4o-mini';
  const baseUrl = process.env.NINE_ROUTER_BASE_URL || 'https://api.9router.com/v1';

  if (!apiKey) {
    return res.status(503).json({
      error: '9Router API key not configured in environment (NINE_ROUTER_API_KEY).',
      code: 'API_KEY_MISSING'
    });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing messages array in request body.' });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are REPLATE AI, an expert educational assistant for the REPLATE food surplus decision and rescue platform.
Tagline: "Give Surplus Food Another Route."
Core statement: "Food should move. Not waste."
Topic scope: Food surplus logistics, supply chain loss prevention, food recovery hierarchies (FAO/EPA), food banking, commercial kitchen portioning, cold-chain safety.

Important principles:
1. The core REPLATE Rescue Score and Route determination are deterministic rule-based engines. You explain their factors and underlying science, but you do not pretend you made the scores up.
2. Safety first: remind users that user reports provide decision support and do not replace formal food-safety inspections or temperature controls.
3. Be concise, editorial, structured, and practical. Avoid generic filler.`
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        temperature: 0.4,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[REPLATE 9Router] Upstream error:', response.status, errText);
      return res.status(response.status).json({
        error: `Upstream AI provider error (${response.status})`,
        code: 'UPSTREAM_ERROR'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[REPLATE 9Router] Exception:', error);
    return res.status(500).json({
      error: 'Internal server error communicating with AI service.',
      code: 'SERVER_EXCEPTION'
    });
  }
}
