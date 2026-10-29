export const CodespacesSDK = {
  upload: async ({ base64, mimeType = 'image/jpeg', name }) => {
    return { mediaId: `upload_${Date.now()}`, base64, mimeType, name };
  },

  generate: {
    text: async (prompt, options = {}) => {
      const endpoints = [
        '/.netlify/functions/text',
        '/api/generate/text'
      ];
      let lastErr = null;
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemInstruction: options.systemInstruction }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.text) return data;
          } else {
            const errJson = await res.json().catch(() => ({}));
            lastErr = errJson.error || `Erro HTTP ${res.status}`;
          }
        } catch (e) {
          lastErr = e.message;
        }
      }
      throw new Error(lastErr || 'Falha na geração do roteiro.');
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

      return {
        base64,
        mimeType: 'image/jpeg',
        mediaId: `img_${Date.now()}_${seed}`,
      };
    },

    video: async (params) => {
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
