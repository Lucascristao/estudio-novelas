import {
  createProject, importProject, validateProject, cloneProject, flattenShots, VIDEO_MODELS_CAPABILITIES,
} from '../projeto/index.js';
import { NarrativeError, parseAiJson, countWords, dialogueBudget, renderScriptText, scriptSynchronization } from './text.js';
import {
  NARRATIVE_SYSTEM_INSTRUCTION, CHARACTER_SCHEMA, LOCATION_SCHEMA, sceneSchema, narrativeRules, narrativeCanon,
} from './prompts.js';

export { NarrativeError, parseAiJson, countWords, dialogueLimit, dialogueBudget, WORD_LIMITS_BY_DURATION, renderScriptText, scriptSynchronization } from './text.js';

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const json = value => JSON.stringify(value, null, 2);
const mediaKey = /^(?:.*Base64|referenceMediaId|userUploadedPhotoMediaId|imageMediaId|videoMediaId|mediaId)$/u;

function fail(code, message, issues = []) { throw new NarrativeError(code, message, { issues }); }

function assertSettings(settings) {
  dialogueBudget('', settings.secondsPerShot);
  if (!Number.isFinite(settings.durationMinutes) || settings.durationMinutes <= 0) fail('INVALID_DURATION', 'Informe uma duração total positiva em minutos.');
  return settings;
}

function assertNoInventedMedia(value, path = '$') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (mediaKey.test(key) && child) fail('AI_INVENTED_MEDIA', 'A IA retornou campos de mídia em uma operação de roteiro. Nenhuma mídia foi alterada.', [{ path: `${path}.${key}` }]);
    assertNoInventedMedia(child, `${path}.${key}`);
  }
}

function assertBibleShape(bible, { scenesRequired = true } = {}) {
  if (!object(bible)) fail('AI_INVALID_STORY', 'A IA não retornou uma bíblia da história.');
  for (const key of ['characters', 'locations', ...(scenesRequired ? ['scenes'] : [])]) {
    if (!Array.isArray(bible[key])) fail('AI_INVALID_STORY', `A resposta precisa conter a lista ${key}.`, [{ path: `storyBible.${key}` }]);
  }
  if (scenesRequired) {
    if (!bible.scenes.length) fail('AI_EMPTY_STORY', 'A IA não retornou cenas. O projeto anterior foi preservado.');
    for (const scene of bible.scenes) {
      if (!Array.isArray(scene?.shots) || !scene.shots.length) fail('AI_EMPTY_SCENE', 'Todas as cenas precisam conter tomadas.');
      for (const shot of scene.shots) {
        if (typeof shot?.visualAction !== 'string' || !shot.visualAction.trim() || typeof shot.dialogueLine !== 'string') {
          fail('AI_INVALID_SHOT', 'Cada tomada precisa conter ação visual e fala textual (vazia quando não houver fala).');
        }
      }
    }
  }
  assertNoInventedMedia(bible);
}

function checkedProject(candidate) {
  let project;
  try { project = importProject(candidate); }
  catch (cause) { throw new NarrativeError('AI_INVALID_PROJECT', 'A resposta não forma um projeto válido. Revise os vínculos e tente novamente.', { cause, issues: cause.errors || [] }); }
  const validation = validateProject(project);
  if (!validation.valid) fail('AI_INVALID_PROJECT', 'O projeto gerado contém vínculos inválidos.', validation.errors);
  const exceeded = flattenShots(project).filter(({ shot }) => dialogueBudget(shot.dialogueLine, shot.durationSeconds).exceeded)
    .map(({ shot }) => ({ shotId: shot.shotId, ...dialogueBudget(shot.dialogueLine, shot.durationSeconds) }));
  if (exceeded.length) fail('DIALOGUE_LIMIT', 'A IA retornou falas longas demais para as tomadas. Nenhuma fala foi cortada nem substituída.', exceeded);
  return project;
}

function readBible(payload) { return object(payload?.storyBible) ? payload.storyBible : payload; }

function newProjectFromBible(source, bible, settings, extras = {}) {
  const project = checkedProject({ ...source, ...extras, title: bible.title || source.title,
    logline: bible.logline || '', settings, storyBible: bible });
  project.scriptText = renderScriptText(project);
  project.scriptSync = { status: 'synced', source: 'storyboard' };
  return project;
}

function historyEntry(project) {
  return { episode: project.settings.currentEpisode, title: project.title, logline: project.logline,
    settings: cloneProject(project.settings), storyBible: cloneProject(project.storyBible),
    scriptText: project.scriptText, scriptSync: scriptSynchronization(project) };
}

function uniqueEpisodeIds(scenes, project, episode) {
  const previousBibles = [project.storyBible, ...(project.episodeHistory || []).map(entry => entry.storyBible).filter(Boolean)];
  const oldSceneIds = new Set(previousBibles.flatMap(bible => bible.scenes.map(scene => scene.sceneId)));
  const oldShotIds = new Set(previousBibles.flatMap(bible => bible.scenes.flatMap(scene => scene.shots.map(shot => shot.shotId))));
  const allocatedScenes = new Set(), allocatedShots = new Set();
  const id = (original, old, allocated) => {
    if (typeof original !== 'string' || !original.trim()) fail('AI_INVALID_ID', 'A continuação retornou um identificador vazio.');
    if (allocated.has(original)) fail('AI_DUPLICATE_ID', `A continuação repetiu o identificador ${original}.`);
    allocated.add(original);
    if (!old.has(original)) { old.add(original); return original; }
    let candidate = `ep${episode}_${original}`, suffix = 2;
    while (old.has(candidate)) candidate = `ep${episode}_${original}_${suffix++}`;
    old.add(candidate);
    return candidate;
  };
  return scenes.map(scene => ({ ...scene, sceneId: id(scene.sceneId, oldSceneIds, allocatedScenes),
    shots: scene.shots.map(shot => ({ ...shot, shotId: id(shot.shotId, oldShotIds, allocatedShots) })) }));
}

function mergeCanon(original, incoming, label, allowNewAssets) {
  if (incoming !== undefined && !Array.isArray(incoming)) fail('AI_INVALID_CANON', `${label} deve ser uma lista.`);
  const ids = new Set(original.map(item => item.id)), extras = [], seen = new Set();
  for (const item of incoming || []) {
    if (!object(item) || typeof item.id !== 'string' || !item.id.trim()) fail('AI_INVALID_CANON', `${label}: identificador ausente.`);
    if (seen.has(item.id)) fail('AI_DUPLICATE_ID', `${label}: identificador repetido ${item.id}.`);
    seen.add(item.id);
    // Existing IDs always resolve to the unchanged local identity, including all media and unknown fields.
    if (ids.has(item.id)) continue;
    if (!allowNewAssets) fail('AI_NEW_ASSET', `A continuação tentou criar ${label.toLowerCase()} fora da bíblia: ${item.id}. Autorize novas fichas ou revise a resposta.`);
    if (original.some(existing => existing.name?.trim().toLocaleLowerCase('pt-BR') === item.name?.trim().toLocaleLowerCase('pt-BR'))) {
      fail('AI_CANON_CONFLICT', `A continuação tentou trocar o ID de ${item.name}. Use o ID da ficha existente.`);
    }
    assertNoInventedMedia(item);
    extras.push(item);
  }
  return [...cloneProject(original), ...cloneProject(extras)];
}

export function createNarrativeService(options = {}) { return new NarrativeService(options); }

/** Text SDK is injected. No request is made on construction, import, edit or default change. */
export class NarrativeService {
  constructor({ sdk, project = createProject(), onChange = () => {}, onProgress = () => {} } = {}) {
    this.sdk = sdk;
    this._project = importProject(project);
    this._project.scriptSync = scriptSynchronization(this._project);
    this._revision = 0;
    this._projectGeneration = 0;
    this._busy = false;
    this._status = { state: 'idle', operation: null };
    this.onChange = onChange;
    this.onProgress = onProgress;
    this.observerErrors = [];
  }
  get project() { return this._project; }
  get status() { return { ...this._status }; }
  get scriptStatus() { return scriptSynchronization(this._project); }
  _notify(callback, value) { try { callback(value); } catch (error) { this.observerErrors.push(error); } }
  _progress(status) { this._status = status; this._notify(this.onProgress, this.status); }
  _commit(candidate, revision, event) {
    if (revision !== this._revision) fail('STALE_PROJECT', 'O projeto mudou durante a solicitação. A resposta não substituiu suas edições; revise e tente novamente.');
    this._project = importProject(candidate);
    this._project.scriptSync = scriptSynchronization(this._project);
    this._revision++;
    try { this.onChange(this._project, event); } catch (error) { this.observerErrors.push(error); }
    return this._project;
  }
  async _run(operation, action) {
    if (this._busy) throw new NarrativeError('BUSY', 'Já existe uma solicitação de texto em andamento. Aguarde antes de iniciar outra.', { operation });
    this._busy = true;
    this._progress({ state: 'running', operation });
    try {
      const result = await action(importProject(this._project), this._revision);
      this._progress({ state: 'completed', operation });
      return result;
    } catch (cause) {
      const error = cause instanceof NarrativeError ? cause : new NarrativeError('AI_REQUEST_FAILED', 'A IA não concluiu a solicitação. O projeto foi preservado e você pode tentar novamente.', { cause, operation });
      error.operation ??= operation;
      this._progress({ state: 'error', operation, code: error.code, message: error.message, recoverable: true });
      throw error;
    } finally { this._busy = false; }
  }
  async _requestJson(prompt, operation) {
    if (typeof this.sdk?.generate?.text !== 'function') fail('SDK_REQUIRED', 'Injete o SDK de texto do Flow para executar esta ação.');
    const response = await this.sdk.generate.text(prompt, { systemInstruction: NARRATIVE_SYSTEM_INSTRUCTION });
    const raw = typeof response === 'string' ? response : response?.text;
    const parsed = parseAiJson(raw);
    if (object(parsed) && parsed.error) fail('AI_REPORTED_ERROR', `A IA não concluiu: ${typeof parsed.error === 'string' ? parsed.error : 'resposta de erro'}.`);
    return parsed;
  }
  _edit(mutator, event, { syncText = false } = {}) {
    const next = importProject(this._project);
    mutator(next);
    if (syncText) next.scriptText = renderScriptText(next);
    return this._commit(next, this._revision, event);
  }
  setProject(project) {
    const candidate = importProject(project);
    this._projectGeneration++;
    return this._commit(candidate, this._revision, { type: 'project-loaded' });
  }
  editScriptText(text) {
    if (typeof text !== 'string') fail('INVALID_TEXT', 'O texto do roteiro precisa ser uma string.');
    return this._edit(project => { project.scriptText = text; }, { type: 'script-edited' });
  }
  syncScriptText() { return this._edit(() => {}, { type: 'script-synced' }, { syncText: true }); }
  updateShot(shotId, patch, { syncText = false } = {}) {
    if (!object(patch)) fail('INVALID_PATCH', 'Informe os campos da tomada em um objeto.');
    if (Object.hasOwn(patch, 'shotId') && patch.shotId !== shotId) fail('IMMUTABLE_ID', 'O ID da tomada deve permanecer estável.');
    return this._edit(project => {
      const target = flattenShots(project).find(({ shot }) => shot.shotId === shotId);
      if (!target) fail('SHOT_NOT_FOUND', `Tomada não encontrada: ${shotId}.`);
      target.scene.shots[target.shotIndex] = { ...target.shot, ...cloneProject(patch) };
    }, { type: 'shot-edited', shotId }, { syncText });
  }
  setDefaultVideoModel(model, { resolution, durationSeconds } = {}) {
    const cap = VIDEO_MODELS_CAPABILITIES[model];
    if (!cap) fail('UNSUPPORTED_MODEL', 'Modelo de vídeo desconhecido.');
    return this._edit(project => {
      const settings = project.settings;
      const res = resolution ?? (cap.supportedResolutions.includes(settings.defaultResolution) ? settings.defaultResolution : cap.supportedResolutions[0]);
      const duration = durationSeconds ?? (cap.supportedDurations.includes(settings.secondsPerShot) ? settings.secondsPerShot : cap.supportedDurations[0]);
      if (!cap.supportedResolutions.includes(res) || !cap.supportedDurations.includes(duration)) fail('UNSUPPORTED_SETTINGS', 'Resolução ou duração padrão incompatível com o modelo.');
      project.settings = { ...settings, defaultVideoModel: model, defaultResolution: res, secondsPerShot: duration };
      // Existing shots, their durations, model selections, media and approvals are deliberately untouched.
    }, { type: 'default-video-model-changed', model });
  }
  suggestIdeas({ theme, settings: overrides = {}, count = 4 } = {}) {
    return this._run('suggestIdeas', async source => {
      if (!Number.isInteger(count) || count < 1 || count > 20) fail('INVALID_IDEA_COUNT', 'Peça entre 1 e 20 ideias.');
      const settings = assertSettings({ ...source.settings, ...overrides });
      const payload = await this._requestJson(`Sugira exatamente ${count} ideias de mininovelas. ${narrativeRules(settings)}\nFiltros: ${json({
        theme: theme ?? settings.nicheTheme ?? '', genre: settings.selectedDramaGenre ?? 'Melodrama / Novela',
        keywords: settings.keywords ?? [], storyRealism: settings.storyRealism ?? 'ficticia', narrativeStructure: settings.narrativeStructure,
        tone: settings.storyTone ?? 'dramático', aspectRatio: settings.aspectRatio,
      })}\nRetorne um array JSON com ${count} objetos {"id":"id único","title":"Título","premise":"Premissa","category":"Gênero","subgenre":"Subgênero coerente","storyRealism":"real ou ficticia","structure":"Estrutura","hook":"Gancho de 3s"}. Se o filtro pedir fatos reais, não afirme origem documentada sem fonte fornecida.`, 'suggestIdeas');
      const ideas = Array.isArray(payload) ? payload : payload?.ideas;
      if (!Array.isArray(ideas) || ideas.length !== count) fail('AI_INVALID_IDEAS', `A IA precisa retornar exatamente ${count} ideias.`);
      const ids = new Set();
      for (const idea of ideas) {
        if (!object(idea) || !['id', 'title', 'premise', 'hook'].every(key => typeof idea[key] === 'string' && idea[key].trim()) || ids.has(idea.id)) {
          fail('AI_INVALID_IDEAS', 'Ideias incompletas ou com IDs repetidos. O projeto não foi alterado.');
        }
        ids.add(idea.id);
      }
      return cloneProject(ideas);
    });
  }
  generateStory({ idea = null, theme = '', settings: overrides = {}, replace = false } = {}) {
    return this._run('generateStory', async (source, revision) => {
      if (!replace && (source.storyBible.scenes.length || source.storyBible.characters.length || source.scriptText.trim())) {
        fail('REPLACEMENT_REQUIRED', 'O projeto já contém trabalho. Salve uma cópia e escolha explicitamente substituir ou criar outro projeto.');
      }
      const settings = assertSettings({ ...source.settings, ...overrides });
      const foundation = readBible(await this._requestJson(`ETAPA 1/2 — Crie a base de uma mininovela a partir de ${json({ idea, theme: theme || settings.nicheTheme || source.title })}. ${narrativeRules(settings)}\nRetorne um objeto JSON com title, logline, storyRealism, narrativeStructure, hook, centralConflict, ending {type,description,finalPunchline}, characters, locations e acts. Modelo de personagem: ${json(CHARACTER_SCHEMA)}. Modelo de locação: ${json(LOCATION_SCHEMA)}. Não inclua scenes nesta etapa.`, 'generateStory:foundation'));
      assertBibleShape(foundation, { scenesRequired: false });
      const partial = checkedProject({ ...source, settings, storyBible: { ...foundation, scenes: [] } });
      this._progress({ state: 'running', operation: 'generateStory', stage: 'shots', step: 2, totalSteps: 2 });
      const target = Math.ceil(settings.durationMinutes * 60 / settings.secondsPerShot);
      const result = await this._requestJson(`ETAPA 2/2 — Decupe esta bíblia em aproximadamente ${target} tomadas, total alvo ${settings.durationMinutes * 60}s. ${narrativeRules(settings)}\nBÍBLIA: ${json(narrativeCanon(partial))}\nRetorne {"scenes":[...]} com cenas completas no modelo: ${json(sceneSchema(settings))}. Use somente os IDs de personagens, figurinos e locações da bíblia; IDs de cena/tomada devem ser únicos.`, 'generateStory:shots');
      const bible = { ...foundation, scenes: result?.scenes };
      assertBibleShape(bible);
      return this._commit(newProjectFromBible(source, bible, settings), revision, { type: 'story-generated' });
    });
  }
  convertScript(rawScript, { settings: overrides = {}, replace = false } = {}) {
    return this._run('convertScript', async (source, revision) => {
      if (typeof rawScript !== 'string' || !rawScript.trim()) fail('EMPTY_SCRIPT', 'Cole ou digite o roteiro completo antes de converter.');
      if (!replace && source.storyBible.scenes.length) fail('REPLACEMENT_REQUIRED', 'Já existem tomadas no projeto. Escolha explicitamente substituir após salvar uma cópia.');
      const settings = assertSettings({ ...source.settings, ...overrides });
      const payload = await this._requestJson(`Converta TODO o roteiro abaixo em uma bíblia Sanja, preservando acontecimentos, personagens, falas e sequência. Não resuma nem ignore o final. Divida falas longas em tomadas coerentes, sem cortar seu sentido. ${narrativeRules(settings)}\nROTEIRO COMPLETO (string JSON, ${rawScript.length} caracteres):\n${JSON.stringify(rawScript)}\nRetorne um único objeto JSON com title, logline, storyRealism, narrativeStructure, hook, centralConflict, ending, acts, characters, locations e scenes. Personagem: ${json(CHARACTER_SCHEMA)}. Locação: ${json(LOCATION_SCHEMA)}. Cena: ${json(sceneSchema(settings))}.`, 'convertScript');
      const bible = readBible(payload);
      assertBibleShape(bible);
      return this._commit(newProjectFromBible(source, bible, settings, { sourceScriptText: rawScript }), revision, { type: 'script-converted', sourceCharacters: rawScript.length });
    });
  }
  continueEpisode({ directive = '', settings: overrides = {}, finalEpisode, allowNewAssets = false } = {}) {
    return this._run('continueEpisode', async (source, revision) => {
      if (!source.storyBible.scenes.length) fail('EMPTY_STORY', 'Crie ou importe o episódio anterior antes de continuar.');
      const current = source.settings.currentEpisode;
      if (!Number.isInteger(current) || current < 1) fail('INVALID_EPISODE', 'O número do episódio atual precisa ser um inteiro positivo.');
      if (source.episodeHistory !== undefined && !Array.isArray(source.episodeHistory)) fail('HISTORY_CONFLICT', 'O histórico existente tem outro formato; preserve-o antes de continuar.');
      const episode = current + 1;
      const settings = assertSettings({ ...source.settings, ...overrides, productionType: 'series', currentEpisode: episode });
      const last = flattenShots(source).at(-1)?.shot;
      const response = readBible(await this._requestJson(`Continue EFETIVAMENTE o episódio ${current} na parte ${episode}, começando pela consequência da última tomada ${json(last && { shotId: last.shotId, visualAction: last.visualAction, dialogueLine: last.dialogueLine, speakerName: last.speakerName })}. Não reinicie a história nem repita o episódio anterior. ${narrativeRules(settings)}\n${(finalEpisode ?? episode >= 3) ? 'Esta parte deve fechar a história e resolver o conflito.' : 'Esta parte deve terminar em um gancho forte para a seguinte.'}\nDireção adicional: ${JSON.stringify(directive)}\nBÍBLIA ANTERIOR COMPLETA DE DIREÇÃO E IDENTIDADE (IDs, vozes, figurinos, locais, cenas e falas):\n${json(narrativeCanon(source))}\nPreserve exatamente os IDs e identidades existentes. ${allowNewAssets ? 'Novas fichas devem ter IDs novos e não podem renomear identidades antigas.' : 'Não crie novas fichas: use somente os personagens, figurinos e cenários existentes.'}\nRetorne {title,logline,hook,centralConflict,ending,acts,scenes}; personagens/locações existentes são opcionais no retorno e nunca substituem as fichas locais. Exemplo de cena: ${json(sceneSchema(settings))}.`, 'continueEpisode'));
      if (!object(response)) fail('AI_INVALID_STORY', 'A continuação precisa ser um objeto JSON.');
      if (!Array.isArray(response.scenes) || !response.scenes.length) fail('AI_EMPTY_STORY', 'A IA não retornou novas cenas para a continuação. O episódio anterior foi preservado.');
      const characters = mergeCanon(source.storyBible.characters, response.characters, 'Personagens', allowNewAssets);
      const locations = mergeCanon(source.storyBible.locations, response.locations, 'Cenários', allowNewAssets);
      const bible = { ...source.storyBible, ...response, characters, locations };
      // Canonical local media are valid; only the new scenes may not invent any media fields.
      assertBibleShape({ ...bible, characters: [], locations: [] });
      bible.scenes = uniqueEpisodeIds(bible.scenes, source, episode);
      const project = newProjectFromBible(source, bible, settings, { episodeHistory: [...(source.episodeHistory || []), historyEntry(source)] });
      return this._commit(project, revision, { type: 'episode-continued', episode });
    });
  }
  shortenDialogue(shotId, { syncText = false } = {}) {
    return this._run('shortenDialogue', async source => {
      const projectGeneration = this._projectGeneration;
      const original = flattenShots(source).find(({ shot }) => shot.shotId === shotId)?.shot;
      if (!original) fail('SHOT_NOT_FOUND', `Tomada não encontrada: ${shotId}.`);
      if (!original.dialogueLine?.trim()) fail('EMPTY_DIALOGUE', 'Esta tomada não contém fala para encurtar.');
      const budget = dialogueBudget(original.dialogueLine, original.durationSeconds);
      const response = await this._requestJson(`Encurte esta fala preservando sentido, intenção e português brasileiro para no máximo ${budget.maxWords} palavras em ${original.durationSeconds}s. Não mude nomes nem acrescente acontecimentos.\n${json({ speaker: original.speakerName, context: original.visualAction, dialogueLine: original.dialogueLine })}\nRetorne somente {"dialogueLine":"fala encurtada"}.`, 'shortenDialogue');
      if (!object(response) || typeof response.dialogueLine !== 'string' || !response.dialogueLine.trim()) fail('AI_INVALID_DIALOGUE', 'A IA não retornou uma fala válida. A fala original foi preservada.');
      const line = response.dialogueLine.trim(), result = dialogueBudget(line, original.durationSeconds);
      if (result.exceeded || result.words > countWords(original.dialogueLine)) fail('DIALOGUE_LIMIT', 'A fala retornada não foi encurtada para o limite solicitado. A original foi preservada.', [result]);
      const latest = flattenShots(this._project).find(({ shot }) => shot.shotId === shotId)?.shot;
      if (projectGeneration !== this._projectGeneration || !latest || ['dialogueLine', 'durationSeconds', 'speakerCharacterId', 'speakerName', 'visualAction'].some(key => latest[key] !== original[key])) {
        fail('STALE_PROJECT', 'A fala ou sua direção mudou enquanto a IA respondia. A edição mais recente foi preservada.');
      }
      return this.updateShot(shotId, { dialogueLine: line }, { syncText });
    });
  }
}
