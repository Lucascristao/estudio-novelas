import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const reactUrl = pathToFileURL(require.resolve('react')).href;
const argument = process.argv.indexOf('--project');
const projectPath = argument >= 0 ? resolve(process.argv[argument + 1]) : resolve(root, '../../producoes/rosa-humilhada-na-pousada/diagnostico/Projeto_atual_backup.json');
const project = JSON.parse(await readFile(projectPath, 'utf8'));
const shots = (project.storyBible?.scenes || []).flatMap(scene => scene.shots || []);
const readyImages = shots.filter(shot => shot.generatedImageBase64).length;
const noop = () => {};
const panels = ['App.jsx', 'ui/RoteiroPanel.jsx', 'ui/AtivosPanel.jsx', 'ui/StoryboardPanel.jsx', 'ui/VideosPanel.jsx', 'ui/ExportacaoPanel.jsx'];

for (const entry of panels) {
  const result = await build({
    absWorkingDir: root, entryPoints: [`src/${entry}`], bundle: true,
    platform: 'node', format: 'esm', target: 'node18', write: false,
    external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent',
  });
  // Importa o mesmo React do renderer, sem arquivo temporário e sem navegador.
  const code = result.outputFiles[0].text.replaceAll('from "react"', `from ${JSON.stringify(reactUrl)}`);
  const module = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const html = renderToStaticMarkup(React.createElement(module.default, {
    project, runtime: 'local', canDownloadZip: false, busy: false,
    onChange: noop, onAction: async () => ({ status: 'solicitado', solicitados: [], falhas: [] }), notify: noop,
  }));
  assert(html.length > 100, `${entry}: renderização vazia.`);
  if (entry === 'ui/ExportacaoPanel.jsx') {
    assert(html.includes('ZIP ainda não confirmado neste ambiente'));
    assert(html.includes(`${readyImages} / ${shots.length}`));
    const reference = project.storyBible.characters.find(character => character.referenceSheetBase64)?.referenceSheetBase64;
    if (reference) assert(!html.includes(reference.slice(0, 100)), 'Prévia de exportação expôs base64.');
  }
  console.log(`${entry}: SSR válido (${Buffer.byteLength(html).toLocaleString('pt-BR')} bytes de HTML).`);
}

const flow = await readFile(resolve(root, 'dist/flow.js'), 'utf8');
const local = await readFile(resolve(root, 'dist/local.js'), 'utf8');
const css = await readFile(resolve(root, 'dist/local.css'), 'utf8');
const portable = await readFile(resolve(root, 'dist/Estudio-de-Novelas.html'), 'utf8');
assert(/from "react"/.test(flow) && /from "flow-sdk"/.test(flow), 'Flow deve usar React e SDK externos.');
assert(flow.includes('sanja-estudio-styles') && flow.includes('.bg-slate-900'), 'CSS compilado ausente do módulo Flow.');
assert(!/from ["']flow-sdk["']/.test(local), 'A prévia local não deve importar o SDK.');
assert(!css.includes('@tailwind') && css.includes('.bg-slate-900'), 'Tailwind não foi compilado.');
const portableScript = /<script type="module">([\s\S]*?)<\/script>/.exec(portable)?.[1];
assert(portableScript?.length > 1000 && portable.includes('<style>'), 'Versão portátil sem JS/CSS embutidos.');
assert(!/<script[^>]+src=|<link[^>]+stylesheet/i.test(portable), 'Versão portátil depende de arquivos externos.');
const portableHash = createHash('sha256').update(portableScript).digest('base64');
assert(portable.includes(`script-src 'sha256-${portableHash}'`), 'Hash CSP do script portátil divergente.');
assert(portable.includes("connect-src 'none'"), 'Versão portátil deve permanecer offline.');
console.log('Bundles: React/SDK externos no Flow; CSS local compilado; prévia sem SDK.');
console.log('Portátil: JS/CSS embutidos, hash CSP válido e conexões externas bloqueadas.');

if (process.argv.includes('--http')) {
  for (const [path, type] of [['/', 'text/html'], ['/local.js', 'text/javascript'], ['/local.css', 'text/css']]) {
    const response = await fetch(`http://127.0.0.1:4173${path}`);
    assert.equal(response.status, 200, `${path}: resposta inválida.`);
    assert(response.headers.get('content-type')?.startsWith(type), `${path}: MIME inválido.`);
    assert((await response.text()).length > 100);
  }
  const forbidden = await fetch('http://127.0.0.1:4173/%2e%2e%2fpackage.json');
  assert([400, 403, 404].includes(forbidden.status), 'Servidor expôs um caminho externo.');
  console.log('HTTP local: HTML/JS/CSS válidos; caminho externo bloqueado.');
}
