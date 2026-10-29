import { Client } from '@gradio/client';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
    const {
      firstFrameImageBase64,
      frameBase64,
      imageBase64,
      prompt = 'realistic cinematic shot, slow subtle natural movement',
      durationSeconds = 4,
      width = 512,
      height = 704
    } = await req.json();

    const rawImage = firstFrameImageBase64 || frameBase64 || imageBase64;
    if (!rawImage) {
      return new Response(JSON.stringify({ error: 'Quadro inicial ausente para gerar vídeo.' }), {
        status: 400,
        headers,
      });
    }

    let b64 = rawImage;
    const idx = b64.indexOf(';base64,');
    if (idx >= 0) b64 = b64.slice(idx + 8);
    const buf = Buffer.from(b64.replace(/\s/g, ''), 'base64');
    const imageBlob = new Blob([buf], { type: 'image/jpeg' });

    const safeDuration = Math.min(6, Math.max(2, Number(durationSeconds) || 4));
    const safePrompt = String(prompt).trim() || 'dramatic novela scene, natural character motion';

    const app = await Client.connect('Lightricks/ltx-video-distilled');
    const result = await app.predict('/image_to_video', [
      safePrompt,
      'worst quality, inconsistent motion, blurry, jittery, distorted, extra limbs',
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
      throw new Error('A GPU em nuvem não retornou o vídeo.');
    }

    const fetchRes = await fetch(videoUrl);
    if (!fetchRes.ok) {
      throw new Error(`Falha ao baixar vídeo da GPU (${fetchRes.status})`);
    }

    const arrayBuffer = await fetchRes.arrayBuffer();
    const videoBase64 = Buffer.from(arrayBuffer).toString('base64');
    const mediaId = `vid_${Date.now()}`;

    return new Response(JSON.stringify({
      base64: `data:video/mp4;base64,${videoBase64}`,
      mimeType: 'video/mp4',
      mediaId,
      durationSeconds: safeDuration
    }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
};
