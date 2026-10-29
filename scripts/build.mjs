import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { checkSources, sourceFiles } from './check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outdir = resolve(root, 'dist');

function tailwindPlugin({ inline = false } = {}) {
  return {
    name: 'tailwind-local',
    setup(builder) {
      builder.onLoad({ filter: /\.css$/ }, async ({ path }) => {
        const css = await readFile(path, 'utf8');
        const result = await postcss([tailwindcss({
          content: [resolve(root, 'src/**/*.{js,jsx}').replace(/\\/g, '/')],
          theme: { extend: {} }, plugins: [],
        })]).process(css, { from: path, map: false });
        const watchFiles = [path, ...await sourceFiles()];
        if (!inline) return { contents: result.css, loader: 'css', resolveDir: dirname(path), watchFiles };
        const injection = `const css = ${JSON.stringify(result.css)};\nif (typeof document !== 'undefined') { let style = document.getElementById('sanja-estudio-styles'); if (!style) { style = document.createElement('style'); style.id = 'sanja-estudio-styles'; document.head.appendChild(style); } style.textContent = css; }\nexport default css;`;
        return { contents: injection, loader: 'js', resolveDir: dirname(path), watchFiles };
      });
    },
  };
}

export async function buildStudio() {
  await checkSources();
  await mkdir(outdir, { recursive: true });
  const common = { absWorkingDir: root, bundle: true, format: 'esm', target: ['chrome110'], minify: false, logLevel: 'info', legalComments: 'eof' };
  await build({ ...common, entryPoints: ['src/local.jsx'], outfile: resolve(outdir, 'local.js'), plugins: [tailwindPlugin()], define: { 'process.env.NODE_ENV': '"production"' } });
  await build({ ...common, entryPoints: ['src/codespaces.jsx'], outfile: resolve(outdir, 'codespaces.js'), plugins: [tailwindPlugin()], define: { 'process.env.NODE_ENV': '"production"' } });
  await build({ ...common, entryPoints: ['src/flow.jsx'], outfile: resolve(outdir, 'flow.js'), external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'flow-sdk'], plugins: [tailwindPlugin({ inline: true })] });
  await copyFile(resolve(root, 'index.html'), resolve(outdir, 'index.html'));
  const template = await readFile(resolve(root, 'index.html'), 'utf8');
  const javascript = await readFile(resolve(outdir, 'local.js'), 'utf8');
  const css = await readFile(resolve(outdir, 'local.css'), 'utf8');
  const escapeClosing = (text, tag) => text.replace(new RegExp(`</${tag}`, 'gi'), match => match[0] + String.fromCharCode(92) + match.slice(1));
  const inlineScript = `\n${escapeClosing(javascript, 'script')}\n`;
  const inlineCss = `\n${escapeClosing(css, 'style')}\n`;
  const scriptHash = createHash('sha256').update(inlineScript).digest('base64');
  const policy = `default-src 'none'; script-src 'sha256-${scriptHash}'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; connect-src 'none'; font-src data:; object-src 'none'; base-uri 'none'`;
  const portable = template
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*\/>/, `<meta http-equiv="Content-Security-Policy" content="${policy}" />`)
    .replace('<link rel="stylesheet" href="./local.css" />', () => `<style>${inlineCss}</style>`)
    .replace('<script type="module" src="./local.js"></script>', () => `<script type="module">${inlineScript}</script>`);
  if (portable.includes('src="./local.js"') || portable.includes('href="./local.css"')) throw new Error('A versão portátil ainda depende de arquivos externos.');
  await writeFile(resolve(outdir, 'Estudio-de-Novelas.html'), portable, 'utf8');
  console.log('Build concluído: dist/index.html (servidor local), dist/Estudio-de-Novelas.html (portátil offline) e dist/flow.js (React/SDK externos, CSS incluído).');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildStudio();
