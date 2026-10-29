/** Pure helpers. No SDK, browser, network, media generation or storage side effects. */
export const WORD_LIMITS_BY_DURATION = Object.freeze({ 4: 9, 6: 14, 8: 18, 10: 23 });

export class NarrativeError extends Error {
  constructor(code, message, { operation, cause, issues = [], rawResponse } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'NarrativeError';
    this.code = code;
    this.operation = operation;
    this.recoverable = true;
    this.issues = issues;
    if (rawResponse !== undefined) this.rawResponse = rawResponse;
  }
}

export function countWords(value) {
  return typeof value === 'string' ? value.trim().split(/\s+/u).filter(Boolean).length : 0;
}

export function dialogueLimit(durationSeconds) {
  if (typeof durationSeconds !== 'number' || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new NarrativeError('INVALID_DURATION', 'A duração da tomada deve ser um número positivo.');
  }
  return WORD_LIMITS_BY_DURATION[durationSeconds] ?? Math.max(1, Math.round(durationSeconds * 2.3));
}

export function dialogueBudget(line, durationSeconds) {
  const words = countWords(line), maxWords = dialogueLimit(durationSeconds);
  return { words, maxWords, exceeded: words > maxWords, durationSeconds };
}

/** Extracts one balanced JSON document, respecting quotes and escapes. Never uses eval. */
export function parseAiJson(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) {
    throw new NarrativeError('AI_EMPTY_RESPONSE', 'A IA não retornou texto. O projeto foi preservado.');
  }
  const text = rawText.replace(/^\uFEFF/u, '').trim();
  try { return JSON.parse(text); } catch { /* Fences or a short explanatory prefix are accepted below. */ }
  const start = text.search(/[\[{]/u);
  if (start < 0) throw new NarrativeError('AI_INVALID_JSON', 'A IA não retornou JSON válido. Revise a resposta ou tente novamente.', { rawResponse: rawText });
  const stack = [];
  let quoted = false, escaped = false, end = -1;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === '{' || char === '[') stack.push(char);
    else if (char === '}' || char === ']') {
      if (stack.pop() !== (char === '}' ? '{' : '[')) break;
      if (!stack.length) { end = index + 1; break; }
    }
  }
  try {
    if (end < 0 || /[\[{]/u.test(text.slice(end).replace(/```/gu, ''))) throw new Error('JSON ausente, incompleto ou ambíguo.');
    return JSON.parse(text.slice(start, end));
  } catch (cause) {
    throw new NarrativeError('AI_INVALID_JSON', 'A resposta da IA está incompleta ou tem JSON inválido. Nenhum dado foi substituído.', { cause, rawResponse: rawText });
  }
}

const value = item => item == null ? '' : String(item);

/** Storyboard is canonical. Every utterance, including off-screen speech, is rendered. */
export function renderScriptText(projectOrBible) {
  const bible = projectOrBible?.storyBible ?? projectOrBible;
  if (!bible || typeof bible !== 'object') throw new NarrativeError('INVALID_BIBLE', 'Bíblia da história ausente.');
  const lines = [
    `TÍTULO: ${value(bible.title || projectOrBible?.title)}`,
    `NATUREZA: ${bible.storyRealism === 'real' ? 'HISTÓRIA REAL' : 'HISTÓRIA FICTÍCIA'}`,
    `LOGLINE: ${value(bible.logline)}`, `ESTRUTURA: ${value(bible.narrativeStructure)}`,
    `GANCHO (0–3s): ${value(bible.hook)}`, `CONFLITO CENTRAL: ${value(bible.centralConflict)}`,
    '', '--- PERSONAGENS ---',
    ...(bible.characters || []).map(character => `• ${value(character.name)} (${value(character.id)}): ${value(character.fixedVisualPrompt)}`),
    '', '--- LOCAÇÕES ---',
    ...(bible.locations || []).map(location => `• ${value(location.name)} (${value(location.id)}): ${value(location.fixedDescription)}`),
    '', '--- STORYBOARD ---',
  ];
  (bible.scenes || []).forEach((scene, sceneIndex) => {
    lines.push('', `[CENA ${scene.sceneNumber ?? sceneIndex + 1} — ATO ${scene.actNumber ?? ''}: ${value(scene.title)}]`, `Objetivo: ${value(scene.objective)}`);
    (scene.shots || []).forEach((shot, shotIndex) => {
      const speaker = bible.characters?.find(character => character.id === shot.speakerCharacterId)?.name || shot.speakerName;
      lines.push(`TOMADA ${shotIndex + 1} [${value(shot.shotId)}] (${value(shot.durationSeconds)}s) | ${value(shot.shotType)} | Câmera: ${value(shot.cameraMovement)}`,
        `Ação: ${value(shot.visualAction)}`);
      lines.push(shot.dialogueLine?.trim() ? `${value(speaker || 'Voz fora de quadro')}: "${shot.dialogueLine}"` : '(Sem fala / Ação visual)');
      lines.push(`Emoção: ${value(shot.emotion)} | Voz: ${value(shot.voiceTone)}`, `SFX: ${value(shot.sfxAmbience)} | Transição: ${value(shot.transition)}`);
    });
  });
  lines.push('', '--- CONCLUSÃO ---', value(bible.ending?.description));
  if (bible.ending?.finalPunchline) lines.push(`Frase final: ${bible.ending.finalPunchline}`);
  return lines.join('\n');
}

/** Calculates current truth instead of trusting a potentially stale imported badge. */
export function scriptSynchronization(project) {
  return { status: project.scriptText === renderScriptText(project) ? 'synced' : 'stale', source: 'storyboard' };
}
