// Cache em memória para mídias carregadas na sessão
const mediaCache = new Map();

/**
 * Anima uma imagem do storyboard com movimento de câmera cinematográfico (Ken Burns)
 * e sintetiza a fala com voz brasileira no navegador via Web Audio e MediaRecorder.
 * Custo: 0 créditos.
 */
async function animateShotToVideo({
  imageBase64,
  durationSeconds = 6,
  dialogueLine = '',
  speakerName = '',
  emotion = '',
  cameraMovement = 'Panorâmica Lenta',
  aspectRatio = '9:16',
  gender = 'female',
}) {
  const duration = Math.max(3, Math.min(12, Number(durationSeconds) || 6));
  const isVertical = aspectRatio === '9:16' || aspectRatio === '3:4';
  const width = isVertical ? 720 : 1280;
  const height = isVertical ? 1280 : 720;

  // 1. Carregar a imagem
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Não foi possível carregar a imagem do quadro para animação.'));
    img.src = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
  });

  // 2. Obter áudio da fala (se houver fala na tomada)
  let audioBuffer = null;
  let audioCtx = null;
  const cleanLine = String(dialogueLine || '').trim();

  if (cleanLine) {
    try {
      const audioEndpoint = window.location.hostname.includes('netlify.app')
        ? '/.netlify/functions/audio'
        : '/api/generate/audio';

      const audioRes = await fetch(audioEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanLine, character: speakerName, gender, emotion }),
      });

      if (audioRes.ok) {
        const data = await audioRes.json();
        if (data.audioBase64) {
          const binary = atob(data.audioBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
        }
      }
    } catch (audioErr) {
      console.warn('Falha na obtenção do áudio da fala, prosseguindo com vídeo sem áudio:', audioErr);
    }
  }

  // 3. Configurar Canvas para renderização
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 4. Configurar MediaStream com vídeo + áudio
  let stream;
  let audioDest = null;
  let sourceNode = null;

  if (audioCtx && audioBuffer) {
    audioDest = audioCtx.createMediaStreamDestination();
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;

    // Ajuste de entonação por personagem/emoção
    if (gender === 'male') {
      sourceNode.playbackRate.value = 0.86;
    } else if (/fria|imponente|autorit|patroa|vilã/i.test(emotion || '')) {
      sourceNode.playbackRate.value = 0.96; // Valéria / antagonista: tom mais firme e imponente
    } else {
      sourceNode.playbackRate.value = 1.03; // Rosa / protagonista: tom emotivo natural
    }

    sourceNode.connect(audioDest);

    const canvasStream = canvas.captureStream(30);
    const audioTracks = audioDest.stream.getAudioTracks();
    stream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);
  } else {
    stream = canvas.captureStream(30);
  }

  // Determinar o formato de gravação suportado pelo navegador
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const chosenMime = candidates.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';

  const recorder = new MediaRecorder(stream, {
    mimeType: chosenMime,
    videoBitsPerSecond: 2500000,
  });

  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  // 5. Determinar o tipo de movimento de câmera
  const moveStr = String(cameraMovement || '').toLowerCase();
  let moveType = 'zoom_in';
  if (moveStr.includes('pan') || moveStr.includes('lateral') || moveStr.includes('travelling')) {
    moveType = 'pan';
  } else if (moveStr.includes('afast') || moveStr.includes('zoom out')) {
    moveType = 'zoom_out';
  } else if (moveStr.includes('fixa') || moveStr.includes('estático')) {
    moveType = 'static';
  } else {
    moveType = 'zoom_in'; // Dolly In suave (padrão dramático de novelas)
  }

  const durationMs = duration * 1000;
  const startTime = performance.now();

  recorder.start(100);

  // Inicia o áudio aos 400ms para criar a pausa dramática inicial da cena
  if (sourceNode) {
    setTimeout(() => {
      try { sourceNode.start(); } catch (_) {}
    }, 400);
  }

  // 6. Loop de animação dos quadros com Ken Burns
  await new Promise((resolve) => {
    function draw() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Suavização senoidal (ease-in-out suave)
      const t = 0.5 - 0.5 * Math.cos(progress * Math.PI);

      let scale = 1.0;
      let offsetX = 0;
      let offsetY = 0;

      if (moveType === 'zoom_in') {
        scale = 1.0 + t * 0.14;
        offsetY = -(height * (scale - 1)) * 0.35; // Mantém o foco no terço superior (rostos)
      } else if (moveType === 'zoom_out') {
        scale = 1.14 - t * 0.14;
        offsetY = -(height * (scale - 1)) * 0.35;
      } else if (moveType === 'pan') {
        scale = 1.08;
        offsetX = (t - 0.5) * (width * 0.08);
        offsetY = -(height * (scale - 1)) * 0.3;
      } else {
        // Câmera sutilmente viva
        scale = 1.0 + t * 0.03;
        offsetY = -(height * (scale - 1)) * 0.3;
      }

      ctx.save();
      ctx.fillStyle = '#0b0d12';
      ctx.fillRect(0, 0, width, height);

      // Calcular dimensões "cover" preservando a proporção da imagem
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let drawW, drawH;
      if (imgRatio > canvasRatio) {
        drawH = height;
        drawW = height * imgRatio;
      } else {
        drawW = width;
        drawH = width / imgRatio;
      }

      const cx = width / 2 + offsetX;
      const cy = height / 2 + offsetY;
      const finalW = drawW * scale;
      const finalH = drawH * scale;

      ctx.drawImage(img, cx - finalW / 2, cy - finalH / 2, finalW, finalH);

      // Vinheta cinematográfica sutil (estilo drama de TV)
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.35,
        width / 2, height / 2, width * 0.85
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      if (elapsed < durationMs) {
        requestAnimationFrame(draw);
      } else {
        recorder.onstop = () => {
          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close().catch(() => {});
          }
          resolve();
        };
        recorder.stop();
      }
    }

    requestAnimationFrame(draw);
  });

  // 7. Converter o resultado para Base64 e Blob URL (para reprodução fluida no navegador)
  const videoBlob = new Blob(chunks, { type: chosenMime });
  const blobUrl = URL.createObjectURL(videoBlob);
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(videoBlob);
  });

  return {
    base64,
    url: blobUrl,
    mimeType: chosenMime.split(';')[0],
    mediaId: `vid_${Date.now()}`,
  };
}

export const CodespacesSDK = {
  upload: async ({ base64, mimeType = 'image/jpeg', name }) => {
    const mediaId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    mediaCache.set(mediaId, { base64, mimeType, name });
    return { mediaId, base64, mimeType, name };
  },

  download: async ({ filename, mimeType, base64, bytes }) => {
    let finalBytes = bytes;
    if (!finalBytes && base64) {
      const cleanB64 = base64.replace(/^data:[^,]+;base64,/, '');
      const binary = atob(cleanB64);
      finalBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) finalBytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([finalBytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { ok: true };
  },

  generate: {
    text: async (prompt, options = {}) => {
      const endpoint = window.location.hostname.includes('netlify.app')
        ? '/.netlify/functions/text'
        : '/api/generate/text';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction: options.systemInstruction }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Erro na comunicação com a IA (${res.status})`);
      }
      return await res.json();
    },

    image: async ({ prompt, aspectRatio = '9:16' }) => {
      let width = 720, height = 1280;
      if (aspectRatio === '16:9') { width = 1280; height = 720; }
      else if (aspectRatio === '1:1') { width = 1024; height = 1024; }
      else if (aspectRatio === '3:4') { width = 768; height = 1024; }
      else if (aspectRatio === '4:3') { width = 1024; height = 768; }

      const seed = Math.floor(Math.random() * 10000000);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

      const imgRes = await fetch(url);
      if (!imgRes.ok) throw new Error(`Falha ao gerar imagem: ${imgRes.status}`);

      const blob = await imgRes.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const mediaId = `img_${Date.now()}_${seed}`;
      mediaCache.set(mediaId, { base64, mimeType: 'image/jpeg' });

      return {
        base64,
        mimeType: 'image/jpeg',
        mediaId,
      };
    },

    video: async (params) => {
      // 1. Resgatar imagem do quadro
      let imageBase64 = params.firstFrameImageBase64
        || params.shot?.generatedImageBase64
        || params.shot?.generatedImageUrl
        || '';

      if (!imageBase64 && params.firstFrameImageMediaId) {
        imageBase64 = mediaCache.get(params.firstFrameImageMediaId)?.base64 || '';
      }

      if (!imageBase64) {
        throw new Error('A tomada precisa de uma imagem de quadro inicial no storyboard para gerar o vídeo.');
      }

      // 2. Determinar gênero do personagem para a voz
      let gender = 'female';
      const speakerName = params.speakerName || params.shot?.speakerName || '';
      const characters = params.characters || [];
      const character = characters.find(c => c.name === speakerName || c.id === params.shot?.speakerCharacterId);
      if (character?.voiceProfile?.gender) {
        gender = character.voiceProfile.gender.toLowerCase().includes('masc') ? 'male' : 'female';
      } else if (/antonio|pedro|joao|carlos|marcos|homem|patrao|policial/i.test(speakerName)) {
        gender = 'male';
      }

      // 3. Tentar gerar vídeo real de IA com GPU em nuvem (zero créditos, movimento real)
      const videoEndpoint = window.location.hostname.includes('netlify.app')
        ? '/.netlify/functions/video'
        : '/api/generate/video';

      try {
        const aiVideoRes = await fetch(videoEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64,
            prompt: params.prompt || 'dramatic novelinha scene, natural actor movement and subtle expression',
            durationSeconds: params.durationSeconds || params.shot?.durationSeconds || 4,
            aspectRatio: params.aspectRatio || '9:16',
          }),
        });

        if (aiVideoRes.ok) {
          const aiVideoData = await aiVideoRes.json();
          if (aiVideoData.base64) {
            return {
              base64: aiVideoData.base64,
              mimeType: aiVideoData.mimeType || 'video/mp4',
              mediaId: aiVideoData.mediaId || `vid_${Date.now()}`,
            };
          }
        }
      } catch (cloudErr) {
        console.warn('Geração em nuvem indisponível, usando fallback de animação:', cloudErr);
      }

      // 4. Fallback de animação cinematográfica
      return await animateShotToVideo({
        imageBase64,
        durationSeconds: params.durationSeconds || params.shot?.durationSeconds || 6,
        dialogueLine: params.dialogueLine || params.shot?.dialogueLine || '',
        speakerName,
        emotion: params.emotion || params.shot?.emotion || '',
        cameraMovement: params.cameraMovement || params.shot?.cameraMovement || 'Panorâmica Lenta',
        aspectRatio: params.aspectRatio || '9:16',
        gender,
      });
    },
  },

  media: {
    select: async ({ filter = 'image' } = {}) => {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = filter === 'image' ? 'image/*' : 'video/*';
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result;
            const mimeType = file.type || 'image/jpeg';
            const mediaId = 'upload_' + Date.now();
            mediaCache.set(mediaId, { base64, mimeType, name: file.name });
            resolve({ base64, mimeType, mediaId });
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    },
  },
};
