export const CodespacesSDK = {
  upload: async ({ base64, mimeType, name }) => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, mimeType, name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Falha no upload da mídia.');
    }
    return res.json();
  },

  generate: {
    text: async (prompt, options = {}) => {
      const res = await fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction: options.systemInstruction }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Geração de texto falhou' }));
        throw new Error(err.error || 'Falha na geração do roteiro.');
      }
      return res.json();
    },

    image: async ({ prompt, modelDisplayName, aspectRatio, referenceImageMediaIds }) => {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modelDisplayName, aspectRatio, referenceImageMediaIds }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Geração de imagem falhou' }));
        throw new Error(err.error || 'Falha na geração da imagem.');
      }
      return res.json();
    },

    video: async (params) => {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Geração de vídeo falhou' }));
        throw new Error(err.error || 'Falha na geração do vídeo.');
      }
      return res.json();
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
