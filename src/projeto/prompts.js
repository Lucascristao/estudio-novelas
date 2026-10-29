export const EMPTY_LOCATION_RULE = 'Ambiente vazio e desocupado, somente arquitetura, móveis e objetos. Portas e passagens desocupadas. Sem pessoas, mãos, partes do corpo, silhuetas ou reflexos humanos. Sem texto legível ou logotipos.';

const text = value => typeof value === 'string' ? value.trim() : '';
const fold = value => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const sections = [
  ['initialFrame', /QUADRO\s+INICIAL(?:\s+DO\s+STORYBOARD)?|INITIAL\s+FRAME|QUADRO\s+EST[ÁA]TICO/i],
  ['temporalAction', /A[ÇC][ÃA]O\s+NO\s+V[ÍI]DEO|DIRE[ÇC][ÃA]O\s+TEMPORAL|VIDEO\s+ACTION/i],
  ['gaze', /OLHARES\s+E\s+ESCUTA/i], ['exit', /SA[ÍI]DA\s+PARA\s+O\s+CORTE/i],
  ['voice', /VOZ/i], ['general', /DIRE[ÇC][ÃA]O\s+GERAL/i],
];
const marker = new RegExp(`(?:^|\\n)\\s*(${sections.map(([, re]) => re.source).join('|')})\\s*:\\s*`, 'gi');

/** The original visualAction remains intact. Only labeled static composition goes to image generation. */
export function splitShotDirection(shotOrText) {
  const raw = typeof shotOrText === 'string' ? shotOrText : text(shotOrText?.visualAction);
  const result = { initialFrame: '', temporalAction: '', gaze: '', exit: '', voice: '', general: '', hasExplicitInitialFrame: false };
  const matches = [...raw.matchAll(marker)];
  if (!matches.length) result.temporalAction = raw;
  matches.forEach((match, index) => {
    const key = sections.find(([, re]) => re.test(match[1]))?.[0];
    if (key) result[key] = raw.slice(match.index + match[0].length, matches[index + 1]?.index ?? raw.length).trim();
  });
  result.hasExplicitInitialFrame = Boolean(result.initialFrame);
  return result;
}

/** Writes the known original field, so the JSON stays useful in the recovered Sanja app. */
export function joinShotDirection(direction) {
  return [
    ['QUADRO INICIAL DO STORYBOARD', direction.initialFrame], ['AÇÃO NO VÍDEO', direction.temporalAction],
    ['OLHARES E ESCUTA', direction.gaze], ['SAÍDA PARA O CORTE', direction.exit],
    ['VOZ', direction.voice], ['DIREÇÃO GERAL', direction.general],
  ].filter(([, value]) => text(value)).map(([label, value]) => `${label}: ${text(value)}`).join('\n');
}

function environmentText(value, characters = [], { occupied = false } = {}) {
  const names = characters.map(c => fold(c.name)).filter(name => name.length > 1);
  return text(value).split(/(?<=[.!?;])\s+|\n+/).filter(clause => {
    const normalized = fold(clause);
    // Imported scenarios sometimes contain actors or a hand despite their empty-set instruction.
    if (names.some(name => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(normalized))) return false;
    if (/\b(pessoas?|personagens?|homens?|mulheres?|maos?|corpo|silhuetas?|reflexos? humanos?|patroa|funcionari[oa]s?|atores?|observad[oa]|hospedes?|humilhacao|confronto|people|persons?|humans?|hands?|body|silhouettes?|characters?|actors?)\b/.test(normalized)) return false;
    return true;
  }).map(clause => occupied ? clause
    .replace(/\b(?:vazi[oa]s?\s+e\s+desocupad[oa]s?|desocupad[oa]s?|vazi[oa]s?)\b/gi, '')
    .replace(/\b(?:empty\s+and\s+unoccupied|empty|unoccupied|only architecture,?\s*furniture and objects)\b/gi, '')
    .replace(/somente\s+(?:arquitetura,?\s*)?(?:m[óo]veis\s+e\s+objetos|o\s+ambiente)[.;]?/gi, '')
    .replace(/(?:portas\s+e\s+passagens|portas|passagens)\s*[.;]/gi, '') : clause)
    .join(' ').replace(/\s+/g, ' ').trim();
}

export function locationEnvironment(location, characters = [], options = {}) {
  return {
    description: environmentText(location?.fixedDescription, characters, options),
    atmosphere: environmentText(location?.atmosphere, characters, options),
    lighting: environmentText(location?.lightingPalette, characters, options),
  };
}

export function assembleLocationReferencePrompt(location, settings = {}, characters = []) {
  const env = locationEnvironment(location, characters);
  const style = typeof settings === 'string' ? settings : settings.style;
  return [
    `Fotografia cinematográfica do cenário: ${text(location?.name)}.`, env.description,
    env.atmosphere && `Atmosfera do ambiente: ${env.atmosphere}`,
    env.lighting && `Iluminação: ${env.lighting}`, `Horário: ${text(location?.timeOfDay)}.`,
    `Estilo: ${text(style)}. Composição ampla, detalhes arquitetônicos.`, EMPTY_LOCATION_RULE,
  ].filter(Boolean).join(' ');
}

function wardrobeFor(character, shot = {}) {
  const wardrobes = Array.isArray(character.wardrobes) ? character.wardrobes : [];
  const id = shot.wardrobeMap?.[character.id] || character.defaultWardrobeId;
  return wardrobes.find(w => w.id === id)?.description || wardrobes[0]?.description || 'roupas sem marcas';
}

export function assembleCharacterReferenceSheetPrompt(character, settings = {}) {
  const traits = character.physicalTraits || {};
  return `Ficha visual de ${character.name}, ${character.age ?? ''} anos. Pessoa inteira em pé, frente, pose neutra, fundo cinza de estúdio. Rosto: ${text(traits.face)}. Cabelo: ${text(traits.hair)}. Barba: ${text(traits.beard)}. Corpo: ${text(traits.physique)}. Identidade: ${text(character.fixedVisualPrompt)}. Figurino: ${wardrobeFor(character)}. Estilo: ${typeof settings === 'string' ? settings : text(settings.style)}. Sem texto, logotipos ou colagem.`;
}

export function assembleShotImagePrompt(shot, characters = [], locations = [], settings = {}) {
  const direction = splitShotDirection(shot);
  const location = locations.find(l => l.id === shot.locationId);
  const env = locationEnvironment(location, characters, { occupied: true });
  const present = (shot.characterIds || []).map(id => characters.find(c => c.id === id)).filter(Boolean);
  const refs = [];
  const add = id => { if (id && !refs.includes(id)) refs.push(id); };
  add(location?.mediaId);
  const parts = ['Um único quadro inicial estático de cinema. Sem sequência, colagem ou ações futuras.'];
  if (location) parts.push(`Cenário: ${location.name}. ${env.description} Iluminação: ${env.lighting}. Horário: ${text(location.timeOfDay)}.`);
  present.forEach(character => {
    const traits = character.physicalTraits || {};
    parts.push(`Identidade de ${character.name}: ${text(traits.face)}; cabelo ${text(traits.hair)}; ${text(traits.beard)}; ${text(traits.physique)}. ${text(character.fixedVisualPrompt)} Figurino: ${wardrobeFor(character, shot)}. Preservar o rosto da referência.`);
    add(character.referenceMediaId || character.userUploadedPhotoMediaId);
  });
  parts.push(`Enquadramento: ${text(shot.shotType)}. Composição inicial: ${direction.initialFrame || `Retrato de cena dos personagens ${present.map(c => c.name).join(', ')}, em postura inicial neutra. Definir o quadro inicial para uma composição mais precisa.`}`);
  parts.push(`Estilo: ${text(settings.style)}. Câmera observa de lado; olhares entre os interlocutores, nunca à lente. Sem legendas, texto legível, marcas ou logotipos.`);
  return { prompt: parts.join(' '), referenceMediaIds: refs,
    warnings: direction.hasExplicitInitialFrame ? [] : ['A ação antiga não possui um quadro inicial marcado; a imagem usa composição neutra. Defina QUADRO INICIAL DO STORYBOARD em visualAction.'] };
}

export function assembleVideoPrompt(shot, characters = [], locations = [], settings = {}) {
  const direction = splitShotDirection(shot);
  const location = locations.find(l => l.id === shot.locationId);
  const env = locationEnvironment(location, characters, { occupied: true });
  const speaker = characters.find(c => c.id === shot.speakerCharacterId);
  const name = speaker?.name || shot.speakerName;
  const voice = speaker?.voiceProfile || {};
  const parts = [
    `Animar o quadro inicial fornecido, preservando rostos, figurinos, objetos, posições e eixo dos olhares. Estilo: ${text(settings.style)}.`,
    location && `Ambiente: ${location.name}. ${env.description} Iluminação: ${env.lighting}.`,
    `Plano: ${text(shot.shotType)}. Câmera: ${text(shot.cameraMovement)}. Duração: ${shot.durationSeconds}s.`,
    direction.temporalAction && `Ação no vídeo: ${direction.temporalAction}`,
    direction.gaze && `Olhares e escuta: ${direction.gaze}`, direction.exit && `Saída para o corte: ${direction.exit}`,
    direction.general,
  ].filter(Boolean);
  if (text(shot.dialogueLine)) {
    parts.push(`Somente ${name || 'o falante indicado'} fala em português brasileiro: ${JSON.stringify(text(shot.dialogueLine))}. Emoção: ${text(shot.emotion)}. Tom: ${text(shot.voiceTone)}. Perfil de voz: ${Object.values(voice).filter(Boolean).join(', ')}. Sincronia labial. Os demais escutam e reagem em silêncio, sem mover os lábios como se falassem.`);
  } else parts.push('Sem diálogo ou fala.');
  if (direction.voice) parts.push(`Direção de voz: ${direction.voice}`);
  if (shot.sfxAmbience) parts.push(`Som ambiente: ${text(shot.sfxAmbience)}`);
  parts.push('Sem música de fundo, legendas, narração não solicitada ou texto na tela.');
  return parts.join(' ');
}
