// Confere dados preservados após importar/exportar um projeto na ferramenta.
// Uso: node verificar-projeto.mjs antes.json depois.json
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const [antesPath, depoisPath] = process.argv.slice(2);
if (!antesPath || !depoisPath) throw new Error('Informe o JSON anterior e o JSON exportado.');
const ler = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const antes = ler(antesPath), depois = ler(depoisPath);
const hash = v => v ? crypto.createHash('sha256').update(v).digest('hex') : null;
const shots = p => p.storyBible.scenes.flatMap(s => s.shots);
const comparar = (a, b, campos, contexto) => {
  for (const campo of campos) if (campo in a) assert.deepEqual(b[campo], a[campo], `${contexto}: ${campo} foi alterado`);
};

comparar(antes, depois, ['title','logline','scriptText','version','_testeCompatibilidade'], 'Projeto');
comparar(antes.settings, depois.settings, Object.keys(antes.settings), 'Configurações');
comparar(antes.storyBible, depois.storyBible, ['title','logline','hook','centralConflict','ending','acts'], 'História');
assert.deepEqual(depois.storyBible.characters.map(c=>c.id), antes.storyBible.characters.map(c=>c.id), 'Elenco alterado');
assert.deepEqual(depois.storyBible.locations.map(c=>c.id), antes.storyBible.locations.map(c=>c.id), 'Cenários alterados');
assert.deepEqual(depois.storyBible.scenes.map(c=>c.sceneId), antes.storyBible.scenes.map(c=>c.sceneId), 'Cenas alteradas');
for (const c of antes.storyBible.characters) {
  const novo = depois.storyBible.characters.find(n=>n.id===c.id);
  comparar(c, novo, ['name','age','physicalTraits','voiceProfile','wardrobes','defaultWardrobeId','personality','fixedVisualPrompt'], `Personagem ${c.name}`);
  assert.equal(hash(novo.referenceSheetBase64), hash(c.referenceSheetBase64), `Foto alterada: ${c.name}`);
}
for (const c of antes.storyBible.locations) {
  const novo = depois.storyBible.locations.find(n=>n.id===c.id);
  comparar(c, novo, ['name','fixedDescription','atmosphere','lightingPalette','timeOfDay'], `Cenário ${c.name}`);
  assert.equal(hash(novo.generatedImageBase64), hash(c.generatedImageBase64), `Foto de cenário alterada: ${c.name}`);
}
const a = shots(antes), b = shots(depois);
assert.deepEqual(b.map(s=>s.shotId), a.map(s=>s.shotId), 'Ordem ou quantidade de tomadas alterada');
for (let i=0;i<a.length;i++) {
  comparar(a[i], b[i], ['durationSeconds','dialogueLine','speakerCharacterId','speakerName','characterIds','locationId','wardrobeMap','visualAction','emotion','voiceTone','sfxAmbience','shotType','cameraMovement','transition','isContinuationOfPrevious','_testeCompatibilidade'], a[i].shotId);
  assert.equal(hash(b[i].generatedImageBase64), hash(a[i].generatedImageBase64), `Quadro alterado: ${a[i].shotId}`);
  assert.equal(hash(b[i].generatedVideoBase64), hash(a[i].generatedVideoBase64), `Vídeo alterado: ${a[i].shotId}`);
}
console.log(JSON.stringify({preservacao:'aprovada',personagens:depois.storyBible.characters.length,cenarios:depois.storyBible.locations.length,tomadas:b.length,quadros:b.filter(s=>s.generatedImageBase64).length,segundos:b.reduce((n,s)=>n+s.durationSeconds,0)},null,2));
