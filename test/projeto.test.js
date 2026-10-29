import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import {
  createProject, importProject, exportProject, validateProject, projectStats,
  splitShotDirection, joinShotDirection, assembleShotImagePrompt, assembleVideoPrompt,
  assembleLocationReferencePrompt, createProductionService, SafeProductionQueue,
} from '../src/projeto/index.js';

const hash = text => createHash('sha256').update(text || '').digest('hex');
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(resolve => setImmediate(resolve));
const originalPath = new URL('../../../producoes/rosa-humilhada-na-pousada/diagnostico/Projeto_atual_backup.json', import.meta.url);

function fixture(count = 3) {
  return createProject({ title: 'Rosa', _desconhecido: { preservar: ['sim'] }, settings: { defaultResolution: '360p' }, storyBible: {
    characters: [{ id: 'rosa', name: 'Rosa', age: 28, physicalTraits: { face: 'Rosto preservado' }, voiceProfile: { accent: 'Cearense', timbre: 'suave' },
      wardrobes: [{ id: 'amarelo', description: 'Blusa amarela' }], defaultWardrobeId: 'amarelo', referenceSheetBase64: 'cm9zYQ==', referenceSheetMimeType: 'image/png' }],
    locations: [{ id: 'recepcao', name: 'Recepção', fixedDescription: 'Recepção vazia e desocupada. Balcão à direita. Sem pessoas, mãos, partes do corpo, silhuetas ou reflexos humanos.',
      atmosphere: 'Manhã tropical.', lightingPalette: 'Luz lateral suave.', mediaId: 'location-existing' }],
    scenes: [{ sceneId: 'cena-1', shots: Array.from({ length: count }, (_, i) => ({ shotId: `s${i + 1}`, durationSeconds: i === 1 ? 4 : 6,
      locationId: 'recepcao', characterIds: ['rosa'], speakerCharacterId: 'rosa', speakerName: 'Rosa', dialogueLine: 'Eu quero meu pagamento.',
      shotType: 'Plano médio', cameraMovement: 'Travelling', voiceTone: 'Firme', emotion: 'Revolta',
      visualAction: 'QUADRO INICIAL DO STORYBOARD: Rosa à esquerda, de perfil, segurando um copo.\nAÇÃO NO VÍDEO: Rosa derrama a água e sai da recepção.\nOLHARES E ESCUTA: Olha para a direita.\nSAÍDA PARA O CORTE: Porta se fecha.\nVOZ: Somente Rosa fala.\nDIREÇÃO GERAL: Manter o eixo da conversa.',
      _extra: { i },
    })) }], acts: [],
  } });
}

function fakeSdk(overrides = {}) {
  const calls = [], uploads = [];
  let active = 0, maxActive = 0;
  const call = async (kind, args, operation) => {
    calls.push({ kind, args }); active++; maxActive = Math.max(maxActive, active);
    try { return await operation(); } finally { active--; }
  };
  const sdk = {
    upload: args => call('upload', args, async () => { uploads.push(args); return overrides.upload ? overrides.upload(args) : { mediaId: `upload-${uploads.length}` }; }),
    generate: {
      image: args => call('image', args, () => overrides.image ? overrides.image(args) : { base64: 'aW1hZ2U=', mimeType: 'image/png', mediaId: `image-${calls.length}` }),
      video: args => call('video', args, () => overrides.video ? overrides.video(args) : { base64: 'dmlkZW8=', mimeType: 'video/mp4', mediaId: `video-${calls.length}` }),
      text: (prompt, options) => call('text', { prompt, options }, () => overrides.text ? overrides.text(prompt, options) : { text: 'Texto' }),
    },
    media: { select: args => call('select', args, () => ({ base64: 'Zm90bw==', mimeType: 'image/jpeg', mediaId: 'selected-photo' })) },
  };
  return { sdk, calls, uploads, get maxActive() { return maxActive; } };
}

test('Sanja 3.0 round trip preserves unknown fields and every original medium', () => {
  const source = fixture();
  source.storyBible.scenes[0].shots[0].generatedVideoBase64 = 'b3JpZ2luYWw=';
  source.storyBible.scenes[0].shots[0].videoResolution = '720p';
  source.storyBible.scenes[0].shots[0].isApproved = true;
  const project = importProject(`\uFEFF${JSON.stringify(source)}`);
  const exported = JSON.parse(exportProject(project));
  assert.deepEqual(exported, source);
  assert.notEqual(project, source);
  assert.deepEqual(projectStats(project), { characters: 1, locations: 1, assets: 2, readyCharacters: 1, readyLocations: 1,
    scenes: 1, shots: 3, images: 0, videos: 1, approved: 1, approvedVideos: 1, durationSeconds: 16, durationMinutes: 16 / 60, missingImages: 3, missingVideos: 2 });
});

test('real backup: 30 shots / 176 seconds; Rosa photo survives without media ID', () => {
  const original = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
  const project = importProject(original);
  const exported = JSON.parse(exportProject(project));
  const stats = projectStats(exported);
  assert.equal(stats.shots, 30);
  assert.equal(stats.durationSeconds, 176);
  assert.equal(stats.characters, 4);
  assert.equal(stats.locations, 2);
  const rosa = exported.storyBible.characters.find(c => c.name === 'Rosa');
  assert.ok(rosa.referenceSheetBase64);
  assert.equal(rosa.referenceMediaId, undefined);
  function originalsUnchanged(before, after) {
    for (const [key, value] of Object.entries(before)) {
      if (value && typeof value === 'object') originalsUnchanged(value, after[key]);
      else assert.equal(after[key], value, `Changed original property ${key}`);
    }
  }
  originalsUnchanged(original, exported);
  original.storyBible.characters.forEach((c, i) => assert.equal(hash(exported.storyBible.characters[i].referenceSheetBase64), hash(c.referenceSheetBase64)));
});

test('validation rejects broken IDs, durations and malformed lists before loading', () => {
  const project = fixture();
  project.storyBible.scenes[0].shots[0].characterIds = ['missing'];
  project.storyBible.scenes[0].shots[1].durationSeconds = -3;
  project.storyBible.scenes[0].shots[2].shotId = 's1';
  const report = validateProject(project);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(e => e.path.endsWith('characterIds')));
  assert.ok(report.errors.some(e => e.path.endsWith('durationSeconds')));
  assert.ok(report.errors.some(e => e.message.includes('duplicado')));
  assert.throws(() => importProject(project), /Projeto inválido/);
  assert.throws(() => importProject('{quebrado'), /JSON inválido/);
  assert.throws(() => importProject('[]'), /Esperado um objeto/);
  assert.throws(() => importProject('{}'), /não contém um projeto Sanja/);
  assert.throws(() => importProject({ settings: [], storyBible: { characters: {}, locations: [], scenes: [] } }), /Projeto inválido/);
});

test('validation rejects unknown wardrobe links instead of silently changing clothing', () => {
  const project = fixture(1);
  project.storyBible.scenes[0].shots[0].wardrobeMap = { rosa: 'missing-wardrobe' };
  assert.throws(() => importProject(project), /Figurino inexistente/);
});

test('a successful media-ID-only replacement never pairs its new ID with stale base64', async () => {
  const project = fixture(1);
  Object.assign(project.storyBible.scenes[0].shots[0], { generatedImageBase64: 'b2xk', imageMediaId: 'old' });
  const fake = fakeSdk({ image: () => ({ mediaId: 'new' }) });
  const service = createProductionService({ sdk: fake.sdk, project });
  await service.generateShot(0, 0);
  assert.equal(service.project.storyBible.scenes[0].shots[0].imageMediaId, 'new');
  assert.equal(service.project.storyBible.scenes[0].shots[0].generatedImageBase64, undefined);
});

test('normalization retains original aliases and supports videoResolution/isApproved', () => {
  const project = fixture(1);
  const shot = project.storyBible.scenes[0].shots[0];
  delete shot.videoResolution; delete shot.isApproved;
  shot.resolution = '720p'; shot.approved = true; shot.durationSeconds = '6';
  const loaded = importProject(project).storyBible.scenes[0].shots[0];
  assert.equal(loaded.videoResolution, '720p');
  assert.equal(loaded.isApproved, true);
  assert.equal(loaded.resolution, '720p');
  assert.equal(loaded.approved, true);
  assert.equal(loaded.durationSeconds, 6);
});

test('image prompt contains static opening only; video receives temporal direction and voice', () => {
  const project = fixture(1), { characters, locations, scenes } = project.storyBible;
  const shot = scenes[0].shots[0];
  const direction = splitShotDirection(shot);
  assert.match(direction.initialFrame, /segurando um copo/);
  assert.match(direction.temporalAction, /derrama a água/);
  assert.equal(splitShotDirection(joinShotDirection(direction)).initialFrame, direction.initialFrame);
  const image = assembleShotImagePrompt(shot, characters, locations, project.settings).prompt;
  assert.match(image, /segurando um copo/);
  assert.doesNotMatch(image, /derrama a água|Porta se fecha|Somente Rosa fala|Travelling|pagamento|sem pessoas|reflexos humanos|desocupad/i);
  const video = assembleVideoPrompt(shot, characters, locations, project.settings);
  assert.match(video, /derrama a água/);
  assert.match(video, /pagamento/);
  assert.match(video, /Cearense, suave/);
  assert.doesNotMatch(video, /Sem pessoas|reflexos humanos|desocupad/i);
});

test('legacy unlabeled action stays in video; it cannot become an action collage in an image', () => {
  const project = fixture(1), { characters, locations, scenes } = project.storyBible;
  scenes[0].shots[0].visualAction = 'Rosa corre, derrama água, desmaia e abre a porta.';
  const image = assembleShotImagePrompt(scenes[0].shots[0], characters, locations, project.settings);
  assert.equal(image.warnings.length, 1);
  assert.doesNotMatch(image.prompt, /desmaia|derrama|abre a porta/);
  assert.match(assembleVideoPrompt(scenes[0].shots[0], characters, locations, project.settings), /desmaia/);
});

test('location reference removes cast and body actions and adds explicit empty-environment rule', () => {
  const project = fixture(1);
  const location = { ...project.storyBible.locations[0], fixedDescription: 'Rosa está na porta. Balcão à direita. Uma mão segura a maçaneta.', atmosphere: 'A patroa prepara a armação.', lightingPalette: 'Luz branca suave e visibilidade das mãos.' };
  const prompt = assembleLocationReferencePrompt(location, project.settings, project.storyBible.characters);
  assert.match(prompt, /Balcão à direita/);
  assert.match(prompt, /Ambiente vazio e desocupado/);
  assert.match(prompt, /Sem pessoas, mãos, partes do corpo, silhuetas ou reflexos humanos/);
  assert.doesNotMatch(prompt, /Rosa está|Uma mão|patroa|visibilidade das mãos/);
  assert.equal(location.atmosphere, 'A patroa prepara a armação.');
});

test('Rosa in real backup is uploaded, never regenerated', async () => {
  const project = importProject(fs.readFileSync(originalPath, 'utf8'));
  const fake = fakeSdk();
  const service = createProductionService({ sdk: fake.sdk, project });
  const rosa = service.project.storyBible.characters.find(c => c.name === 'Rosa');
  const originalHash = hash(rosa.referenceSheetBase64);
  await service.generateCharacter(rosa.id);
  assert.deepEqual(fake.calls.map(c => c.kind), ['upload']);
  assert.equal(rosa.referenceMediaId, 'upload-1');
  assert.equal(hash(rosa.referenceSheetBase64), originalHash);
  await service.prepareReferences();
  assert.equal(fake.calls.length, 1, 'existing media IDs must not be uploaded or regenerated');
});

test('all 30 real storyboard prompts use only the opening and never inherit the empty-set ban', () => {
  const project = importProject(fs.readFileSync(originalPath, 'utf8'));
  const { characters, locations, scenes } = project.storyBible;
  for (const scene of scenes) for (const shot of scene.shots) {
    const direction = splitShotDirection(shot);
    const image = assembleShotImagePrompt(shot, characters, locations, project.settings);
    assert.ok(direction.hasExplicitInitialFrame, shot.shotId);
    assert.ok(image.prompt.includes(direction.initialFrame), shot.shotId);
    assert.doesNotMatch(image.prompt, /AÇÃO NO VÍDEO|SAÍDA PARA O CORTE|VOZ:|Sem pessoas|reflexos humanos|ambiente vazio e desocupado/i);
    if (direction.temporalAction) assert.equal(image.prompt.includes(direction.temporalAction), false, shot.shotId);
    if (direction.voice) assert.equal(image.prompt.includes(direction.voice), false, shot.shotId);
  }
});

test('uploads preserve original data URL bytes and use its MIME', async () => {
  const project = fixture(1);
  project.storyBible.characters[0].referenceSheetBase64 = 'data:image/webp;base64,cm9zYQ==';
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project });
  await service.prepareReferences();
  assert.equal(fake.uploads[0].base64, 'cm9zYQ==');
  assert.equal(fake.uploads[0].mimeType, 'image/webp');
  assert.equal(service.project.storyBible.characters[0].referenceSheetBase64, 'data:image/webp;base64,cm9zYQ==');
});

test('all SDK operations, even uploads/text and manual clicks, share one serial queue', async () => {
  const gate = deferred();
  const fake = fakeSdk({ upload: async () => { await gate.promise; return { mediaId: 'rosa-upload' }; } });
  const service = createProductionService({ sdk: fake.sdk, project: fixture(2) });
  const first = service.generateShot(0, 0), second = service.generateText('Olá'), third = service.generateShot(0, 1);
  await tick();
  assert.deepEqual(fake.calls.map(c => c.kind), ['upload']);
  gate.resolve();
  await Promise.all([first, second, third]);
  assert.equal(fake.maxActive, 1);
  assert.deepEqual(fake.calls.map(c => c.kind), ['upload', 'image', 'text', 'image']);
  assert.deepEqual(fake.calls.filter(c => c.kind === 'image')[0].args.referenceImageMediaIds, ['location-existing', 'rosa-upload']);
});

test('unavailable service pauses immediately; no retry and no fallback without identity references', async () => {
  const fake = fakeSdk({ image: () => { const error = new Error('O serviço de imagens está indisponível.'); error.status = 503; throw error; } });
  const service = createProductionService({ sdk: fake.sdk, project: fixture() });
  const state = await service.runStoryboard();
  assert.equal(state.state, 'paused');
  assert.equal(state.reason, 'service-unavailable');
  assert.equal(state.failed, 1);
  assert.equal(state.pending, 2);
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 1);
  assert.deepEqual(fake.calls.find(c => c.kind === 'image').args.referenceImageMediaIds, ['location-existing', 'upload-1']);
  assert.equal(service.project.storyBible.scenes[0].shots[1].imageStatus, 'pending');
});

test('resuming continues pending shots and never resubmits the failed paid request', async () => {
  let fail = true;
  const fake = fakeSdk({ image: () => { if (fail) { fail = false; throw new Error('timeout after submission'); } return { base64: 'b2s=', mediaId: 'ok' }; } });
  const service = createProductionService({ sdk: fake.sdk, project: fixture() });
  await service.runStoryboard();
  const state = await service.resume();
  assert.equal(state.completed, 2);
  assert.equal(state.failed, 1);
  assert.equal(state.pending, 0);
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 3);
  assert.equal(service.project.storyBible.scenes[0].shots[0].generatedImageBase64, undefined);
});

test('cancel waits for running generation and preserves its paid result', async () => {
  const gate = deferred();
  const fake = fakeSdk({ image: () => gate.promise });
  const service = createProductionService({ sdk: fake.sdk, project: fixture() });
  const running = service.runStoryboard();
  await tick();
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 1);
  const cancelled = service.cancel();
  assert.equal(cancelled.state, 'cancelling');
  let finished = false;
  running.then(() => { finished = true; });
  await tick(); assert.equal(finished, false);
  gate.resolve({ base64: 'cHJlc2VydmFkYQ==', mediaId: 'paid-result', mimeType: 'image/jpeg' });
  const state = await running;
  assert.equal(state.state, 'cancelled');
  assert.equal(state.completed, 1);
  assert.equal(state.cancelledCount, 2);
  assert.equal(service.project.storyBible.scenes[0].shots[0].imageMediaId, 'paid-result');
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 1);
});

test('cancel during upload saves new reference but stops before paid generation', async () => {
  const gate = deferred(), fake = fakeSdk({ upload: () => gate.promise });
  const service = createProductionService({ sdk: fake.sdk, project: fixture(1) });
  const job = service.generateShot(0, 0);
  await tick(); service.cancel();
  gate.resolve({ mediaId: 'saved-upload' });
  assert.deepEqual(await job, { cancelled: true });
  assert.equal(service.project.storyBible.characters[0].referenceMediaId, 'saved-upload');
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 0);
  assert.equal(service.project.storyBible.scenes[0].shots[0].imageStatus, 'pending');
});

test('failed regeneration keeps old frame and video bytes', async () => {
  const project = fixture(1);
  Object.assign(project.storyBible.scenes[0].shots[0], { generatedImageBase64: 'b2xk', imageMediaId: 'old-frame', generatedVideoBase64: 'b2xkLXZpZGVv', videoMediaId: 'old-video' });
  const fake = fakeSdk({ image: () => { throw new Error('Ambiguous submission failure'); } });
  const service = createProductionService({ sdk: fake.sdk, project });
  await assert.rejects(service.generateShot(0, 0), /Ambiguous/);
  assert.equal(service.project.storyBible.scenes[0].shots[0].generatedImageBase64, 'b2xk');
  assert.equal(service.project.storyBible.scenes[0].shots[0].generatedVideoBase64, 'b2xkLXZpZGVv');
  assert.equal(service.status.reason, 'review-required');
});

test('missing identity and reference overflow fail closed before generation', async () => {
  const project = fixture(1);
  delete project.storyBible.characters[0].referenceSheetBase64;
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project });
  await assert.rejects(service.generateShot(0, 0), /Falta a referência de Rosa/);
  assert.equal(fake.calls.length, 0);
  const complete = fixture(1);
  const second = createProductionService({ sdk: fake.sdk, project: complete, maxReferences: 1 });
  await assert.rejects(second.generateShot(0, 0), /limite é 1/);
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 0);
});

test('video uses original resolution field, duration, uploaded frame and approved flag', async () => {
  const project = fixture(1), shot = project.storyBible.scenes[0].shots[0];
  Object.assign(shot, { generatedImageBase64: 'ZnJhbWU=', videoResolution: '720p', isApproved: true });
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project });
  await service.generateVideo(0, 0);
  const request = fake.calls.find(c => c.kind === 'video').args;
  assert.equal(request.resolution, '720p');
  assert.equal(request.durationSeconds, 6);
  assert.equal(request.firstFrameImageMediaId, 'upload-1');
  assert.equal(service.project.storyBible.scenes[0].shots[0].isApproved, true);
  assert.equal(service.project.storyBible.scenes[0].shots[0].videoResolution, '720p');
});

test('unsupported video combination fails before upload instead of changing duration', async () => {
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project: fixture(1) });
  await assert.rejects(service.generateVideo(0, 0, { targetModel: 'Veo 3.1 - Lite', targetResolution: '360p' }), /Combinação não suportada/);
  assert.equal(fake.calls.length, 0);
  assert.equal(service.project.storyBible.scenes[0].shots[0].durationSeconds, 6);
});

test('approved 720p batch includes approved shots only and does not regenerate others', async () => {
  const project = fixture();
  project.storyBible.scenes[0].shots.forEach((shot, i) => Object.assign(shot, { imageMediaId: `frame-${i}`, isApproved: i === 1 }));
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project });
  const state = await service.runAnimation({ onlyMissing: false, approvedOnly: true, targetResolution: '720p' });
  assert.equal(state.completed, 1);
  assert.equal(fake.calls.length, 1);
  assert.equal(fake.calls[0].kind, 'video');
  assert.equal(fake.calls[0].args.firstFrameImageMediaId, 'frame-1');
  assert.equal(fake.calls[0].args.resolution, '720p');
});

test('photo import takes gallery bytes without a generative face adaptation', async () => {
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project: fixture(1) });
  await service.selectCharacterPhoto('rosa');
  assert.deepEqual(fake.calls.map(c => c.kind), ['select']);
  const rosa = service.project.storyBible.characters[0];
  assert.equal(rosa.referenceMediaId, 'selected-photo');
  assert.equal(rosa.referenceSheetBase64, rosa.userUploadedPhotoBase64);
});

test('an observer failure cannot mark paid success as failure or trigger a second call', async () => {
  const fake = fakeSdk(), service = createProductionService({ sdk: fake.sdk, project: fixture(1), onChange: () => { throw new Error('UI error'); }, onProgress: () => { throw new Error('UI error'); } });
  await service.generateShot(0, 0);
  assert.equal(service.project.storyBible.scenes[0].shots[0].imageStatus, 'completed');
  assert.equal(fake.calls.filter(c => c.kind === 'image').length, 1);
  assert.ok(service.observerErrors.length);
});

test('queue pause keeps pending jobs and cancellation settles them', async () => {
  const queue = new SafeProductionQueue();
  queue.pause();
  let called = false;
  const task = queue.enqueue(() => { called = true; });
  assert.equal((await queue.untilStopped()).pending, 1);
  queue.cancel();
  assert.deepEqual(await task, { cancelled: true });
  assert.equal(called, false);
});
