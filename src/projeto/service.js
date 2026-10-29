import { createProject, importProject, flattenShots } from './model.js';
import { SafeProductionQueue, CancelledOperationError } from './queue.js';
import { assembleCharacterReferenceSheetPrompt, assembleLocationReferencePrompt, assembleShotImagePrompt, assembleVideoPrompt } from './prompts.js';

// Capabilities recovered from the original. Unsupported combinations fail before generation.
export const VIDEO_MODELS_CAPABILITIES = Object.freeze({
  'Omni 1.1 Flash': { supportedDurations: [4, 6, 8, 10], supportedResolutions: ['360p', '720p'] },
  'Veo 3.1 - Lite': { supportedDurations: [8], supportedResolutions: ['720p'] },
  'Veo 3.1 - Fast': { supportedDurations: [8], supportedResolutions: ['720p'] },
  'Veo 3.1 - Quality': { supportedDurations: [8], supportedResolutions: ['720p'] },
});
export const DEFAULT_IMAGE_MODEL = '🍌 Nano Banana Pro';

function uploadData(base64, mimeType = 'image/jpeg') {
  const match = /^data:([^;,]+);base64,([\s\S]+)$/.exec(base64 || '');
  return match ? { base64: match[2], mimeType: match[1] } : { base64, mimeType };
}
const hasImage = shot => Boolean(shot.generatedImageBase64 || shot.imageMediaId);
const hasVideo = shot => Boolean(shot.generatedVideoBase64 || shot.videoMediaId);

export function createProductionService(options = {}) { return new ProductionService(options); }

export class ProductionService {
  constructor({ sdk, project = createProject(), onChange = () => {}, onProgress = () => {}, maxReferences = 5 } = {}) {
    if (!sdk) throw new Error('Injete o SDK do Flow; o núcleo não conecta a serviços por conta própria.');
    this.sdk = sdk;
    this._project = importProject(project);
    this.onChange = onChange;
    this.observerErrors = [];
    this.maxReferences = maxReferences;
    this.queue = new SafeProductionQueue({ onProgress });
  }
  get project() { return this._project; }
  get status() { return this.queue.snapshot(); }
  setProject(project) {
    if (this.queue.active || this.queue.pending.length) throw new Error('Aguarde ou cancele a fila antes de trocar o projeto.');
    this._project = importProject(project);
    this.queue.reset();
    return this._project;
  }
  changed(event) {
    try { this.onChange(this._project, event); }
    catch (error) { this.observerErrors.push(error); }
  }
  checkCancelled() { if (this.queue.cancelled) throw new CancelledOperationError(); }
  begin() {
    if (!this.queue.active && !this.queue.pending.length && this.queue.cancelled) this.queue.reset();
  }
  enqueue(label, operation) { this.begin(); return this.queue.enqueue(operation, { label }); }
  pause() { return this.queue.pause(); }
  resume() { this.queue.resume(); return this.queue.untilStopped(); }
  cancel() { return this.queue.cancel(); }
  async idle() { return this.queue.untilStopped(); }
  shotAt(sceneIndex, shotIndex) {
    const shot = this._project.storyBible.scenes[sceneIndex]?.shots[shotIndex];
    if (!shot) throw new Error('Tomada não encontrada.');
    return shot;
  }
  character(id) {
    const character = this._project.storyBible.characters.find(c => c.id === id);
    if (!character) throw new Error(`Personagem não encontrado: ${id}.`);
    return character;
  }
  location(id) {
    const location = this._project.storyBible.locations.find(l => l.id === id);
    if (!location) throw new Error(`Cenário não encontrado: ${id}.`);
    return location;
  }
  async ensureImage(asset, { idKey, base64Key, mimeKey, name, alternateIdKey } = {}) {
    const existing = asset[idKey] || asset[alternateIdKey];
    if (existing) return existing;
    if (!asset[base64Key]) throw new Error(`Referência ausente para ${name}. Cadastre a imagem antes de gerar a tomada.`);
    if (typeof this.sdk.upload !== 'function') throw new Error('O SDK não oferece upload de referência.');
    this.checkCancelled();
    const data = uploadData(asset[base64Key], asset[mimeKey]);
    const result = await this.sdk.upload({ ...data, name });
    if (!result?.mediaId) throw new Error(`O upload de ${name} não retornou mediaId. Nenhuma geração foi iniciada.`);
    asset[idKey] = result.mediaId;
    this.changed({ type: 'reference-prepared', name, mediaId: result.mediaId });
    return result.mediaId;
  }
  ensureCharacter(character) {
    return this.ensureImage(character, { idKey: 'referenceMediaId', alternateIdKey: 'userUploadedPhotoMediaId',
      base64Key: 'referenceSheetBase64', mimeKey: 'referenceSheetMimeType', name: `Personagem_${character.name}` });
  }
  ensureLocation(location) {
    return this.ensureImage(location, { idKey: 'mediaId', base64Key: 'generatedImageBase64', mimeKey: 'generatedMimeType', name: `Cenario_${location.name}` });
  }
  ensureFrame(shot) {
    return this.ensureImage(shot, { idKey: 'imageMediaId', base64Key: 'generatedImageBase64', mimeKey: 'generatedMimeType', name: `Quadro_${shot.shotId}` });
  }
  prepareReferences({ includeFrames = true } = {}) {
    return this.enqueue('Preparar referências existentes', async () => {
      for (const character of this._project.storyBible.characters) {
        if (character.referenceSheetBase64 || character.referenceMediaId || character.userUploadedPhotoMediaId) await this.ensureCharacter(character);
      }
      for (const location of this._project.storyBible.locations) if (location.generatedImageBase64 || location.mediaId) await this.ensureLocation(location);
      if (includeFrames) for (const { shot } of flattenShots(this._project)) if (hasImage(shot)) await this.ensureFrame(shot);
      return this._project;
    });
  }

  generateCharacter(id, { regenerate = false } = {}) {
    return this.enqueue(`Ficha: ${id}`, async () => {
      const character = this.character(id);
      if (!regenerate && (character.referenceSheetBase64 || character.referenceMediaId || character.userUploadedPhotoMediaId)) {
        await this.ensureCharacter(character);
        return character;
      }
      return this.generateAsset(character, 'character', () => this.sdk.generate.image({
        prompt: assembleCharacterReferenceSheetPrompt(character, this._project.settings),
        modelDisplayName: DEFAULT_IMAGE_MODEL, aspectRatio: this._project.settings.aspectRatio,
      }));
    });
  }
  generateLocation(id, { regenerate = false } = {}) {
    return this.enqueue(`Cenário: ${id}`, async () => {
      const location = this.location(id);
      if (!regenerate && (location.generatedImageBase64 || location.mediaId)) { await this.ensureLocation(location); return location; }
      return this.generateAsset(location, 'location', () => this.sdk.generate.image({
        prompt: assembleLocationReferencePrompt(location, this._project.settings, this._project.storyBible.characters),
        modelDisplayName: DEFAULT_IMAGE_MODEL, aspectRatio: this._project.settings.aspectRatio,
      }));
    });
  }
  async generateAsset(asset, type, generate) {
    this.checkCancelled();
    asset.status = 'generating';
    this.changed({ type: `${type}-started`, id: asset.id });
    try {
      const result = await generate();
      this.validateResult(result, 'imagem');
      if (type === 'character') {
        if (result.base64) asset.referenceSheetBase64 = result.base64;
        else delete asset.referenceSheetBase64;
        asset.referenceSheetMimeType = result.mimeType || 'image/jpeg';
        asset.referenceMediaId = result.mediaId || '';
      } else {
        if (result.base64) asset.generatedImageBase64 = result.base64;
        else delete asset.generatedImageBase64;
        asset.generatedMimeType = result.mimeType || 'image/jpeg';
        asset.mediaId = result.mediaId || '';
      }
      asset.status = 'completed';
      delete asset.lastError;
      this.changed({ type: `${type}-completed`, id: asset.id });
      return asset;
    } catch (error) {
      asset.status = 'error';
      asset.lastError = error.message;
      this.changed({ type: `${type}-error`, id: asset.id });
      throw error;
    }
  }
  validateResult(result, kind) {
    if (!result || (!result.base64 && !result.mediaId)) throw new Error(`O serviço não retornou ${kind} válido. Confira o resultado no Flow antes de tentar outra geração; não houve repetição automática.`);
  }
  async prepareShot(shot, sceneIndex, shotIndex) {
    const bible = this._project.storyBible;
    const characters = (shot.characterIds || []).map(id => this.character(id));
    const location = shot.locationId ? this.location(shot.locationId) : null;
    // All references are mandatory. Never silently drop an identity or truncate the list.
    for (const character of characters) if (!character.referenceMediaId && !character.userUploadedPhotoMediaId && !character.referenceSheetBase64) throw new Error(`Falta a referência de ${character.name}.`);
    if (location && !location.mediaId && !location.generatedImageBase64) throw new Error(`Falta a referência do cenário ${location.name}.`);
    const previous = shot.isContinuationOfPrevious && shotIndex > 0 ? bible.scenes[sceneIndex].shots[shotIndex - 1] : null;
    if (previous && !hasImage(previous)) throw new Error('A continuação exige o quadro anterior pronto.');
    const references = [];
    const add = id => { if (!references.includes(id)) references.push(id); };
    if (previous) add(await this.ensureFrame(previous));
    if (location) add(await this.ensureLocation(location));
    for (const character of characters) add(await this.ensureCharacter(character));
    if (references.length > this.maxReferences) throw new Error(`A tomada exige ${references.length} referências; o limite é ${this.maxReferences}. Ajuste o plano sem remover identidades automaticamente.`);
    const assembled = assembleShotImagePrompt(shot, bible.characters, bible.locations, this._project.settings);
    return { ...assembled, referenceMediaIds: references, prompt: `${previous ? 'Corte visual contínuo: preserve posição, luz e identidade do quadro anterior. ' : ''}${assembled.prompt}` };
  }
  generateShot(sceneIndex, shotIndex) {
    return this.enqueue(`Quadro ${sceneIndex + 1}.${shotIndex + 1}`, () => this.renderShot(sceneIndex, shotIndex));
  }
  async renderShot(sceneIndex, shotIndex) {
    const shot = this.shotAt(sceneIndex, shotIndex);
    const priorStatus = shot.imageStatus;
    try {
      const assembled = await this.prepareShot(shot, sceneIndex, shotIndex);
      this.checkCancelled();
      shot.imageStatus = 'generating';
      this.changed({ type: 'shot-started', sceneIndex, shotIndex, warnings: assembled.warnings });
      const result = await this.sdk.generate.image({ prompt: assembled.prompt,
        modelDisplayName: DEFAULT_IMAGE_MODEL, aspectRatio: this._project.settings.aspectRatio,
        referenceImageMediaIds: assembled.referenceMediaIds });
      this.validateResult(result, 'imagem');
      if (result.base64) shot.generatedImageBase64 = result.base64;
      else delete shot.generatedImageBase64;
      shot.generatedMimeType = result.mimeType || 'image/jpeg';
      shot.imageMediaId = result.mediaId || '';
      shot.imageStatus = 'completed';
      delete shot.lastError;
      this.changed({ type: 'shot-completed', sceneIndex, shotIndex });
      return result;
    } catch (error) {
      shot.imageStatus = error instanceof CancelledOperationError ? priorStatus : 'error';
      if (!(error instanceof CancelledOperationError)) shot.lastError = error.message;
      this.changed({ type: error instanceof CancelledOperationError ? 'shot-cancelled' : 'shot-error', sceneIndex, shotIndex });
      throw error;
    }
  }
  generateVideo(sceneIndex, shotIndex, options = {}) {
    return this.enqueue(`Vídeo ${sceneIndex + 1}.${shotIndex + 1}`, () => this.renderVideo(sceneIndex, shotIndex, options));
  }
  async renderVideo(sceneIndex, shotIndex, { targetModel, targetResolution } = {}) {
    const shot = this.shotAt(sceneIndex, shotIndex);
    const settings = this._project.settings;
    const model = targetModel || shot.videoModel || settings.defaultVideoModel;
    const resolution = targetResolution || shot.videoResolution || settings.defaultResolution;
    const capability = VIDEO_MODELS_CAPABILITIES[model];
    if (!capability || !capability.supportedDurations.includes(shot.durationSeconds) || !capability.supportedResolutions.includes(resolution)) throw new Error(`Combinação não suportada: ${model}, ${shot.durationSeconds}s, ${resolution}. Escolha valores compatíveis; a duração não será alterada automaticamente.`);
    const priorStatus = shot.videoStatus;
    try {
      const frameId = await this.ensureFrame(shot);
      this.checkCancelled();
      shot.videoStatus = 'generating';
      this.changed({ type: 'video-started', sceneIndex, shotIndex });
      const result = await this.sdk.generate.video({
        prompt: assembleVideoPrompt(shot, this._project.storyBible.characters, this._project.storyBible.locations, settings),
        firstFrameImageMediaId: frameId, modelDisplayName: model, aspectRatio: settings.aspectRatio,
        durationSeconds: shot.durationSeconds, resolution,
      });
      this.validateResult(result, 'vídeo');
      if (result.base64) shot.generatedVideoBase64 = result.base64;
      else delete shot.generatedVideoBase64;
      shot.generatedVideoMimeType = result.mimeType || 'video/mp4';
      shot.videoMediaId = result.mediaId || '';
      shot.videoModel = model;
      shot.videoResolution = resolution;
      shot.videoStatus = 'completed';
      delete shot.lastError;
      this.changed({ type: 'video-completed', sceneIndex, shotIndex });
      return result;
    } catch (error) {
      shot.videoStatus = error instanceof CancelledOperationError ? priorStatus : 'error';
      if (!(error instanceof CancelledOperationError)) shot.lastError = error.message;
      this.changed({ type: error instanceof CancelledOperationError ? 'video-cancelled' : 'video-error', sceneIndex, shotIndex });
      throw error;
    }
  }
  runStoryboard({ onlyMissing = true } = {}) {
    return this.runBatch(flattenShots(this._project).filter(({ shot }) => !onlyMissing || !hasImage(shot)), 'storyboard');
  }
  runAnimation({ onlyMissing = true, approvedOnly = false, targetResolution, targetModel } = {}) {
    const tasks = flattenShots(this._project).filter(({ shot }) => (!approvedOnly || shot.isApproved === true) &&
      (!onlyMissing || !hasVideo(shot)));
    return this.runBatch(tasks, 'animation', { targetResolution, targetModel });
  }
  async runBatch(tasks, type, options) {
    if (this.queue.active || this.queue.pending.length) throw new Error('Já há uma fila ativa. Aguarde, retome ou cancele antes de iniciar outro lote.');
    this.queue.reset();
    for (const { sceneIndex, shotIndex } of tasks) {
      // The queue records errors and pauses. Attach a handler immediately to avoid unhandled rejections.
      this.queue.enqueue(() => type === 'storyboard' ? this.renderShot(sceneIndex, shotIndex) : this.renderVideo(sceneIndex, shotIndex, options),
        { label: `${type === 'storyboard' ? 'Quadro' : 'Vídeo'} ${sceneIndex + 1}.${shotIndex + 1}` }).catch(() => {});
    }
    return this.queue.untilStopped();
  }
  generateText(prompt, options = {}) {
    return this.enqueue('Texto', async () => { this.checkCancelled(); return this.sdk.generate.text(prompt, options); });
  }
  selectCharacterPhoto(id) {
    return this.enqueue('Importar foto do personagem', async () => {
      this.checkCancelled();
      const result = await this.sdk.media.select({ filter: 'image' });
      if (!result) return null;
      this.validateResult(result, 'imagem');
      const character = this.character(id);
      if (result.base64) {
        character.referenceSheetBase64 = result.base64;
        character.userUploadedPhotoBase64 = result.base64;
      } else { delete character.referenceSheetBase64; delete character.userUploadedPhotoBase64; }
      character.referenceSheetMimeType = result.mimeType || 'image/jpeg';
      character.referenceMediaId = result.mediaId || '';
      character.userUploadedPhotoMediaId = result.mediaId || '';
      character.status = 'completed';
      this.changed({ type: 'character-photo-selected', id });
      return result;
    });
  }
  selectShotImage(sceneIndex, shotIndex) {
    return this.enqueue('Importar quadro da galeria', async () => {
      this.checkCancelled();
      const result = await this.sdk.media.select({ filter: 'image' });
      if (!result) return null;
      this.validateResult(result, 'imagem');
      const shot = this.shotAt(sceneIndex, shotIndex);
      if (result.base64) shot.generatedImageBase64 = result.base64;
      else delete shot.generatedImageBase64;
      shot.generatedMimeType = result.mimeType || 'image/jpeg';
      shot.imageMediaId = result.mediaId || '';
      shot.imageStatus = 'completed';
      delete shot.lastError;
      this.changed({ type: 'shot-image-selected', sceneIndex, shotIndex });
      return result;
    });
  }
}
