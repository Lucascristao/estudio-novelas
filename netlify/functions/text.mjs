export default async (req) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY não configurada no Netlify.' }), {
      status: 500,
      headers,
    });
  }

  try {
    const { prompt, systemInstruction } = await req.json();

    // Modelos ativos confirmados no painel do usuário
    const models = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
    let lastError = null;

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      // Tenta até 2 vezes se houver pico de demanda (503) ou cota (429)
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            return new Response(JSON.stringify({ text }), { headers });
          }

          const errText = await res.text();
          lastError = errText;
          if (res.status === 429 || res.status === 503) {
            await new Promise(r => setTimeout(r, 1500));
            continue;
          } else {
            break;
          }
        } catch (fetchErr) {
          lastError = fetchErr.message;
        }
      }
    }

    return new Response(JSON.stringify({ error: `Instabilidade temporária na Google AI: ${lastError}` }), {
      status: 502,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
};
