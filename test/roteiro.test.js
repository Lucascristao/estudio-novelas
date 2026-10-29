import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createProject, importProject, validateProject } from '../src/projeto/index.js';
import {
  createNarrativeService, NarrativeError, parseAiJson, countWords, dialogueLimit, dialogueBudget,
  renderScriptText, scriptSynchronization,
} from '../src/roteiro/index.js';

const clone = value => JSON.parse(JSON.stringify(value));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };

function fixture({ media = true } = {}) {
  const project = createProject({ title: 'Rosa — Parte 1', settings: { currentEpisode: 1, durationMinutes: 2, defaultResolution: '360p', keywords: ['humilhação'] },
    _privateUnknown: { preserve: ['one', 'two'] }, storyBible: {
      title: 'Rosa — Parte 1', logline: 'Rosa descobre uma armação.', storyRealism: 'ficticia', narrativeStructure: 'Vingança e virada',
      hook: 'A conta escondida.', centralConflict: 'Recuperar a dignidade.', ending: { type: 'cliffhanger', description: 'Uma carta muda tudo.' },
      _unknownCanon: { preserve: true }, acts: [{ actNumber: 1, title: 'Armação', narrativeGoal: 'Revelar a injustiça' }],
      characters: [{ id: 'rosa', name: 'Rosa', age: 29, role: 'protagonist', archetype: 'Trabalhadora', physicalTraits: { face: 'Rosto original', hair: 'Castanho', custom: 'manter' },
        fixedVisualPrompt: 'Rosto da Rosa', personality: 'Corajosa', wardrobes: [{ id: 'uniforme', name: 'Trabalho', description: 'Uniforme amarelo', _extra: true },
          { id: 'festa', name: 'Festa', description: 'Vestido azul' }], defaultWardrobeId: 'uniforme',
        voiceProfile: { gender: 'feminino', ageGroup: 'adulta', timbre: 'Suave', accent: 'Cearense', rhythm: 'Pausado', _extra: 'voz' },
        ...(media ? { referenceSheetBase64: 'Uk9TQV9PUklHSU5BTF9TZWNyZXRv', referenceSheetMimeType: 'image/png', userUploadedPhotoMediaId: 'photo-id', referenceMediaId: 'rosa-id', userUploaded: true } : {}) }],
      locations: [{ id: 'recepcao', name: 'Recepção', fixedDescription: 'Recepção vazia. Balcão à direita. Sem pessoas ou mãos.', atmosphere: 'Ar úmido.', lightingPalette: 'Luz lateral.', timeOfDay: 'Tarde',
        ...(media ? { generatedImageBase64: 'Q0VOQVJJT19PUklHSU5BTA==', generatedMimeType: 'image/jpeg', mediaId: 'location-id' } : {}) }],
      scenes: [{ sceneId: 'scene_1', sceneNumber: 1, actNumber: 1, title: 'Carta', objective: 'Descoberta', cause: 'A patroa saiu.', consequence: 'Rosa vai reagir.',
        shots: [shot('shot_1', 4, 'Eu encontrei sua carta.'), shot('shot_2', 6, 'Agora todos vão saber a verdade.')] }],
    } });
  if (media) Object.assign(project.storyBible.scenes[0].shots[0], { generatedImageBase64: 'UVVBRA==', imageMediaId: 'frame-id', generatedVideoBase64: 'VklERU8=',
    generatedVideoMimeType: 'video/mp4', videoMediaId: 'video-id', videoResolution: '360p', isApproved: true, _unknownShot: { retain: 'yes' } });
  project.scriptText = renderScriptText(project);
  return project;
}

function shot(id, duration = 6, line = 'Eu vou provar a verdade.') {
  return { shotId: id, durationSeconds: duration, locationId: 'recepcao', characterIds: ['rosa'], wardrobeMap: { rosa: 'uniforme' },
    shotType: 'Plano médio', cameraMovement: 'Estático', speakerCharacterId: 'rosa', speakerName: 'Rosa', dialogueLine: line,
    visualAction: 'QUADRO INICIAL DO STORYBOARD: Rosa à esquerda segura a carta.\nAÇÃO NO VÍDEO: Rosa mostra a carta à patroa.\nOLHARES E ESCUTA: Olha para a direita.\nSAÍDA PARA O CORTE: A patroa reage.',
    emotion: 'Firme', voiceTone: 'Contido', sfxAmbience: 'Vento na janela', transition: 'Corte seco' };
}

function nextBible() {
  const bible = fixture({ media: false }).storyBible;
  return { ...bible, title: 'Rosa — Parte 2', hook: 'A carta agora é pública.', ending: { type: 'cliffhanger', description: 'A patroa ameaça contar outro segredo.' },
    scenes: [{ sceneId: 'scene_1', sceneNumber: 1, actNumber: 2, title: 'Reação', shots: [shot('shot_1', 6, 'Esta assinatura é sua, patroa.')] }] };
}

function fakeSdk(responses = []) {
  const calls = [];
  const sdk = { generate: { text: async (prompt, options) => {
    calls.push({ prompt, options });
    const response = responses.shift();
    if (response instanceof Error) throw response;
    const result = typeof response === 'function' ? await response(prompt, options) : response;
    return typeof result === 'string' ? { text: result } : result && Object.hasOwn(result, 'text') ? result : { text: JSON.stringify(result) };
  } } };
  return { sdk, calls };
}

const ideas = count => Array.from({ length: count }, (_, index) => ({ id: `${index + 1}`, title: `Ideia ${index + 1}`, premise: 'Uma injustiça é exposta.',
  hook: 'A conta tem outro nome.', category: 'Melodrama / Novela', subgenre: 'Segredo de família', storyRealism: 'ficticia', structure: 'Segredo revelado' }));

test('word limits follow original 4/6/8/10s and reject invalid durations', () => {
  assert.deepEqual([4, 6, 8, 10].map(dialogueLimit), [9, 14, 18, 23]);
  assert.equal(countWords('  Olá,\n Brasil!  '), 2);
  assert.equal(countWords(''), 0);
  assert.equal(dialogueBudget(Array(9).fill('sim').join(' '), 4).exceeded, false);
  assert.equal(dialogueBudget(Array(10).fill('sim').join(' '), 4).exceeded, true);
  for (const duration of [0, -1, NaN, Infinity, '6']) assert.throws(() => dialogueLimit(duration), { code: 'INVALID_DURATION', recoverable: true });
});

test('JSON parser accepts fences, prose, UTF-8 and braces escaped inside strings', () => {
  const expected = { text: 'Rosa diz: "Sim } [ aqui"', array: [{ nested: true }] };
  assert.deepEqual(parseAiJson(`Resposta:\n\u0060\u0060\u0060json\n${JSON.stringify(expected)}\n\u0060\u0060\u0060`), expected);
  assert.deepEqual(parseAiJson('\uFEFF[1,2]'), [1, 2]);
  assert.deepEqual(parseAiJson('{"text":"a string literal ,} must survive"}'), { text: 'a string literal ,} must survive' });
});

test('invalid, truncated or ambiguous JSON fails explicitly without synthetic repair', () => {
  for (const value of ['', '{"title":', '{ title: "sem aspas" }', '{"a":1} {"b":2}', 'A IA não conseguiu.']) {
    assert.throws(() => parseAiJson(value), error => error instanceof NarrativeError && error.recoverable && !/Carlos|Roberto/.test(error.message));
  }
});

test('construction and pure editing need no SDK and perform no request', () => {
  const source = fixture(), original = clone(source);
  const service = createNarrativeService({ project: source });
  assert.deepEqual(source, original);
  assert.equal(service.status.state, 'idle');
  assert.equal(service.scriptStatus.status, 'synced');
});

test('suggestions honor theme, genre, keys and exact idea count without changing project', async () => {
  const fake = fakeSdk([ideas(4)]), source = fixture(), original = clone(source);
  const service = createNarrativeService({ sdk: fake.sdk, project: source });
  const before = clone(service.project);
  const result = await service.suggestIdeas({ theme: 'Pousada no Ceará', settings: { selectedDramaGenre: 'Melodrama / Novela', keywords: ['salário', 'carta'] } });
  assert.equal(result.length, 4);
  assert.match(fake.calls[0].prompt, /Pousada no Ceará|Melodrama \/ Novela|salário|carta/);
  assert.match(fake.calls[0].options.systemInstruction, /exclusivamente o JSON/);
  assert.deepEqual(service.project, before);
  assert.deepEqual(source, original);
});

test('suggestion errors remain recoverable and never auto-retry', async () => {
  const fake = fakeSdk([new Error('Serviço indisponível')]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  const before = clone(service.project);
  await assert.rejects(service.suggestIdeas(), { code: 'AI_REQUEST_FAILED', recoverable: true });
  assert.equal(fake.calls.length, 1);
  assert.deepEqual(service.project, before);
  assert.equal(service.status.state, 'error');
  assert.equal(service.status.recoverable, true);
});

test('suggestions reject malformed entries and repeated IDs', async () => {
  for (const response of [{ ideas: [{}] }, ideas(1), [ideas(1)[0], ideas(1)[0]]]) {
    const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk });
    await assert.rejects(service.suggestIdeas({ count: 2 }), { code: 'AI_INVALID_IDEAS' });
  }
});

test('story generation uses two phases and commits only the complete valid storyboard', async () => {
  const bible = nextBible(), { scenes, ...foundation } = bible;
  const fake = fakeSdk([foundation, { scenes }]), progress = [], changes = [];
  const service = createNarrativeService({ sdk: fake.sdk, onProgress: event => progress.push(event), onChange: (project, event) => changes.push(event) });
  const result = await service.generateStory({ idea: ideas(1)[0] });
  assert.equal(fake.calls.length, 2);
  assert.match(fake.calls[0].prompt, /ETAPA 1\/2/);
  assert.match(fake.calls[1].prompt, /ETAPA 2\/2/);
  assert.equal(validateProject(result).valid, true);
  assert.equal(result.scriptText, renderScriptText(result));
  assert.equal(result.scriptSync.status, 'synced');
  assert.equal(changes.length, 1);
  assert.ok(progress.some(event => event.stage === 'shots'));
});

test('phase-two failure leaves project intact and does not synthesize a story', async () => {
  const { scenes, ...foundation } = nextBible();
  const fake = fakeSdk([foundation, '{"scenes":']), service = createNarrativeService({ sdk: fake.sdk });
  const before = clone(service.project);
  await assert.rejects(service.generateStory(), { code: 'AI_INVALID_JSON' });
  assert.deepEqual(service.project, before);
  assert.equal(fake.calls.length, 2);
  assert.doesNotMatch(JSON.stringify(service.project), /Carlos Mendes|Roberto Valente|A verdade não vai ficar/);
});

test('a populated project requires an explicit replacement choice before any request', async () => {
  const fake = fakeSdk([]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  await assert.rejects(service.generateStory(), { code: 'REPLACEMENT_REQUIRED' });
  await assert.rejects(service.convertScript('Um roteiro.'), { code: 'REPLACEMENT_REQUIRED' });
  assert.equal(fake.calls.length, 0);
});

test('conversion sends the entire long source, including the ending, and retains original text', async () => {
  const source = `${'Rosa trabalha na pousada e encontra uma carta.\n'.repeat(1800)}FINAL_UNICO_QUE_NAO_PODE_SUMIR: a patroa assume a culpa. {"texto":"especial"}`;
  assert.ok(source.length > 70000);
  const fake = fakeSdk([nextBible()]), service = createNarrativeService({ sdk: fake.sdk });
  const result = await service.convertScript(source);
  assert.ok(fake.calls[0].prompt.includes(JSON.stringify(source)));
  assert.match(fake.calls[0].prompt, /FINAL_UNICO_QUE_NAO_PODE_SUMIR/);
  assert.equal(result.sourceScriptText, source);
  assert.equal(result.scriptText, renderScriptText(result));
  assert.equal(result.scriptSync.status, 'synced');
  assert.equal(result.storyBible.scenes[0].shots[0].dialogueLine, 'Esta assinatura é sua, patroa.');
});

test('conversion rejects broken links, missing shots and overlong speech without changing source project', async () => {
  const broken = nextBible(); broken.scenes[0].shots[0].characterIds = ['inventado'];
  const empty = nextBible(); empty.scenes[0].shots = [];
  const long = nextBible(); long.scenes[0].shots[0].dialogueLine = Array(15).fill('palavra').join(' ');
  for (const [response, code] of [[broken, 'AI_INVALID_PROJECT'], [empty, 'AI_EMPTY_SCENE'], [long, 'DIALOGUE_LIMIT']]) {
    const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() }), before = clone(service.project);
    await assert.rejects(service.convertScript('Texto original que não deve sumir.', { replace: true }), { code, recoverable: true });
    assert.deepEqual(service.project, before);
    assert.equal(fake.calls.length, 1);
  }
});

test('AI-generated media fields cannot be accepted as actual generated media', async () => {
  const response = nextBible(); response.scenes[0].shots[0].generatedImageBase64 = 'inventado';
  const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk });
  await assert.rejects(service.convertScript('Rosa acusa a patroa.'), { code: 'AI_INVENTED_MEDIA' });
});

test('continuation uses the entire prior canon and preserves IDs, photos, costumes, voices, locations and unknown fields', async () => {
  const source = fixture(), original = clone(source), response = nextBible();
  response.characters[0].name = 'Nome que a IA não pode substituir';
  response.characters[0].physicalTraits.face = 'Rosto inventado';
  response.characters[0].voiceProfile.accent = 'Outro sotaque';
  response.characters[0].referenceSheetBase64 = 'substituição proibida';
  response.locations[0].name = 'Outro cenário';
  const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk, project: source });
  const before = clone(service.project), result = await service.continueEpisode({ directive: 'A assinatura revela a armação.' });
  assert.equal(result.settings.currentEpisode, 2);
  assert.equal(result.settings.productionType, 'series');
  assert.deepEqual(result.storyBible.characters, before.storyBible.characters);
  assert.deepEqual(result.storyBible.locations, before.storyBible.locations);
  assert.deepEqual(result._privateUnknown, before._privateUnknown);
  assert.deepEqual(result.storyBible._unknownCanon, before.storyBible._unknownCanon);
  assert.deepEqual(result.episodeHistory[0].storyBible, before.storyBible);
  assert.equal(result.episodeHistory[0].scriptText, before.scriptText);
  assert.equal(result.episodeHistory[0].episode, 1);
  assert.equal(result.scriptText, renderScriptText(result));
  assert.deepEqual(source, original);
  const prompt = fake.calls[0].prompt;
  assert.match(prompt, /Agora todos vão saber a verdade/);
  assert.match(prompt, /Cearense|Uniforme amarelo|Vestido azul|recepcao|shot_2/);
  assert.match(prompt, /gancho forte/);
  assert.doesNotMatch(prompt, /Uk9TQV9PUklHSU5BTF9TZWNyZXRv|Q0VOQVJJT19PUklHSU5BTA==|VklERU8=|photo-id|rosa-id|frame-id|video-id/);
});

test('continuation allocates unique new scene/shot IDs and keeps the originals in history', async () => {
  const fake = fakeSdk([nextBible(), nextBible()]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  await service.continueEpisode();
  assert.equal(service.project.storyBible.scenes[0].sceneId, 'ep2_scene_1');
  assert.equal(service.project.storyBible.scenes[0].shots[0].shotId, 'ep2_shot_1');
  assert.equal(service.project.episodeHistory[0].storyBible.scenes[0].shots[0].shotId, 'shot_1');
  await service.continueEpisode();
  assert.equal(service.project.settings.currentEpisode, 3);
  assert.equal(service.project.episodeHistory.length, 2);
  assert.equal(service.project.storyBible.scenes[0].shots[0].shotId, 'ep3_shot_1');
  assert.match(fake.calls[1].prompt, /fechar a história/);
});

test('continuation rejects unapproved new assets and broken wardrobe IDs', async () => {
  const newAssets = nextBible(); newAssets.characters.push({ ...newAssets.characters[0], id: 'new-char', name: 'Nova pessoa' });
  const broken = nextBible(); broken.scenes[0].shots[0].wardrobeMap = { rosa: 'roupa-inventada' };
  for (const [response, code] of [[newAssets, 'AI_NEW_ASSET'], [broken, 'AI_INVALID_PROJECT']]) {
    const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() }), before = clone(service.project);
    await assert.rejects(service.continueEpisode(), { code });
    assert.deepEqual(service.project, before);
    assert.equal(service.project.settings.currentEpisode, 1);
  }
});

test('continuation may add explicitly allowed assets without replacing existing ones', async () => {
  const response = nextBible(); response.characters.push({ ...clone(response.characters[0]), id: 'ana', name: 'Ana' });
  const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() }), rosa = clone(service.project.storyBible.characters[0]);
  await service.continueEpisode({ allowNewAssets: true });
  assert.equal(service.project.storyBible.characters.length, 2);
  assert.deepEqual(service.project.storyBible.characters[0], rosa);
  assert.equal(service.project.storyBible.characters[1].id, 'ana');
});

test('continuation transport failure preserves episode number, current media and history', async () => {
  const fake = fakeSdk([new Error('Temporariamente indisponível')]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  const before = clone(service.project);
  await assert.rejects(service.continueEpisode(), { code: 'AI_REQUEST_FAILED' });
  assert.deepEqual(service.project, before);
  assert.equal(fake.calls.length, 1);
});

test('a continuation without new scenes cannot silently copy the prior episode', async () => {
  const fake = fakeSdk([{}]), service = createNarrativeService({ sdk: fake.sdk, project: fixture({ media: false }) });
  const before = clone(service.project);
  await assert.rejects(service.continueEpisode(), { code: 'AI_EMPTY_STORY' });
  assert.deepEqual(service.project, before);
});

test('shortening changes only dialogueLine on the identified shot and marks script stale', async () => {
  const fake = fakeSdk([{ dialogueLine: 'Encontrei a carta.', visualAction: 'Não pode substituir', durationSeconds: 10 }]);
  const service = createNarrativeService({ sdk: fake.sdk, project: fixture() }), before = clone(service.project);
  const result = await service.shortenDialogue('shot_1');
  const expected = clone(before); expected.storyBible.scenes[0].shots[0].dialogueLine = 'Encontrei a carta.';
  expected.scriptSync = { status: 'stale', source: 'storyboard' };
  assert.deepEqual(result, expected);
  assert.equal(result.scriptText, before.scriptText);
  assert.equal(result.storyBible.scenes[0].shots[0].durationSeconds, 4);
});

test('shortening can regenerate canonical script text explicitly', async () => {
  const fake = fakeSdk([{ dialogueLine: 'Encontrei a carta.' }]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  await service.shortenDialogue('shot_1', { syncText: true });
  assert.equal(service.project.scriptText, renderScriptText(service.project));
  assert.equal(service.scriptStatus.status, 'synced');
});

test('shortening rejects excess words, longer responses and empty speech, leaving everything intact', async () => {
  for (const response of [{ dialogueLine: Array(10).fill('uma').join(' ') }, { dialogueLine: 'Eu encontrei sua carta escondida.' }, { dialogueLine: '' }]) {
    const fake = fakeSdk([response]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() }), before = clone(service.project);
    await assert.rejects(service.shortenDialogue('shot_1'), error => error.recoverable && ['DIALOGUE_LIMIT', 'AI_INVALID_DIALOGUE'].includes(error.code));
    assert.deepEqual(service.project, before);
  }
});

test('unrelated edits during shortening survive; editing the same dialogue rejects stale output', async () => {
  const first = deferred(), fake = fakeSdk([() => first.promise]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  const pending = service.shortenDialogue('shot_1');
  service.updateShot('shot_2', { emotion: 'Aliviada' });
  first.resolve({ text: '{"dialogueLine":"Encontrei a carta."}' });
  await pending;
  assert.equal(service.project.storyBible.scenes[0].shots[1].emotion, 'Aliviada');
  const second = deferred(); fake.sdk.generate.text = async () => second.promise;
  const stale = service.shortenDialogue('shot_1');
  service.updateShot('shot_1', { dialogueLine: 'Nova fala do usuário.' });
  second.resolve({ text: '{"dialogueLine":"A carta."}' });
  await assert.rejects(stale, { code: 'STALE_PROJECT' });
  assert.equal(service.project.storyBible.scenes[0].shots[0].dialogueLine, 'Nova fala do usuário.');
});

test('long conversion cannot overwrite edits made while the request was running', async () => {
  const gate = deferred(), fake = fakeSdk([() => gate.promise]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  const pending = service.convertScript('Um novo roteiro.', { replace: true });
  service.updateShot('shot_1', { dialogueLine: 'Edição mais recente.' });
  gate.resolve({ text: JSON.stringify(nextBible()) });
  await assert.rejects(pending, { code: 'STALE_PROJECT' });
  assert.equal(service.project.storyBible.scenes[0].shots[0].dialogueLine, 'Edição mais recente.');
  assert.equal(service.project.sourceScriptText, undefined);
});

test('shortening cannot cross into another imported project even with matching shot IDs and dialogue', async () => {
  const gate = deferred(), fake = fakeSdk([() => gate.promise]), service = createNarrativeService({ sdk: fake.sdk, project: fixture() });
  const pending = service.shortenDialogue('shot_1');
  const another = fixture(); another.title = 'Outro projeto';
  service.setProject(another);
  const before = clone(service.project);
  gate.resolve({ text: '{"dialogueLine":"Encontrei a carta."}' });
  await assert.rejects(pending, { code: 'STALE_PROJECT' });
  assert.deepEqual(service.project, before);
});

test('parallel text requests are blocked before any second SDK call', async () => {
  const gate = deferred(), fake = fakeSdk([() => gate.promise]), service = createNarrativeService({ sdk: fake.sdk });
  const pending = service.suggestIdeas({ count: 1 });
  await assert.rejects(service.convertScript('Outro roteiro.'), { code: 'BUSY' });
  assert.equal(fake.calls.length, 1);
  gate.resolve({ text: JSON.stringify(ideas(1)) });
  await pending;
  assert.equal(service.status.state, 'completed');
});

test('script badge is derived from canonical content, never from an imported claim', () => {
  const source = fixture(); source.scriptText = 'Texto manual diferente'; source.scriptSync = { status: 'synced' };
  assert.equal(scriptSynchronization(source).status, 'stale');
  const service = createNarrativeService({ project: source });
  assert.equal(service.project.scriptSync.status, 'stale');
  service.syncScriptText();
  assert.equal(service.scriptStatus.status, 'synced');
  service.updateShot('shot_1', { visualAction: 'Rosa espera na porta.' });
  assert.equal(service.scriptStatus.status, 'stale');
  service.syncScriptText();
  service.editScriptText('Uma edição livre.');
  assert.equal(service.project.scriptSync.status, 'stale');
  assert.equal(service.project.storyBible.scenes[0].shots[0].visualAction, 'Rosa espera na porta.');
});

test('changing default model preserves individual durations, models, media, voices, approval and IDs', () => {
  const service = createNarrativeService({ project: fixture() }), before = clone(service.project.storyBible), script = service.project.scriptText;
  service.setDefaultVideoModel('Veo 3.1 - Lite');
  assert.equal(service.project.settings.defaultVideoModel, 'Veo 3.1 - Lite');
  assert.equal(service.project.settings.secondsPerShot, 8);
  assert.equal(service.project.settings.defaultResolution, '720p');
  assert.deepEqual(service.project.storyBible, before);
  assert.equal(service.project.scriptText, script);
  assert.deepEqual(service.project.storyBible.scenes[0].shots.map(item => item.durationSeconds), [4, 6]);
  assert.deepEqual(service.project.storyBible.scenes[0].shots.map(item => item.videoModel), ['Omni 1.1 Flash', 'Omni 1.1 Flash']);
  assert.equal(service.scriptStatus.status, 'synced');
  assert.throws(() => service.setDefaultVideoModel('desconhecido'), { code: 'UNSUPPORTED_MODEL' });
  assert.throws(() => service.setDefaultVideoModel('Veo 3.1 - Lite', { resolution: '360p' }), { code: 'UNSUPPORTED_SETTINGS' });
  assert.deepEqual(service.project.storyBible, before);
});

test('real backup canon, photos and individual durations remain byte-identical when default changes', () => {
  const path = new URL('../../../producoes/rosa-humilhada-na-pousada/diagnostico/Projeto_atual_backup.json', import.meta.url);
  const source = importProject(fs.readFileSync(path, 'utf8')), service = createNarrativeService({ project: source });
  const before = hash(service.project.storyBible);
  service.setDefaultVideoModel('Veo 3.1 - Fast');
  assert.equal(hash(service.project.storyBible), before);
  assert.equal(validateProject(service.project).valid, true);
});

test('missing SDK, invalid source and observer failures do not manufacture successful generation', async () => {
  const service = createNarrativeService({ onProgress: () => { throw new Error('UI isolada'); } });
  await assert.rejects(service.suggestIdeas(), { code: 'SDK_REQUIRED', recoverable: true });
  assert.ok(service.observerErrors.length >= 1);
  assert.throws(() => createNarrativeService({ project: { storyBible: { characters: {}, locations: [], scenes: [] } } }), /Projeto inválido/);
});
