import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function sourceFiles(directory = resolve(root, 'src')) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(path));
    else if (/\.(?:jsx|js|mjs)$/.test(entry.name)) files.push(path);
  }
  return files;
}

export async function checkSources() {
  const files = await sourceFiles();
  for (const path of files) {
    await transform(await readFile(path, 'utf8'), { sourcefile: path, loader: extname(path) === '.jsx' ? 'jsx' : 'js', format: 'esm', target: 'es2020' });
  }
  console.log(`Sintaxe verificada: ${files.length} arquivos JavaScript/JSX.`);
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkSources();
