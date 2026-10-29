export const CodespacesSDK = {
  upload: async ({ base64, mimeType = 'image/jpeg', name }) => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mimeType, name }),
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    return { mediaId: `upload_${Date.now()}`, base64, mimeType, name };
  },

  generate: {
    text: async (prompt, options = {}) => {
      // 1. Tenta backend local se estiver rodando
      try {
        const res = await fetch('/api/generate/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, systemInstruction: options.systemInstruction }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.text) return data;
        }
      } catch (_) {}

      // 2. Modo direto no navegador (Netlify / Nuvem)
      let apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
      if (!apiKey) {
        apiKey = window.prompt('Digite sua chave gratuita do Google AI Studio (Gemini):');
        if (apiKey) {
          apiKey = apiKey.trim();
          localStorage.setItem('GEMINI_API_KEY', apiKey);
        }
      }
      if (!apiKey) throw new Error('Chave do Gemini necessária para gerar o roteiro.');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      };
      if (options.systemInstruction) {
        payload.systemInstruction = { parts: [{ text: options.systemInstruction }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Erro na API Gemini: ${response.status} - ${err}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return { text };
    },

    image: async ({ prompt, aspectRatio = '9:16' }) => {
      // 1. Tenta backend local se estiver rodando
      try {
        const res = await fetch('/api/generate/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.base64) return data;
        }
      } catch (_) {}

      // 2. Modo direto no navegador via Pollinations FLUX
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

      return {
        base64,
        mimeType: 'image/jpeg',
        mediaId: `img_${Date.now()}_${seed}`,
      };
    },

    video: async (params) => {
      try {
        const res = await fetch('/api/generate/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (res.ok) return await res.json();
      } catch (_) {}

      return {
        mediaId: `vid_${Date.now()}`,
        mimeType: 'video/mp4',
      };
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
            resolve({
              base64: reader.result,
              mimeType: file.type || 'image/jpeg',
              mediaId: 'upload_' + Date.now(),
            });
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    },
  },
};
