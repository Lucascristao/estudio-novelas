const FALLBACK_KEY = process.env.GEMINI_LIVE_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

function pcmToWav(pcmData, sampleRate = 24000) {
  const wavHeader = Buffer.alloc(44);
  const dataLen = pcmData.length;
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + dataLen, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20); // PCM
  wavHeader.writeUInt16LE(1, 22); // mono
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(sampleRate * 2, 28);
  wavHeader.writeUInt16LE(2, 32);
  wavHeader.writeUInt16LE(16, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataLen, 40);
  return Buffer.concat([wavHeader, pcmData]);
}

async function generateLiveVoice({ text, character = 'Personagem', emotion = '', gender = 'female', apiKey }) {
  const key = (apiKey && apiKey.startsWith('AQ.')) ? apiKey : (process.env.GEMINI_LIVE_API_KEY || FALLBACK_KEY);
  const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${key}`;
  
  // Mapeamento de vozes dramáticas
  // Aoede: voz feminina madura, imponente, excelente para vilãs e patroas
  // Kore: voz feminina jovem, suave, excelente para protagonistas doces e humilhadas
  // Fenrir: voz masculina madura, forte
  // Puck: voz masculina jovem
  let voiceName = 'Aoede';
  if (gender === 'male') {
    voiceName = 'Fenrir';
  } else if (emotion.toLowerCase().includes('humild') || emotion.toLowerCase().includes('choro') || emotion.toLowerCase().includes('trêmul') || emotion.toLowerCase().includes('medo') || character.toLowerCase().includes('rosa')) {
    voiceName = 'Kore';
  }

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const chunks = [];
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('Timeout ao conectar com Gemini Live'));
    }, 15000);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        setup: {
          model: 'models/gemini-3.8-live',
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        }
      }));
    };

    ws.onmessage = async (event) => {
      let str = '';
      if (typeof event.data === 'string') {
        str = event.data;
      } else if (event.data && typeof event.data.text === 'function') {
        str = await event.data.text();
      } else if (Buffer.isBuffer(event.data)) {
        str = event.data.toString('utf8');
      } else {
        str = String(event.data);
      }
      
      const msg = JSON.parse(str);
      if (msg.setupComplete) {
        ws.send(JSON.stringify({
          clientContent: {
            turns: [{
              role: 'user',
              parts: [{
                text: `Você é uma atriz/ator profissional de dublagem de telenovela dramática brasileira. Fale em português do Brasil com a emoção solicitada. Diga APENAS a fala a seguir, sem introduções, comentários ou saudações:\n\n[Personagem: ${character}]\n[Emoção: ${emotion || 'dramática'}]\nFala: "${text}"`
              }]
            }],
            turnComplete: true
          }
        }));
      } else if (msg.serverContent) {
        const parts = msg.serverContent.modelTurn?.parts || [];
        for (const p of parts) {
          if (p.inlineData?.data) {
            chunks.push(Buffer.from(p.inlineData.data, 'base64'));
          }
        }
        if (msg.serverContent.turnComplete) {
          clearTimeout(timeout);
          ws.close();
          const pcm = Buffer.concat(chunks);
          const wav = pcmToWav(pcm, 24000);
          resolve(wav);
        }
      }
    };

    ws.onerror = (e) => {
      clearTimeout(timeout);
      reject(e);
    };
  });
}

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
    const { text, character = 'Personagem', emotion = '', gender = 'female', apiKey } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Texto ausente para geração de áudio.' }), {
        status: 400,
        headers,
      });
    }

    const cleanText = text.trim();

    // 1. Tentar gerar voz humana dramática com Gemini Live API
    try {
      const wavBuffer = await generateLiveVoice({ text: cleanText, character, emotion, gender, apiKey });
      const audioBase64 = wavBuffer.toString('base64');
      const durationSeconds = (wavBuffer.length - 44) / (24000 * 2);

      return new Response(JSON.stringify({
        audioBase64,
        mimeType: 'audio/wav',
        gender,
        character,
        engine: 'gemini-live',
        durationHint: durationSeconds,
      }), { headers });
    } catch (liveErr) {
      console.warn('Fallback para síntese básica devido a erro no Live API:', liveErr.message);
    }

    // 2. Fallback de contingência caso Live API esteja indisponível
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
      engine: 'tts-fallback',
      durationHint: cleanText.split(/\s+/).length * 0.4 + 0.8,
    }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
};
