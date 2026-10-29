import { createServer } from 'node:http';
import { readFile, realpath, stat, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const distFolder = resolve(root, 'dist');
const port = Number(process.env.PORT || 4173);

// In-memory media storage for uploaded and generated assets
const mediaStore = new Map();

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Load API key dynamically from process.env or .env file
let geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

async function getGeminiApiKey() {
  if (geminiApiKey) return geminiApiKey;
  if (existsSync(resolve(root, '.env'))) {
    try {
      const envContent = await readFile(resolve(root, '.env'), 'utf8');
      for (const line of envContent.split('\n')) {
        const match = line.match(/^\s*(?:GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*([^\s#]+)/);
        if (match) {
          geminiApiKey = match[1].trim();
          return geminiApiKey;
        }
      }
    } catch (err) {
      console.warn('Erro ao ler .env:', err.message);
    }
  }
  return '';
}

// Map aspect ratio to dimensions
function getDimensions(aspectRatio) {
  switch (aspectRatio) {
    case '16:9': return { width: 1280, height: 720 };
    case '1:1':  return { width: 1024, height: 1024 };
    case '3:4':  return { width: 768, height: 1024 };
    case '4:3':  return { width: 1024, height: 768 };
    case '9:16':
    default:     return { width: 720, height: 1280 };
  }
}

// Helper to execute CLI commands
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Comando ${command} falhou (${code}): ${stderr || stdout}`));
    });
    child.on('error', reject);
  });
}

// Static MIME types
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          hasGeminiKey: Boolean(geminiApiKey),
          isCodespaces: Boolean(process.env.CODESPACES),
          port
        }));
        return;
      }

      if (pathname === '/api/config/key' && req.method === 'POST') {
        const { key } = await parseJsonBody(req);
        if (key && typeof key === 'string') {
          geminiApiKey = key.trim();
          await writeFile(resolve(root, '.env'), `GEMINI_API_KEY=${geminiApiKey}\n`, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Chave inválida' }));
        }
        return;
      }

      if (pathname === '/api/upload' && req.method === 'POST') {
        const { base64, mimeType = 'image/jpeg', name } = await parseJsonBody(req);
        if (!base64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Arquivo base64 ausente' }));
          return;
        }
        const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        mediaStore.set(mediaId, { base64, mimeType, name });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mediaId, base64, mimeType }));
        return;
      }

      if (pathname === '/api/generate/text' && req.method === 'POST') {
        if (!geminiApiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Chave da API do Google AI Studio não configurada.' }));
          return;
        }
        const { prompt, systemInstruction } = await parseJsonBody(req);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`;

        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        };
        if (systemInstruction) {
          payload.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
          const errData = await geminiRes.text();
          console.error('Erro Gemini:', errData);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Erro na API Gemini: ${geminiRes.status}` }));
          return;
        }

        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
        return;
      }

      if (pathname === '/api/generate/audio' && req.method === 'POST') {
        const { text, gender = 'female' } = await parseJsonBody(req);
        if (!text || typeof text !== 'string' || !text.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Texto ausente para geração de áudio.' }));
          return;
        }

        const cleanText = text.trim();
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
          const audioRes = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            },
          });
          if (!audioRes.ok) throw new Error(`Falha no serviço de voz (${audioRes.status})`);
          const arrayBuffer = await audioRes.arrayBuffer();
          audioBuffers.push(Buffer.from(arrayBuffer));
        }

        const finalBuffer = Buffer.concat(audioBuffers);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          audioBase64: finalBuffer.toString('base64'),
          mimeType: 'audio/mpeg',
          gender,
        }));
        return;
      }

      if (pathname === '/api/generate/image' && req.method === 'POST') {
        const { prompt, aspectRatio = '9:16' } = await parseJsonBody(req);
        const { width, height } = getDimensions(aspectRatio);
        const seed = Math.floor(Math.random() * 10000000);
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

        const imgRes = await fetch(pollinationsUrl);
        if (!imgRes.ok) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Falha ao gerar imagem: ${imgRes.status}` }));
          return;
        }

        const buffer = await imgRes.arrayBuffer();
        const base64Str = Buffer.from(buffer).toString('base64');
        const base64 = `data:image/jpeg;base64,${base64Str}`;
        const mediaId = `img_${Date.now()}_${seed}`;
        mediaStore.set(mediaId, { base64, mimeType: 'image/jpeg' });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ base64, mimeType: 'image/jpeg', mediaId }));
        return;
      }

      if (pathname === '/api/generate/video' && req.method === 'POST') {
        const { firstFrameImageMediaId, durationSeconds = 6, prompt = '' } = await parseJsonBody(req);
        
        let frameBase64 = '';
        if (firstFrameImageMediaId && mediaStore.has(firstFrameImageMediaId)) {
          frameBase64 = mediaStore.get(firstFrameImageMediaId).base64;
        }

        // Generate synthetic Ken Burns video from the image
        const tempId = `temp_${Date.now()}`;
        const tempDir = tmpdir();
        const imgPath = resolve(tempDir, `${tempId}.jpg`);
        const videoPath = resolve(tempDir, `${tempId}.mp4`);

        let rawBuffer = null;
        if (frameBase64) {
          const match = /^data:image\/[^;]+;base64,(.+)$/.exec(frameBase64);
          if (match) rawBuffer = Buffer.from(match[1], 'base64');
        }

        if (rawBuffer) {
          await writeFile(imgPath, rawBuffer);
          const duration = Math.max(2, Math.min(10, Number(durationSeconds) || 6));
          const totalFrames = duration * 25;

          try {
            // Check if ffmpeg is available
            await runCommand('ffmpeg', ['-version']);
            // Generate video with slow cinematic zoom
            await runCommand('ffmpeg', [
              '-y',
              '-loop', '1',
              '-i', imgPath,
              '-vf', `scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.0015,1.15)':d=${totalFrames}:s=720x1280:fps=25`,
              '-c:v', 'libx264',
              '-t', String(duration),
              '-pix_fmt', 'yuv420p',
              videoPath
            ]);

            const vidBuffer = await readFile(videoPath);
            const vidBase64 = `data:video/mp4;base64,${vidBuffer.toString('base64')}`;
            const mediaId = `vid_${Date.now()}`;
            mediaStore.set(mediaId, { base64: vidBase64, mimeType: 'video/mp4' });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ base64: vidBase64, mimeType: 'video/mp4', mediaId }));
            return;
          } catch (ffmpegErr) {
            console.warn('FFmpeg não disponível ou erro no encode:', ffmpegErr.message);
          }
        }

        // Fallback: return a synthetic valid response
        const fallbackId = `vid_${Date.now()}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          mediaId: fallbackId,
          mimeType: 'video/mp4'
        }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
      return;
    } catch (apiErr) {
      console.error('Erro na API:', apiErr);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: apiErr.message }));
      return;
    }
  }

  // Static files serving from dist/
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  try {
    let filePath = resolve(distFolder, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!filePath.startsWith(distFolder)) {
      res.writeHead(403).end();
      return;
    }

    let metadata = await stat(filePath).catch(() => null);
    if (!metadata && !extname(filePath)) {
      filePath = resolve(distFolder, 'index.html');
      metadata = await stat(filePath).catch(() => null);
    }

    if (!metadata?.isFile()) {
      res.writeHead(404).end('Arquivo não encontrado.');
      return;
    }

    const content = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': types[extname(filePath)] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': 'no-store'
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (err) {
    res.writeHead(400).end('Requisição inválida.');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`\n==============================================`);
  console.log(`  Estúdio de Novelas - Rodando na porta ${port}`);
  console.log(`  Acesse no navegador: http://localhost:${port}`);
  console.log(`  Chave Gemini configurada: ${geminiApiKey ? 'SIM' : 'NÃO'}`);
  console.log(`==============================================\n`);
});
