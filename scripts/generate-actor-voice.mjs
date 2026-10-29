import { writeFileSync } from 'node:fs';

const defaultKey = process.env.GEMINI_LIVE_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${key}`;

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

export async function generateActorVoice(text, character = 'Personagem', emotion = 'neutro', voiceName = 'Aoede', apiKey = defaultKey) {
  const activeKey = apiKey || defaultKey;
  if (!activeKey) throw new Error('Chave Gemini Live não fornecida.');
  const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${activeKey}`;
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
                text: `Você é uma atriz/ator profissional de dublagem de telenovela dramática brasileira. Fale em português do Brasil com a emoção solicitada. Diga APENAS o texto a seguir, sem nenhuma saudação, comentário ou introdução:\n\n[Personagem: ${character}]\n[Emoção: ${emotion}]\nTexto: "${text}"`
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

// Test direct execution
if (process.argv[1]?.endsWith('generate-actor-voice.mjs')) {
  console.log('Testando geração com voz de ator no Gemini Live...');
  const t0 = Date.now();
  generateActorVoice(
    'Aqui você limpa o chão. Não levanta a cabeça pra mim!',
    'Valéria',
    'fria, com profundo desprezo e arrogância',
    'Aoede'
  ).then(wav => {
    console.log(`Sucesso em ${Date.now() - t0}ms! Arquivo WAV gerado: ${wav.length} bytes`);
    writeFileSync('test_valeria_gemini_live.wav', wav);
    console.log('Salvo em test_valeria_gemini_live.wav');
  }).catch(err => {
    console.error('Erro:', err);
  });
}
