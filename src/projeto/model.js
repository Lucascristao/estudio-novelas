/** Sanja 3.0 compatibility. This module deliberately has no browser/Node dependencies. */
export const DEFAULT_SETTINGS = Object.freeze({
  language: 'Português (Brasil)', aspectRatio: '9:16', durationMinutes: 3,
  secondsPerShot: 6, style: 'Cinematográfico Ultra-Realista', cameraTone: 'Dramático com Cortes Alternados',
  defaultVideoModel: 'Omni 1.1 Flash', defaultResolution: '720p', hasNarrator: false,
  productionType: 'single', currentEpisode: 1,
});

export class ProjectValidationError extends Error {
  constructor(errors) {
    super(`Projeto inválido: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`);
    this.name = 'ProjectValidationError';
    this.errors = errors;
  }
}

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];
export const cloneProject = value => JSON.parse(JSON.stringify(value));

export function createProject(overrides = {}) {
  return normalizeProject({ title: 'Nova novela', logline: '', scriptText: '', version: '3.0',
    settings: {}, storyBible: { characters: [], locations: [], scenes: [], acts: [] }, ...overrides });
}

/** Adds absent defaults; preserves all existing properties, media, ordering and IDs. */
export function normalizeProject(input) {
  if (!object(input)) throw new ProjectValidationError([{ path: '$', message: 'Esperado um objeto JSON.' }]);
  const project = cloneProject(input);
  project.version ??= '3.0';
  project.title ??= '';
  project.logline ??= '';
  project.scriptText ??= '';
  if (project.settings == null) project.settings = {};
  if (object(project.settings)) project.settings = { ...DEFAULT_SETTINGS, ...project.settings };
  if (project.storyBible == null) project.storyBible = { characters: [], locations: [], scenes: [], acts: [] };
  if (!object(project.storyBible)) return project;
  const bible = project.storyBible;
  for (const field of ['characters', 'locations', 'scenes', 'acts']) bible[field] ??= [];
  for (const character of list(bible.characters)) {
    if (!object(character)) continue;
    character.physicalTraits ??= {};
    character.voiceProfile ??= {};
    character.wardrobes ??= [];
    character.status ??= character.referenceSheetBase64 || character.referenceMediaId ? 'completed' : 'pending';
  }
  for (const location of list(bible.locations)) {
    if (!object(location)) continue;
    location.status ??= location.generatedImageBase64 || location.mediaId ? 'completed' : 'pending';
  }
  for (const scene of list(bible.scenes)) {
    if (!object(scene)) continue;
    scene.shots ??= [];
    for (const shot of list(scene.shots)) {
      if (!object(shot)) continue;
      shot.durationSeconds ??= project.settings?.secondsPerShot ?? 6;
      if (typeof shot.durationSeconds === 'string' && /^\d+(?:\.\d+)?$/.test(shot.durationSeconds)) shot.durationSeconds = Number(shot.durationSeconds);
      shot.characterIds ??= [];
      shot.wardrobeMap ??= {};
      shot.visualAction ??= '';
      shot.dialogueLine ??= '';
      shot.videoResolution ??= shot.resolution ?? project.settings?.defaultResolution ?? '720p';
      shot.videoModel ??= project.settings?.defaultVideoModel ?? 'Omni 1.1 Flash';
      shot.isApproved ??= typeof shot.approved === 'boolean' ? shot.approved : false;
      shot.imageStatus ??= shot.generatedImageBase64 || shot.imageMediaId ? 'completed' : 'pending';
      shot.videoStatus ??= shot.generatedVideoBase64 || shot.videoMediaId ? 'completed' : 'pending';
    }
  }
  return project;
}

export function flattenShots(project) {
  return list(project?.storyBible?.scenes).flatMap((scene, sceneIndex) =>
    list(scene.shots).map((shot, shotIndex) => ({ scene, shot, sceneIndex, shotIndex, sceneIdx: sceneIndex, shotIdx: shotIndex })));
}

export function validateProject(project) {
  const errors = [], warnings = [];
  const issue = (path, message) => errors.push({ path, message });
  if (!object(project)) return { valid: false, errors: [{ path: '$', message: 'Esperado um objeto JSON.' }], warnings };
  for (const field of ['title', 'logline', 'scriptText']) if (project[field] != null && typeof project[field] !== 'string') issue(field, 'Esperado texto.');
  if (project.version != null && String(project.version) !== '3.0') warnings.push({ path: 'version', message: `Versão ${project.version}; os campos desconhecidos serão preservados.` });
  if (!object(project.settings)) issue('settings', 'Esperado um objeto.');
  if (!object(project.storyBible)) return { valid: false, errors: [...errors, { path: 'storyBible', message: 'Esperado um objeto.' }], warnings };
  const bible = project.storyBible;
  for (const field of ['characters', 'locations', 'scenes']) if (!Array.isArray(bible[field])) issue(`storyBible.${field}`, 'Esperada uma lista.');
  const idSet = (items, key, path) => {
    const ids = new Set();
    list(items).forEach((item, index) => {
      if (!object(item)) { issue(`${path}[${index}]`, 'Esperado um objeto.'); return; }
      const id = item[key];
      if (typeof id !== 'string' || !id.trim()) issue(`${path}[${index}].${key}`, 'Identificador ausente.');
      else if (ids.has(id)) issue(`${path}[${index}].${key}`, `Identificador duplicado: ${id}.`);
      else ids.add(id);
    });
    return ids;
  };
  const characters = idSet(bible.characters, 'id', 'storyBible.characters');
  const locations = idSet(bible.locations, 'id', 'storyBible.locations');
  idSet(bible.scenes, 'sceneId', 'storyBible.scenes');
  const shotIds = new Set();
  list(bible.scenes).forEach((scene, si) => {
    if (!object(scene)) return;
    if (!Array.isArray(scene.shots)) { issue(`storyBible.scenes[${si}].shots`, 'Esperada uma lista.'); return; }
    scene.shots.forEach((shot, hi) => {
      const path = `storyBible.scenes[${si}].shots[${hi}]`;
      if (!object(shot)) { issue(path, 'Esperado um objeto.'); return; }
      if (typeof shot.shotId !== 'string' || !shot.shotId.trim()) issue(`${path}.shotId`, 'Identificador ausente.');
      else if (shotIds.has(shot.shotId)) issue(`${path}.shotId`, 'Identificador de tomada duplicado.');
      else shotIds.add(shot.shotId);
      if (typeof shot.durationSeconds !== 'number' || !Number.isFinite(shot.durationSeconds) || shot.durationSeconds <= 0) issue(`${path}.durationSeconds`, 'A duração deve ser um número positivo.');
      if (!Array.isArray(shot.characterIds)) issue(`${path}.characterIds`, 'Esperada uma lista.');
      else for (const id of shot.characterIds) if (!characters.has(id)) issue(`${path}.characterIds`, `Personagem inexistente: ${id}.`);
      if (shot.locationId && !locations.has(shot.locationId)) issue(`${path}.locationId`, `Cenário inexistente: ${shot.locationId}.`);
      if (shot.speakerCharacterId && !characters.has(shot.speakerCharacterId)) issue(`${path}.speakerCharacterId`, 'Personagem falante inexistente.');
      if (shot.speakerCharacterId && !list(shot.characterIds).includes(shot.speakerCharacterId)) warnings.push({ path, message: 'O falante está fora do elenco visível da tomada; confira a voz fora de quadro.' });
      if (!object(shot.wardrobeMap)) issue(`${path}.wardrobeMap`, 'Esperado um objeto.');
      else for (const [characterId, wardrobeId] of Object.entries(shot.wardrobeMap)) {
        const character = list(bible.characters).find(c => c?.id === characterId);
        if (!character) issue(`${path}.wardrobeMap`, `Personagem inexistente: ${characterId}.`);
        else if (!list(character.wardrobes).some(w => w?.id === wardrobeId)) issue(`${path}.wardrobeMap.${characterId}`, `Figurino inexistente: ${wardrobeId}.`);
      }
      if (typeof shot.isApproved !== 'boolean') issue(`${path}.isApproved`, 'Esperado verdadeiro ou falso.');
      for (const key of ['visualAction', 'dialogueLine', 'videoResolution', 'videoModel']) if (typeof shot[key] !== 'string') issue(`${path}.${key}`, 'Esperado texto.');
    });
  });
  list(bible.characters).forEach((character, index) => {
    if (!object(character)) return;
    if (!Array.isArray(character.wardrobes)) issue(`storyBible.characters[${index}].wardrobes`, 'Esperada uma lista.');
    if (!object(character.physicalTraits)) issue(`storyBible.characters[${index}].physicalTraits`, 'Esperado um objeto.');
    if (!object(character.voiceProfile)) issue(`storyBible.characters[${index}].voiceProfile`, 'Esperado um objeto.');
    if (character.defaultWardrobeId && !list(character.wardrobes).some(w => w?.id === character.defaultWardrobeId)) issue(`storyBible.characters[${index}].defaultWardrobeId`, 'Figurino padrão inexistente.');
  });
  return { valid: errors.length === 0, errors, warnings };
}

export function importProject(input) {
  let parsed = input;
  if (typeof input === 'string') {
    try { parsed = JSON.parse(input.replace(/^\uFEFF/, '')); }
    catch { throw new ProjectValidationError([{ path: '$', message: 'JSON inválido.' }]); }
  }
  if (object(parsed) && !Object.hasOwn(parsed, 'storyBible')) throw new ProjectValidationError([{ path: 'storyBible', message: 'Este arquivo não contém um projeto Sanja. Importe o JSON completo do projeto.' }]);
  const project = normalizeProject(parsed);
  const validation = validateProject(project);
  if (!validation.valid) throw new ProjectValidationError(validation.errors);
  return project;
}

export function exportProject(project, { pretty = true, savedAt } = {}) {
  const validated = importProject(project);
  if (savedAt !== undefined) validated.savedAt = savedAt;
  return JSON.stringify(validated, null, pretty ? 2 : undefined);
}

export function projectStats(project) {
  const shots = flattenShots(project).map(item => item.shot);
  const characters = list(project?.storyBible?.characters), locations = list(project?.storyBible?.locations);
  const has = (item, base64, mediaId) => Boolean(item[base64] || item[mediaId]);
  const seconds = shots.reduce((sum, shot) => sum + (Number.isFinite(Number(shot.durationSeconds)) && Number(shot.durationSeconds) > 0 ? Number(shot.durationSeconds) : 0), 0);
  return {
    characters: characters.length, locations: locations.length, assets: characters.length + locations.length,
    readyCharacters: characters.filter(c => has(c, 'referenceSheetBase64', 'referenceMediaId') || c.userUploadedPhotoMediaId).length,
    readyLocations: locations.filter(l => has(l, 'generatedImageBase64', 'mediaId')).length,
    scenes: list(project?.storyBible?.scenes).length, shots: shots.length,
    images: shots.filter(s => has(s, 'generatedImageBase64', 'imageMediaId')).length,
    videos: shots.filter(s => has(s, 'generatedVideoBase64', 'videoMediaId')).length,
    approved: shots.filter(s => s.isApproved === true).length,
    approvedVideos: shots.filter(s => s.isApproved === true && has(s, 'generatedVideoBase64', 'videoMediaId')).length,
    durationSeconds: seconds, durationMinutes: seconds / 60,
    missingImages: shots.filter(s => !has(s, 'generatedImageBase64', 'imageMediaId')).length,
    missingVideos: shots.filter(s => !has(s, 'generatedVideoBase64', 'videoMediaId')).length,
  };
}
