import { Client } from '@gradio/client';
import { writeFileSync, existsSync } from 'node:fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Gera um vídeo real de IA (Image-to-Video) com movimento humano e cinematográfico.
 * Custo: 0 créditos (executa em GPU de nuvem gratuita).
 *
 * @param {Object} options
 * @param {Buffer|Blob|string} options.image - Imagem (Buffer, Blob ou base64)
 * @param {string} options.prompt - Direção visual da tomada
 * @param {number} [options.durationSeconds=4] - Duração do vídeo (3 a 6 segundos)
 * @param {number} [options.width=512]
 * @param {number} [options.height=704]
 * @returns {Promise<{ videoBuffer: Buffer, mimeType: string, durationSeconds: number }>}
 */
export async function generateAiVideo({
  image,
  prompt,
  durationSeconds = 4,
  width = 512,
  height = 704
}) {
  let imageBlob;
  if (image instanceof Blob) {
    imageBlob = image;
  } else if (Buffer.isBuffer(image)) {
    imageBlob = new Blob([image], { type: 'image/jpeg' });
  } else if (typeof image === 'string') {
    let b64 = image;
    const idx = b64.indexOf(';base64,');
    if (idx >= 0) b64 = b64.slice(idx + 8);
    const buf = Buffer.from(b64.replace(/\s/g, ''), 'base64');
    imageBlob = new Blob([buf], { type: 'image/jpeg' });
  } else {
    throw new Error('Formato de imagem inválido para geração de vídeo.');
  }

  const cleanPrompt = String(prompt || 'realistic cinematic scene, subtle natural movement of people, dramatic lighting').trim();
  const safeDuration = Math.min(6, Math.max(2, Number(durationSeconds) || 4));

  console.log(`[AI-Video] Conectando ao motor em nuvem gratuito (LTX-Video)...`);
  const app = await Client.connect('Lightricks/ltx-video-distilled');

  console.log(`[AI-Video] Renderizando clipe de ${safeDuration}s com GPU gratuita...`);
  const result = await app.predict('/image_to_video', [
    cleanPrompt,
    'worst quality, inconsistent motion, blurry, jittery, distorted, extra limbs, bad anatomy, cartoon',
    imageBlob,
    null,
    height,
    width,
    'image-to-video',
    safeDuration,
    9,
    Math.floor(Math.random() * 100000),
    true,
    1.2,
    true
  ]);

  const videoObj = result?.data?.[0]?.video;
  const videoUrl = videoObj?.url;
  if (!videoUrl) {
    throw new Error('O motor de vídeo não retornou o arquivo esperado.');
  }

  console.log(`[AI-Video] Baixando clipe MP4 gerado: ${videoUrl}`);
  const fetchRes = await fetch(videoUrl);
  if (!fetchRes.ok) {
    throw new Error(`Falha ao transferir o vídeo da GPU (${fetchRes.status})`);
  }

  const arrayBuffer = await fetchRes.arrayBuffer();
  const videoBuffer = Buffer.from(arrayBuffer);

  return {
    videoBuffer,
    mimeType: 'video/mp4',
    durationSeconds: safeDuration
  };
}

// Teste direto via CLI
if (process.argv[1]?.endsWith('generate-ai-video.mjs')) {
  console.log('Testando generateAiVideo...');
  const testImg = 'test_shot1_frame.jpg';
  if (!existsSync(testImg)) {
    console.error('Arquivo test_shot1_frame.jpg não encontrado para o teste.');
    process.exit(1);
  }
  const { readFileSync } = await import('node:fs');
  const buf = readFileSync(testImg);
  generateAiVideo({
    image: buf,
    prompt: 'Valéria olha com desdém, movimento dramático e realista de novela',
    durationSeconds: 4
  }).then(({ videoBuffer, mimeType }) => {
    console.log(`Sucesso! Vídeo MP4 gerado: ${videoBuffer.length} bytes (${mimeType})`);
    writeFileSync('test_output_ai_video.mp4', videoBuffer);
  }).catch(err => {
    console.error('Falha no teste:', err);
  });
}
