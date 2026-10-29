import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (process.argv.includes('--build')) await (await import('./build.mjs')).buildStudio();
const folder = await realpath(resolve(root, 'dist')).catch(() => { throw new Error('Execute npm run build antes de iniciar a prévia.'); });
const portFlag = process.argv.indexOf('--port');
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Porta inválida.');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    let path = resolve(folder, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (path !== folder && !path.startsWith(`${folder}${sep}`)) { res.writeHead(403).end(); return; }
    let metadata = await stat(path).catch(() => null);
    if (!metadata && !extname(path)) { path = resolve(folder, 'index.html'); metadata = await stat(path); }
    if (!metadata?.isFile()) { res.writeHead(404).end('Arquivo não encontrado.'); return; }
    const actual = await realpath(path);
    if (!actual.startsWith(`${folder}${sep}`)) { res.writeHead(403).end(); return; }
    const content = await readFile(actual);
    res.writeHead(200, { 'Content-Type': types[extname(actual)] || 'application/octet-stream', 'Content-Length': content.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(400).end('Requisição inválida.'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Prévia local: http://127.0.0.1:${port}\nImporte seu JSON pelo botão Abrir projeto. A geração fica indisponível nesta prévia.`));
