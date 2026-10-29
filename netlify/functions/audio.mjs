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

  try {
    const { text, gender = 'female' } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Texto ausente para geração de áudio.' }), {
        status: 400,
        headers,
      });
    }

    const cleanText = text.trim();

    // Divide texto em frases curtas se exceder 120 caracteres para garantir qualidade da síntese
    const chunks = [];
    if (cleanText.length <= 120) {
      chunks.push(cleanText);
    } else {
      const parts = cleanText.split(/([.?!,;:]+)/).filter(Boolean);
      let current = '';
      for (const part of parts) {
        if ((current + part).length > 120 && current.trim()) {
          chunks.push(current.trim());
          current = part;
        } else {
          current += part;
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }

    const audioBuffers = [];
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        },
      });

      if (!res.ok) {
        throw new Error(`Falha no serviço de voz (${res.status})`);
      }

      const arrayBuffer = await res.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }

    const finalBuffer = Buffer.concat(audioBuffers);
    const audioBase64 = finalBuffer.toString('base64');

    return new Response(JSON.stringify({
      audioBase64,
      mimeType: 'audio/mpeg',
      gender,
      durationHint: cleanText.split(/\s+/).length * 0.4 + 0.8,
    }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
};
