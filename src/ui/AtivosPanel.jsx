import React, { useId, useMemo, useState } from 'react';
import { EMPTY_LOCATION_RULE, assembleLocationReferencePrompt, locationEnvironment } from '../projeto/index.js';
import { scriptSynchronization } from '../roteiro/index.js';

/*
 * Props: { project, busy, onChange(nextProject), onAction(action,payload), notify(message,tipo) }.
 * Host actions (host publishes any SDK project changes via its normal state pipeline):
 * prepareReferences {} (alias prepararReferences); selectCharacterPhoto {characterId};
 * generateCharacter {characterId,regenerate}; generateLocation {locationId,regenerate};
 * reuploadReference {kind:'character'|'location',id};
 * generateMissingAssets {characterIds,locationIds} (alias gerarAusentes).
 * Selecting a photo must ONLY import/register it. Adaptation or generation is a separate explicit action.
 * Archive retains objects/IDs/media and all shot links. No destructive deletion is exposed.
 */

const inputClass = 'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm font-normal leading-6 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50';
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40';
const primaryClass = `${buttonClass} border-amber-400 bg-amber-400 text-zinc-950 hover:border-amber-300 hover:bg-amber-300`;
const labelClass = 'mb-1.5 block text-xs font-medium leading-5 text-zinc-300';
const detailClass = 'rounded-xl border border-zinc-800 bg-zinc-950/50';
const summaryClass = 'cursor-pointer rounded-xl px-4 py-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';
const clone = value => JSON.parse(JSON.stringify(value));
const hasCharacterImage = character => Boolean(character.referenceSheetBase64 || character.userUploadedPhotoBase64 || character.referenceMediaId || character.userUploadedPhotoMediaId);
const hasLocationImage = location => Boolean(location.generatedImageBase64 || location.mediaId);
const linkedCharacter = character => Boolean(character.referenceMediaId || character.userUploadedPhotoMediaId);
const displayName = (asset, fallback) => typeof asset.name === 'string' && asset.name.trim() ? asset.name.trim() : fallback;

function dialogKeys(event, close) {
  if (event.key === 'Escape') { event.preventDefault(); close(); return; }
  if (event.key !== 'Tab') return;
  const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
  const first = buttons[0], last = buttons[buttons.length - 1], active = event.currentTarget.ownerDocument.activeElement;
  if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
}

function newId(prefix, existing = []) {
  const ids = new Set(existing);
  let candidate;
  do { candidate = `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`}`; } while (ids.has(candidate));
  return candidate;
}

function imageSource(base64, mimeType) {
  if (typeof base64 !== 'string' || !base64) return undefined;
  if (/^data:image\//u.test(base64)) return base64;
  return `data:${typeof mimeType === 'string' && mimeType.startsWith('image/') ? mimeType : 'image/jpeg'};base64,${base64}`;
}

function Field({ id, label, children, hint, className = '' }) {
  return <div className={className}><label htmlFor={id} className={labelClass}>{label}</label>{children}{hint && <p className="mt-1.5 text-xs leading-5 text-zinc-400">{hint}</p>}</div>;
}

function Preview({ src, name, generating = false, placeholder }) {
  return <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black/50">
    {src ? <img src={src} alt={name} loading="lazy" className="h-full w-full object-contain" /> : <p className="max-w-xs px-6 text-center text-sm leading-6 text-zinc-500">{placeholder}</p>}
    {generating && <div role="status" className="absolute inset-0 flex items-center justify-center bg-black/70 px-5 text-center text-sm text-amber-200">Processando referência…</div>}
  </div>;
}

function Badge({ children, tone = 'neutral' }) {
  const color = tone === 'green' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : tone === 'amber' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-zinc-700 bg-zinc-800 text-zinc-300';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs leading-5 ${color}`}>{children}</span>;
}

export default function AtivosPanel({ project, busy = false, onChange, onAction, notify = () => {} }) {
  const prefix = useId();
  const [tab, setTab] = useState('characters');
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [pending, setPending] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const bible = project.storyBible || { characters: [], locations: [], scenes: [] };
  const characters = bible.characters || [], locations = bible.locations || [];
  const activeCharacters = characters.filter(character => !character.archived);
  const activeLocations = locations.filter(location => !location.archived);
  const environmentCharacters = useMemo(() => characters.flatMap(character => [character,
    ...(Array.isArray(character.previousNames) ? character.previousNames.filter(name => typeof name === 'string').map(name => ({ name })) : [])]), [characters]);
  const shots = useMemo(() => (bible.scenes || []).flatMap(scene => scene.shots || []), [bible.scenes]);
  const locked = Boolean(busy || pending);
  const fieldId = (assetId, name) => `${prefix}-${encodeURIComponent(assetId)}-${encodeURIComponent(name)}`;
  const missingCharacters = activeCharacters.filter(character => !hasCharacterImage(character));
  const missingLocations = activeLocations.filter(location => !hasLocationImage(location));
  const missingCount = missingCharacters.length + missingLocations.length;
  const toPrepare = activeCharacters.filter(character => Boolean(character.referenceSheetBase64) && !linkedCharacter(character)).length
    + activeLocations.filter(location => hasLocationImage(location) && !location.mediaId).length;
  const shown = (tab === 'characters' ? characters : locations).filter(asset =>
    (showArchived || !asset.archived) && (!query.trim() || `${asset.name || ''} ${asset.role || ''}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))));
  const publish = nextBible => {
    const next = { ...project, storyBible: nextBible };
    let scriptSync;
    try { scriptSync = scriptSynchronization(next); } catch { scriptSync = { status: 'stale', source: 'storyboard' }; }
    onChange({ ...next, scriptSync });
  };
  const updateCharacter = (id, patch, { identity = false } = {}) => publish({ ...bible, characters: characters.map(character => character.id === id
    ? { ...character, ...patch,
      ...(Object.hasOwn(patch, 'name') && typeof character.name === 'string' && character.name.trim() && character.name !== patch.name
        && (character.previousNames === undefined || Array.isArray(character.previousNames))
        ? { previousNames: [...new Set([...(character.previousNames || []), character.name])] } : {}),
      ...(identity && hasCharacterImage(character) ? { referenceNeedsReview: true } : {}) } : character),
    ...(Object.hasOwn(patch, 'name') ? { scenes: (bible.scenes || []).map(scene => ({ ...scene,
      shots: (scene.shots || []).map(shot => shot.speakerCharacterId === id ? { ...shot, speakerName: patch.name } : shot) })) } : {}) });
  const updateLocation = (id, patch, { appearance = false } = {}) => publish({ ...bible, locations: locations.map(location => location.id === id
    ? { ...location, ...patch, ...(appearance && hasLocationImage(location) ? { referenceNeedsReview: true } : {}) } : location) });
  const characterUses = id => shots.filter(shot => shot.characterIds?.includes(id) || shot.speakerCharacterId === id || Object.hasOwn(shot.wardrobeMap || {}, id)).length;
  const locationUses = id => shots.filter(shot => shot.locationId === id).length;
  const run = async (action, payload = {}) => {
    if (locked) return;
    if (typeof onAction !== 'function') { notify('Esta ação ainda não está conectada ao Flow.', 'error'); return; }
    setPending({ action, id: payload.characterId || payload.locationId || payload.id });
    try { return await onAction(action, payload); }
    catch (error) { notify(error?.message || 'Não foi possível concluir a ação. As imagens existentes foram preservadas.', 'error'); }
    finally { setPending(null); }
  };
  const addCharacter = () => {
    const id = newId('char', characters.map(character => character.id)), wardrobeId = newId('wardrobe');
    const character = { id, name: 'Novo personagem', age: '', role: 'supporting', archetype: '', personality: '',
      physicalTraits: { face: '', hair: '', beard: '', physique: '' }, fixedVisualPrompt: '',
      voiceProfile: { gender: '', ageGroup: '', timbre: '', accent: '', rhythm: '' },
      wardrobes: [{ id: wardrobeId, name: 'Principal', description: '' }], defaultWardrobeId: wardrobeId, status: 'pending', archived: false };
    publish({ ...bible, characters: [...characters, character] });
    setQuery(''); setShowArchived(false); setTab('characters');
    notify('Personagem cadastrado. Complete a ficha e escolha uma foto ou gere uma referência.', 'success');
  };
  const addLocation = () => {
    publish({ ...bible, locations: [...locations, { id: newId('loc', locations.map(location => location.id)), name: 'Novo cenário',
      fixedDescription: EMPTY_LOCATION_RULE, atmosphere: '', lightingPalette: '', timeOfDay: '', status: 'pending', archived: false }] });
    setQuery(''); setShowArchived(false); setTab('locations');
    notify('Cenário cadastrado. Descreva somente o ambiente vazio.', 'success');
  };
  const duplicateCharacter = character => {
    const copy = clone(character), wardrobeIds = new Map();
    copy.id = newId('char', characters.map(item => item.id));
    copy.name = `${displayName(character, 'Personagem')} (cópia)`;
    copy.wardrobes = (copy.wardrobes || []).map(wardrobe => { const id = newId('wardrobe', [...wardrobeIds.values()]); wardrobeIds.set(wardrobe.id, id); return { ...wardrobe, id }; });
    copy.defaultWardrobeId = wardrobeIds.get(character.defaultWardrobeId) || copy.wardrobes[0]?.id;
    copy.archived = false; delete copy.archivedAt;
    copy.referenceNeedsReview = hasCharacterImage(copy);
    publish({ ...bible, characters: [...characters, copy] });
    setQuery('');
    notify('Ficha duplicada com sua imagem atual. Revise a identidade da cópia antes de gerar tomadas.', 'success');
  };
  const duplicateLocation = location => {
    const copy = { ...clone(location), id: newId('loc', locations.map(item => item.id)), name: `${displayName(location, 'Cenário')} (cópia)`, archived: false };
    delete copy.archivedAt;
    publish({ ...bible, locations: [...locations, copy] });
    setQuery(''); notify('Cenário duplicado. A ficha original e suas tomadas foram mantidas.', 'success');
  };
  const archive = (kind, asset) => {
    const patch = { archived: !asset.archived, archivedAt: asset.archived ? null : new Date().toISOString() };
    if (kind === 'character') updateCharacter(asset.id, patch); else updateLocation(asset.id, patch);
    notify(asset.archived ? 'Ficha restaurada.' : 'Ficha arquivada. As tomadas e referências existentes continuam vinculadas.', 'success');
  };
  const addWardrobe = character => updateCharacter(character.id, { wardrobes: [...(character.wardrobes || []), {
    id: newId('wardrobe', (character.wardrobes || []).map(wardrobe => wardrobe.id)), name: `Figurino ${(character.wardrobes?.length || 0) + 1}`, description: '' }] });
  const updateWardrobe = (character, wardrobeId, patch) => updateCharacter(character.id, { wardrobes: (character.wardrobes || []).map(wardrobe => wardrobe.id === wardrobeId ? { ...wardrobe, ...patch } : wardrobe) }, { identity: wardrobeId === character.defaultWardrobeId });
  const cleanLocation = location => {
    const cleaned = locationEnvironment(location, environmentCharacters);
    const description = cleaned.description.replace(EMPTY_LOCATION_RULE, '').trim();
    updateLocation(location.id, { fixedDescription: [description, EMPTY_LOCATION_RULE].filter(Boolean).join('\n'), atmosphere: cleaned.atmosphere, lightingPalette: cleaned.lighting }, { appearance: true });
    notify('Descrição preparada com ambiente vazio. Confira os detalhes do espaço antes de gerar.', 'success');
  };
  const askGeneration = (action, asset, kind) => {
    const hasImage = kind === 'character' ? hasCharacterImage(asset) : hasLocationImage(asset);
    const payload = kind === 'character' ? { characterId: asset.id, regenerate: hasImage } : { locationId: asset.id, regenerate: hasImage };
    if (hasImage) setConfirmation({ action, payload, title: `Criar outra referência de ${displayName(asset, 'esta ficha')}?`,
      description: 'Isso gera uma nova imagem e substitui a referência selecionada. Para aproveitar a imagem existente, use Preparar referências ou Reenviar imagem.', names: [] });
    else run(action, payload);
  };
  const askMissing = () => setConfirmation({ action: 'generateMissingAssets', payload: { characterIds: missingCharacters.map(character => character.id), locationIds: missingLocations.map(location => location.id) },
    title: `Gerar ${missingCount} referências ausentes?`, description: 'Somente as fichas abaixo ainda não têm imagem. Referências já preservadas não serão recriadas.',
    names: [...missingCharacters.map(character => `${displayName(character, 'Personagem')} · personagem`), ...missingLocations.map(location => `${displayName(location, 'Cenário')} · cenário`)] });

  return <section aria-labelledby={`${prefix}-heading`} aria-busy={locked} className="space-y-6 text-sm font-normal text-zinc-100">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-widest text-amber-300">Etapa 2 · Referências</p><h2 id={`${prefix}-heading`} className="mt-1 text-2xl font-semibold tracking-tight">O elenco e os lugares da história</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Revise as fichas e preserve o rosto de cada pessoa. As imagens abaixo aparecem inteiras, no formato original.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={locked || !toPrepare} onClick={() => run('prepareReferences')} className={buttonClass}>Preparar referências{toPrepare > 0 ? ` (${toPrepare})` : ''}</button><button type="button" disabled={locked || !missingCount} onClick={askMissing} className={primaryClass}>Gerar ausentes{missingCount > 0 ? ` (${missingCount})` : ''}</button></div></header>
    <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm leading-6 text-zinc-400">Preparar referências registra no Flow as imagens já guardadas. Gerar ausentes cria imagens somente para fichas sem foto ou referência.</p>

    <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div role="group" aria-label="Tipo de ficha" className="flex flex-wrap gap-2">{[['characters', 'Personagens', activeCharacters.length], ['locations', 'Cenários', activeLocations.length]].map(([value, label, count]) => <button key={value} type="button" aria-pressed={tab === value} disabled={locked} onClick={() => setTab(value)} className={`${buttonClass} ${tab === value ? 'border-amber-400 bg-amber-400 text-zinc-950 hover:bg-amber-300' : ''}`}>{label} <span className="text-xs opacity-75">{count}</span></button>)}</div>
      <div className="flex flex-wrap items-end gap-3"><Field id={`${prefix}-search`} label="Encontrar uma ficha"><input id={`${prefix}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} className={inputClass} placeholder="Buscar pelo nome" /></Field><button type="button" disabled={locked} onClick={tab === 'characters' ? addCharacter : addLocation} className={buttonClass}>+ {tab === 'characters' ? 'Novo personagem' : 'Novo cenário'}</button></div>
      <label className="flex w-full items-center gap-2 text-sm leading-6 text-zinc-400"><input type="checkbox" checked={showArchived} onChange={event => setShowArchived(event.target.checked)} className="h-4 w-4 accent-amber-400" />Mostrar fichas arquivadas</label>
    </div>

    {!shown.length && <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center"><h3 className="text-base font-medium">{query.trim() ? 'Nenhuma ficha encontrada' : tab === 'characters' ? 'Seu elenco começa aqui' : 'Prepare o primeiro cenário'}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-400">{query.trim() ? 'Tente outro nome ou inclua as fichas arquivadas.' : tab === 'characters' ? 'Cadastre um personagem e escolha sua foto ou descreva sua aparência.' : 'Descreva arquitetura, móveis, objetos e luz, sempre com o ambiente vazio.'}</p>{!query.trim() && <button type="button" disabled={locked} className={`${primaryClass} mt-5`} onClick={tab === 'characters' ? addCharacter : addLocation}>+ {tab === 'characters' ? 'Adicionar personagem' : 'Adicionar cenário'}</button>}</div>}

    <div className="grid items-start gap-6 xl:grid-cols-2">{tab === 'characters' ? shown.map(character => {
      const name = displayName(character, 'Personagem sem nome'), uses = characterUses(character.id), traits = character.physicalTraits || {}, voice = character.voiceProfile || {};
      const referenceSrc = imageSource(character.referenceSheetBase64 || character.userUploadedPhotoBase64, character.referenceSheetMimeType || character.userUploadedPhotoMimeType);
      const originalSrc = imageSource(character.userUploadedPhotoBase64, character.userUploadedPhotoMimeType || character.referenceSheetMimeType);
      const generating = (Boolean(busy) && character.status === 'generating') || pending?.id === character.id;
      return <article key={character.id} aria-label={`Ficha de ${name}`} className={`space-y-4 rounded-2xl border p-5 ${character.archived ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-800 bg-zinc-900/60'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="text-lg font-semibold leading-7">{name}</h3><div className="flex flex-wrap gap-2">{character.archived && <Badge>Arquivado</Badge>}{uses > 0 && <Badge>Em {uses} {uses === 1 ? 'tomada' : 'tomadas'}</Badge>}</div></div>
        <Preview src={referenceSrc} name={`Referência visual de ${name}`} generating={generating} placeholder={linkedCharacter(character) ? 'Referência vinculada no Flow. A imagem não está incorporada neste JSON.' : 'Nenhuma imagem cadastrada. Escolha uma foto ou gere uma ficha.'} />
        <div className="flex flex-wrap gap-2"><Badge tone={originalSrc ? 'green' : 'neutral'}>{originalSrc ? 'Foto original preservada' : character.userUploadedPhotoMediaId ? 'Foto pessoal vinculada' : character.userUploaded ? 'Foto adaptada no projeto' : 'Sem foto pessoal'}</Badge><Badge tone={linkedCharacter(character) ? 'green' : hasCharacterImage(character) ? 'amber' : 'neutral'}>{linkedCharacter(character) ? 'Referência vinculada ao Flow' : hasCharacterImage(character) ? 'Imagem guardada · preparar referência' : 'Referência pendente'}</Badge></div>
        {character.referenceNeedsReview && <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm leading-6 text-amber-200">A ficha foi editada. Confira se a imagem ainda representa a aparência e o figurino desejados.</p>}
        {character.status === 'error' && <p role="status" className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm leading-6 text-red-200">{character.lastError || 'Não foi possível preparar esta referência. A imagem anterior continua disponível quando preservada no projeto.'}</p>}
        <div className="flex flex-wrap gap-2"><button type="button" disabled={locked || character.archived} className={buttonClass} onClick={() => run('selectCharacterPhoto', { characterId: character.id })}>Escolher foto</button><button type="button" disabled={locked || character.archived} className={hasCharacterImage(character) ? buttonClass : primaryClass} onClick={() => askGeneration('generateCharacter', character, 'character')}>{hasCharacterImage(character) ? 'Gerar outra ficha' : 'Gerar ficha visual'}</button>{character.referenceSheetBase64 && <button type="button" disabled={locked || character.archived} className={buttonClass} onClick={() => run('reuploadReference', { kind: 'character', id: character.id })}>{linkedCharacter(character) ? 'Reenviar imagem' : 'Registrar imagem no Flow'}</button>}</div>
        {originalSrc && originalSrc !== referenceSrc && <details className={detailClass}><summary className={summaryClass}>Ver foto original</summary><div className="p-4 pt-0"><Preview src={originalSrc} name={`Foto original de ${name}`} placeholder="Foto original" /></div></details>}

        <fieldset disabled={locked} className="grid min-w-0 gap-4 sm:grid-cols-2"><legend className="sr-only">Identificação do personagem</legend>
          <Field id={fieldId(character.id, 'name')} label="Nome" className="sm:col-span-2"><input id={fieldId(character.id, 'name')} className={inputClass} value={character.name || ''} onChange={event => updateCharacter(character.id, { name: event.target.value })} /></Field>
          <Field id={fieldId(character.id, 'age')} label="Idade"><input id={fieldId(character.id, 'age')} type="number" min="0" max="120" className={inputClass} value={character.age ?? ''} onChange={event => updateCharacter(character.id, { age: event.target.value === '' ? '' : Number(event.target.value) }, { identity: true })} /></Field>
          <Field id={fieldId(character.id, 'role')} label="Papel na história"><select id={fieldId(character.id, 'role')} className={inputClass} value={character.role || 'supporting'} onChange={event => updateCharacter(character.id, { role: event.target.value })}>{!['protagonist', 'antagonist', 'supporting', 'narrator'].includes(character.role) && character.role && <option value={character.role}>{character.role} (importado)</option>}<option value="protagonist">Protagonista</option><option value="antagonist">Antagonista</option><option value="supporting">Coadjuvante</option><option value="narrator">Narrador / voz fora de quadro</option></select></Field>
        </fieldset>

        <details className={detailClass}><summary className={summaryClass}>Aparência e identidade</summary><fieldset disabled={locked} className="grid min-w-0 gap-4 p-4 pt-0 sm:grid-cols-2"><legend className="sr-only">Traços físicos e personalidade</legend>
          {[['face', 'Rosto'], ['hair', 'Cabelo'], ['beard', 'Barba / ausência de barba'], ['physique', 'Porte e compleição']].map(([key, label]) => <Field key={key} id={fieldId(character.id, key)} label={label}><textarea id={fieldId(character.id, key)} rows={2} className={inputClass} value={traits[key] || ''} onChange={event => updateCharacter(character.id, { physicalTraits: { ...traits, [key]: event.target.value } }, { identity: true })} /></Field>)}
          <Field id={fieldId(character.id, 'fixed')} label="Descrição visual permanente" className="sm:col-span-2"><textarea id={fieldId(character.id, 'fixed')} rows={3} className={inputClass} value={character.fixedVisualPrompt || ''} onChange={event => updateCharacter(character.id, { fixedVisualPrompt: event.target.value }, { identity: true })} /></Field>
          <Field id={fieldId(character.id, 'archetype')} label="Arquétipo"><input id={fieldId(character.id, 'archetype')} className={inputClass} value={character.archetype || ''} onChange={event => updateCharacter(character.id, { archetype: event.target.value })} placeholder="Ex.: trabalhadora corajosa" /></Field>
          <Field id={fieldId(character.id, 'personality')} label="Personalidade"><textarea id={fieldId(character.id, 'personality')} rows={2} className={inputClass} value={character.personality || ''} onChange={event => updateCharacter(character.id, { personality: event.target.value })} /></Field>
        </fieldset></details>

        <details className={detailClass}><summary className={summaryClass}>Voz em português brasileiro</summary><fieldset disabled={locked} className="grid min-w-0 gap-4 p-4 pt-0 sm:grid-cols-2"><legend className="sr-only">Perfil completo da voz</legend>{[['gender', 'Gênero da voz'], ['ageGroup', 'Faixa etária da voz'], ['timbre', 'Timbre'], ['accent', 'Sotaque'], ['rhythm', 'Ritmo e cadência']].map(([key, label]) => <Field key={key} id={fieldId(character.id, `voice-${key}`)} label={label}><input id={fieldId(character.id, `voice-${key}`)} className={inputClass} value={voice[key] || ''} onChange={event => updateCharacter(character.id, { voiceProfile: { ...voice, [key]: event.target.value } })} /></Field>)}<p className="text-xs leading-5 text-zinc-400 sm:col-span-2">Este perfil dirige a voz no vídeo. Ele não é uma gravação ou uma clonagem de voz.</p></fieldset></details>

        <details className={detailClass}><summary className={summaryClass}>Figurinos <span className="ml-1 text-zinc-400">({character.wardrobes?.length || 0})</span></summary><fieldset disabled={locked} className="space-y-4 p-4 pt-0"><legend className="sr-only">Figurinos e roupa padrão</legend>{(character.wardrobes || []).map(wardrobe => {
          const usesWardrobe = shots.filter(shot => shot.characterIds?.includes(character.id) && (shot.wardrobeMap?.[character.id] || character.defaultWardrobeId) === wardrobe.id).length;
          return <div key={wardrobe.id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"><Field id={fieldId(character.id, `wardrobe-${wardrobe.id}-name`)} label="Nome do figurino"><input id={fieldId(character.id, `wardrobe-${wardrobe.id}-name`)} className={inputClass} value={wardrobe.name || ''} onChange={event => updateWardrobe(character, wardrobe.id, { name: event.target.value })} /></Field><Field id={fieldId(character.id, `wardrobe-${wardrobe.id}-description`)} label="Roupas, cores e acessórios"><textarea id={fieldId(character.id, `wardrobe-${wardrobe.id}-description`)} rows={3} className={inputClass} value={wardrobe.description || ''} onChange={event => updateWardrobe(character, wardrobe.id, { description: event.target.value })} placeholder="Descreva tecidos e cores, sem marcas ou logotipos." /></Field><div className="flex flex-wrap items-center justify-between gap-2"><label className="flex min-h-10 items-center gap-2 text-sm"><input type="radio" name={fieldId(character.id, 'default-wardrobe')} checked={character.defaultWardrobeId === wardrobe.id} onChange={() => updateCharacter(character.id, { defaultWardrobeId: wardrobe.id }, { identity: true })} className="h-4 w-4 accent-amber-400" />Figurino padrão</label>{usesWardrobe > 0 && <span className="text-xs text-zinc-400">Usado em {usesWardrobe} {usesWardrobe === 1 ? 'tomada' : 'tomadas'}</span>}</div></div>;
        })}<button type="button" className={buttonClass} onClick={() => addWardrobe(character)}>+ Adicionar figurino</button><p className="text-xs leading-5 text-zinc-400">Figurinos usados são preservados para manter a continuidade das tomadas.</p></fieldset></details>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4"><button type="button" disabled={locked} className={buttonClass} onClick={() => duplicateCharacter(character)}>Duplicar ficha</button><button type="button" disabled={locked} className={buttonClass} onClick={() => archive('character', character)}>{character.archived ? 'Restaurar ficha' : 'Arquivar ficha'}</button></footer>
      </article>;
    }) : shown.map(location => {
      const name = displayName(location, 'Cenário sem nome'), uses = locationUses(location.id), src = imageSource(location.generatedImageBase64, location.generatedMimeType);
      return <article key={location.id} aria-label={`Ficha do cenário ${name}`} className={`space-y-4 rounded-2xl border p-5 ${location.archived ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-800 bg-zinc-900/60'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="text-lg font-semibold leading-7">{name}</h3><div className="flex flex-wrap gap-2">{location.archived && <Badge>Arquivado</Badge>}{uses > 0 && <Badge>Em {uses} {uses === 1 ? 'tomada' : 'tomadas'}</Badge>}</div></div>
        <Preview src={src} name={`Referência completa do cenário ${name}`} generating={(Boolean(busy) && location.status === 'generating') || pending?.id === location.id} placeholder={location.mediaId ? 'Cenário vinculado no Flow. A imagem não está incorporada neste JSON.' : 'A referência deste ambiente ainda não foi criada.'} />
        <div className="flex flex-wrap gap-2"><Badge tone={location.mediaId ? 'green' : hasLocationImage(location) ? 'amber' : 'neutral'}>{location.mediaId ? 'Referência vinculada ao Flow' : src ? 'Imagem guardada · preparar referência' : 'Referência pendente'}</Badge><Badge>Referência de cenário</Badge></div>
        {location.referenceNeedsReview && <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm leading-6 text-amber-200">O cenário foi editado. Confira se a imagem ainda corresponde à descrição e à luz desejadas.</p>}
        {location.status === 'error' && <p role="status" className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm leading-6 text-red-200">{location.lastError || 'Não foi possível preparar a referência deste cenário.'}</p>}
        <div className="flex flex-wrap gap-2"><button type="button" disabled={locked || location.archived} className={hasLocationImage(location) ? buttonClass : primaryClass} onClick={() => askGeneration('generateLocation', location, 'location')}>{hasLocationImage(location) ? 'Gerar outro cenário' : 'Gerar referência do cenário'}</button>{src && <button type="button" disabled={locked || location.archived} className={buttonClass} onClick={() => run('reuploadReference', { kind: 'location', id: location.id })}>{location.mediaId ? 'Reenviar imagem' : 'Registrar imagem no Flow'}</button>}</div>

        <fieldset disabled={locked} className="grid min-w-0 gap-4 sm:grid-cols-2"><legend className="sr-only">Descrição do ambiente</legend>
          <Field id={fieldId(location.id, 'name')} label="Nome do cenário" className="sm:col-span-2"><input id={fieldId(location.id, 'name')} className={inputClass} value={location.name || ''} onChange={event => updateLocation(location.id, { name: event.target.value })} /></Field>
          <Field id={fieldId(location.id, 'description')} label="Arquitetura, móveis e objetos" className="sm:col-span-2" hint="Descreva somente o espaço vazio. Posições, ações e olhares dos personagens pertencem às tomadas."><textarea id={fieldId(location.id, 'description')} rows={5} className={`${inputClass} leading-7`} value={location.fixedDescription || ''} onChange={event => updateLocation(location.id, { fixedDescription: event.target.value }, { appearance: true })} /></Field>
          <Field id={fieldId(location.id, 'atmosphere')} label="Ambientação física"><textarea id={fieldId(location.id, 'atmosphere')} rows={3} className={inputClass} value={location.atmosphere || ''} onChange={event => updateLocation(location.id, { atmosphere: event.target.value }, { appearance: true })} placeholder="Ex.: ar úmido, paredes envelhecidas, cortinas leves." /></Field>
          <Field id={fieldId(location.id, 'lighting')} label="Luz e paleta de cores"><textarea id={fieldId(location.id, 'lighting')} rows={3} className={inputClass} value={location.lightingPalette || ''} onChange={event => updateLocation(location.id, { lightingPalette: event.target.value }, { appearance: true })} placeholder="Ex.: luz lateral dourada, sombras suaves, tons terrosos." /></Field>
          <Field id={fieldId(location.id, 'time')} label="Horário"><input id={fieldId(location.id, 'time')} className={inputClass} value={location.timeOfDay || ''} onChange={event => updateLocation(location.id, { timeOfDay: event.target.value }, { appearance: true })} placeholder="Ex.: manhã, fim da tarde, noite" /></Field>
          <div className="flex items-end"><button type="button" className={buttonClass} onClick={() => cleanLocation(location)}>Limpar descrição para ambiente vazio</button></div>
        </fieldset>
        <details className={detailClass}><summary className={summaryClass}>Conferir a direção da referência</summary><div className="space-y-3 p-4 pt-0"><p className="text-xs leading-5 text-zinc-400">Revisão do texto preparado. Gerar o cenário é uma ação separada.</p><p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">{assembleLocationReferencePrompt(location, project.settings || {}, environmentCharacters)}</p></div></details>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4"><button type="button" disabled={locked} className={buttonClass} onClick={() => duplicateLocation(location)}>Duplicar cenário</button><button type="button" disabled={locked} className={buttonClass} onClick={() => archive('location', location)}>{location.archived ? 'Restaurar cenário' : 'Arquivar cenário'}</button></footer>
      </article>;
    })}</div>

    <p aria-live="polite" className="min-h-5 text-sm leading-6 text-amber-200">{pending ? 'Processando sua solicitação. Não é necessário clicar novamente.' : busy ? 'Há uma operação em andamento. Aguarde para editar as fichas.' : ''}</p>
    {confirmation && <div role="alertdialog" aria-modal="true" aria-labelledby={`${prefix}-confirm-title`} aria-describedby={`${prefix}-confirm-description`} onKeyDown={event => dialogKeys(event, () => setConfirmation(null))} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"><h3 id={`${prefix}-confirm-title`} className="text-lg font-semibold">{confirmation.title}</h3><p id={`${prefix}-confirm-description`} className="mt-3 text-sm leading-6 text-zinc-300">{confirmation.description}</p>{confirmation.names.length > 0 && <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">{confirmation.names.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}</ul>}<div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" autoFocus className={buttonClass} onClick={() => setConfirmation(null)}>Voltar à revisão</button><button type="button" disabled={locked} className={primaryClass} onClick={() => { const request = confirmation; setConfirmation(null); run(request.action, request.payload); }}>Gerar referências</button></div></div></div>}
  </section>;
}

export { AtivosPanel };
