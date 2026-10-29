import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flattenShots, projectStats, splitShotDirection, joinShotDirection, assembleShotImagePrompt, VIDEO_MODELS_CAPABILITIES } from '../projeto/index.js';

/* Integration: onAction(action, payload). No SDK calls originate in this panel.
 * generateShot | selectShotImage | shortenDialogue: { sceneIndex, shotIndex, shotId }
 * copyPrompt: { sceneIndex, shotIndex, shotId, kind: 'image', prompt }
 * runStoryboard: { onlyMissing: boolean }; pause | resume | cancel: {}
 * onChange receives an immutable project copy preserving unknown properties.
 * Optional _sanjaBlocking* editing metadata is translated to legacy visualAction.
 */
const button = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40';
const primary = `${button} !border-amber-400/30 !bg-amber-400 !text-slate-950 hover:!bg-amber-300`;
const input = 'w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-100 placeholder:text-slate-600 focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 disabled:opacity-60';
const shotTypes = ['Plano Geral (Wide)', 'Plano Médio (Medium)', 'Primeiro Plano (Close-up)', 'Plano Detalhe (Extreme Close-up)', 'Plano Sequência Aéreo'];
const cameraMoves = ['Câmera Fixa / Estável', 'Estático', 'Panorâmica Lenta', 'Dolly In / Zoom Suave', 'Travelling Lateral', 'Câmera na Mão / Dinâmico'];
const fold = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const imageSource = shot => shot.generatedImageBase64 ? (shot.generatedImageBase64.startsWith('data:') ? shot.generatedImageBase64 : `data:${shot.generatedMimeType || 'image/jpeg'};base64,${shot.generatedImageBase64}`) : shot.generatedImageUrl || '';
const hasImage = shot => Boolean(shot.generatedImageBase64 || shot.imageMediaId || shot.generatedImageUrl);
const duration = seconds => `${Math.floor(seconds / 60)}min${String(Math.round(seconds % 60)).padStart(2, '0')}s`;
const statusOf = shot => shot.imageStatus === 'generating' ? 'generating' : shot.imageStatus === 'error' ? 'error' : hasImage(shot) ? 'completed' : 'pending';
const statusLabels = { generating: 'Gerando quadro', error: 'Falha na última tentativa', completed: 'Quadro pronto', pending: 'Quadro pendente' };

function Field({ label, children, note }) {
  return <label className="block min-w-0 space-y-1.5"><span className="block text-xs font-medium text-slate-400">{label}</span>{children}{note && <span className="block text-xs leading-5 text-slate-500">{note}</span>}</label>;
}
function DirectionEditor({ value, onCommit, disabled, className, placeholder }) {
  // The legacy serializer trims section edges. Keep a focused draft so typing a
  // trailing space/newline does not join the next word or move the caret.
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setDraft(value); }, [value]);
  return <textarea className={className} placeholder={placeholder} disabled={disabled} value={draft}
    onFocus={() => { focused.current = true; }}
    onBlur={() => { focused.current = false; setDraft(value); }}
    onChange={event => { setDraft(event.target.value); onCommit(event.target.value); }} />;
}
function Options({ value, values, onChange, disabled, ...rest }) {
  const options = [...new Set([value, ...values].filter(v => v !== undefined && v !== null && v !== ''))];
  return <select {...rest} className={input} value={value ?? ''} onChange={event => onChange(event.target.value)} disabled={disabled}>{!value && <option value="">Não definido</option>}{options.map(option => <option key={option} value={option}>{option}</option>)}</select>;
}
function ConfirmDialog({ confirmation, close }) {
  if (!confirmation) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="storyboard-confirm-title" className="w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-amber-300">Conferir antes de continuar</p><h3 id="storyboard-confirm-title" className="text-xl font-semibold text-white">{confirmation.title}</h3></div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{confirmation.description}</p>
      {confirmation.paid && <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">Esta geração pode consumir créditos do Flow. O valor depende do serviço e da sua conta; não há uma estimativa confirmada aqui.</p>}
      <div className="flex flex-wrap justify-end gap-2"><button type="button" className={button} onClick={close} autoFocus>Voltar</button><button type="button" className={primary} onClick={() => { close(); confirmation.run(); }}>{confirmation.label || 'Confirmar geração'}</button></div>
    </section>
  </div>;
}

export function StoryboardPanel({ project, busy = false, onChange, onAction, notify = () => {} }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [collapsed, setCollapsed] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const bible = project?.storyBible || {};
  const characters = bible.characters || [], locations = bible.locations || [];
  const scenes = bible.scenes || [];
  const shots = useMemo(() => flattenShots(project), [project]);
  const stats = useMemo(() => projectStats(project), [project]);
  const queueState = typeof busy === 'object' ? busy?.state || busy?.queue?.state : typeof busy === 'string' ? busy : '';
  const isBusy = typeof busy === 'object' ? ['running', 'cancelling', 'pending'].includes(queueState) : typeof busy === 'string' ? ['running', 'cancelling', 'pending'].includes(busy) : Boolean(busy);
  const isPaused = queueState === 'paused';
  const isLocked = isBusy || (typeof busy === 'object' && Boolean(busy?.locked || (isPaused && busy?.pending > 0)));
  const failed = shots.filter(({ shot }) => statusOf(shot) === 'error').length;
  const pending = shots.filter(({ shot }) => !hasImage(shot)).length;

  function dispatch(action, payload = {}) {
    try { Promise.resolve(onAction?.(action, payload)).catch(error => notify(error?.message || 'Não foi possível concluir a operação.', 'error')); }
    catch (error) { notify(error?.message || 'Não foi possível iniciar a operação.', 'error'); }
  }
  function updateShot(sceneIndex, shotIndex, patch) {
    if (isLocked) return;
    onChange({ ...project, storyBible: { ...bible, scenes: scenes.map((scene, si) => si !== sceneIndex ? scene : {
      ...scene, shots: scene.shots.map((shot, hi) => hi !== shotIndex ? shot : { ...shot, ...patch }),
    }) } });
  }
  function identity(item) { return { sceneIndex: item.sceneIndex, shotIndex: item.shotIndex, shotId: item.shot.shotId }; }
  function generate(item) {
    const run = () => dispatch('generateShot', identity(item));
    if (hasImage(item.shot)) setConfirmation({ title: `Regerar o quadro ${item.shot.shotId}?`, paid: true,
      description: 'O quadro atual continua disponível durante a geração. Uma falha mantém a imagem anterior. Confira o elenco, o cenário e a composição antes de gerar novamente.', run });
    else run();
  }
  function runBatch(onlyMissing) {
    const count = onlyMissing ? pending : shots.length;
    if (!count) { notify('Não há quadros pendentes.', 'info'); return; }
    setConfirmation({ title: `Gerar ${count} ${count === 1 ? 'quadro' : 'quadros'}?`, paid: true,
      description: `${onlyMissing ? 'Serão geradas somente as tomadas sem quadro disponível.' : 'Todas as tomadas serão geradas, inclusive as que já têm imagem.'} As referências serão mantidas. A fila processa uma chamada de cada vez e pausa quando ocorre uma falha. Cancelar impede as próximas chamadas e conserva o resultado da operação em andamento.`,
      run: () => dispatch('runStoryboard', { onlyMissing }) });
  }
  function updateDirection(item, key, value) {
    const direction = splitShotDirection(item.shot);
    updateShot(item.sceneIndex, item.shotIndex, { visualAction: joinShotDirection({ ...direction, [key]: value }),
      ...(item.shot._sanjaBlockingApplied && ['initialFrame', 'gaze'].includes(key) ? { _sanjaBlockingApplied: false } : {}) });
  }
  function blockingDirection(shot, blocking, composition) {
    const direction = splitShotDirection(shot);
    const present = (shot.characterIds || []).map(id => characters.find(c => c.id === id)).filter(Boolean);
    return joinShotDirection({ ...direction,
      initialFrame: [composition, ...present.map(character => `${character.name}: ${blocking[character.id]?.position || 'posição inicial a definir'}.`)].filter(Boolean).join(' '),
      gaze: present.map(character => `${character.name}: ${blocking[character.id]?.lookAt || 'olhar no interlocutor indicado, nunca na lente'}.`).join(' '),
    });
  }
  function changeBlocking(item, characterId, key, value) {
    const next = { ...(item.shot._sanjaBlocking || {}), [characterId]: { ...(item.shot._sanjaBlocking?.[characterId] || {}), [key]: value } };
    updateShot(item.sceneIndex, item.shotIndex, { _sanjaBlocking: next,
      ...(item.shot._sanjaBlockingApplied ? { visualAction: blockingDirection(item.shot, next, item.shot._sanjaBlockingComposition || '') } : {}) });
  }
  function applyBlocking(item) {
    const present = (item.shot.characterIds || []).map(id => characters.find(c => c.id === id)).filter(Boolean);
    if (!present.length || present.some(character => !item.shot._sanjaBlocking?.[character.id]?.position?.trim())) {
      notify('Preencha a posição inicial de cada pessoa presente antes de aplicar as marcações.', 'info'); return;
    }
    setConfirmation({ title: 'Usar estas marcações na direção?', label: 'Aplicar marcações',
      description: 'As posições e os olhares abaixo substituirão o quadro inicial e os olhares atuais. A ação do vídeo, a saída e a voz serão mantidas. Inclua os objetos importantes no campo de composição. Você poderá restaurar o texto anterior.',
      run: () => updateShot(item.sceneIndex, item.shotIndex, { _sanjaBlockingApplied: true,
        _sanjaBlockingPreviousDirection: item.shot._sanjaBlockingPreviousDirection ?? item.shot.visualAction,
        visualAction: blockingDirection(item.shot, item.shot._sanjaBlocking || {}, item.shot._sanjaBlockingComposition || '') }) });
  }
  function matches(item) {
    const status = statusOf(item.shot);
    if (filter !== 'all' && status !== filter) return false;
    const query = fold(search).trim();
    if (!query) return true;
    const shot = item.shot;
    return fold([item.scene.title, shot.shotId, shot.visualAction, shot.dialogueLine, shot.speakerName,
      locations.find(location => location.id === shot.locationId)?.name,
      ...(shot.characterIds || []).map(id => characters.find(character => character.id === id)?.name)].filter(Boolean).join(' ')).includes(query);
  }
  const visible = shots.filter(matches);

  return <section className="space-y-6 text-sm text-slate-200" aria-label="Storyboard">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-amber-300">03 / Storyboard</p><h2 className="text-2xl font-semibold tracking-tight text-white">A história, um quadro por vez</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Componha o instante inicial de cada tomada. Movimento e voz ficam na direção do vídeo.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={isLocked || !shots.length} onClick={() => runBatch(false)}>Gerar todos…</button><button type="button" className={primary} disabled={isLocked || !pending} onClick={() => runBatch(true)}>Gerar pendentes <span className="rounded-md bg-black/10 px-1.5 text-xs">{pending}</span></button></div>
    </header>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[
      [stats.shots, 'Tomadas planejadas', 'text-slate-100'], [stats.images, 'Quadros disponíveis', 'text-emerald-300'],
      [failed, 'Últimas tentativas com falha', failed ? 'text-rose-300' : 'text-slate-100'], [duration(stats.durationSeconds), 'Duração real do storyboard', 'text-amber-300'],
    ].map(([value, label, color]) => <div key={label} className="rounded-2xl border border-white/[.07] bg-white/[.025] px-4 py-3"><div className={`text-xl font-semibold tabular-nums ${color}`}>{value}</div><div className="mt-1 text-xs leading-5 text-slate-400">{label}</div></div>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[.07] bg-slate-900/50 p-3">
      <div className="flex items-center gap-2 text-sm text-slate-400"><span className={`h-2 w-2 rounded-full ${isBusy ? 'animate-pulse bg-amber-300' : isPaused ? 'bg-rose-300' : 'bg-slate-500'}`} />{isBusy ? 'Operação em andamento; o resultado será preservado.' : isPaused ? 'Fila pausada. Revise a falha antes de retomar os pendentes.' : 'Uma chamada por vez. Referências preservadas.'}</div>
      <div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={!isBusy} onClick={() => dispatch('pause')}>Pausar após atual</button><button type="button" className={button} disabled={isBusy} onClick={() => dispatch('resume')}>Retomar fila</button><button type="button" className={`${button} hover:!border-rose-400/30 hover:!text-rose-200`} onClick={() => dispatch('cancel')}>Cancelar pendentes</button></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div role="group" aria-label="Filtrar quadros" className="flex flex-wrap gap-1 rounded-xl border border-white/[.07] bg-slate-950/40 p-1">{[['all', 'Todos'], ['pending', 'Pendentes'], ['error', 'Falhas'], ['completed', 'Concluídos']].map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-sm transition ${filter === value ? 'bg-white/10 font-medium text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>)}</div>
      <label className="relative min-w-[220px] flex-1 md:max-w-sm"><span className="sr-only">Buscar tomada, fala ou personagem</span><input type="search" className={input} value={search} placeholder="Buscar tomada, fala ou personagem…" onChange={event => setSearch(event.target.value)} /></label>
    </div>
    {!shots.length ? <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center"><h3 className="text-lg font-medium text-white">O storyboard começa no roteiro</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Crie ou importe uma história com cenas e tomadas para compor os primeiros quadros.</p></div> : !visible.length ? <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">Nenhuma tomada corresponde a este filtro.</div> : <div className="space-y-5">{scenes.map((scene, sceneIndex) => {
      const items = visible.filter(item => item.sceneIndex === sceneIndex);
      if (!items.length) return null;
      const sceneKey = scene.sceneId || `scene-${sceneIndex}`;
      const sceneSeconds = (scene.shots || []).reduce((total, shot) => total + Number(shot.durationSeconds || 0), 0);
      return <section key={sceneKey} className="overflow-hidden rounded-2xl border border-white/[.08] bg-slate-900/40">
        <button type="button" className="flex w-full items-center justify-between gap-4 bg-white/[.025] px-5 py-4 text-left transition hover:bg-white/[.045]" aria-expanded={!collapsed[sceneKey]} onClick={() => setCollapsed(value => ({ ...value, [sceneKey]: !value[sceneKey] }))}>
          <span className="flex min-w-0 items-center gap-3"><span aria-hidden="true" className={`text-slate-500 transition ${collapsed[sceneKey] ? '-rotate-90' : ''}`}>⌄</span><span><span className="block text-xs font-medium uppercase tracking-wider text-amber-300/80">Cena {scene.sceneNumber ?? sceneIndex + 1}</span><span className="mt-1 block text-base font-semibold text-slate-100">{scene.title || `Cena ${sceneIndex + 1}`}</span></span></span>
          <span className="shrink-0 text-right text-xs leading-5 text-slate-400">{scene.shots.length} tomadas · {duration(sceneSeconds)}{items.length !== scene.shots.length && <span className="block">{items.length} visíveis no filtro</span>}</span>
        </button>
        {!collapsed[sceneKey] && <div className="space-y-5 p-3 md:p-5">{items.map(item => {
          const { shot, shotIndex } = item;
          const direction = splitShotDirection(shot), status = statusOf(shot), src = imageSource(shot);
          const present = (shot.characterIds || []).map(id => characters.find(character => character.id === id)).filter(Boolean);
          const model = shot.videoModel || project.settings?.defaultVideoModel || 'Omni 1.1 Flash';
          const resolution = shot.videoResolution || project.settings?.defaultResolution || '720p';
          const capability = VIDEO_MODELS_CAPABILITIES[model];
          const incompatible = !capability || !capability.supportedDurations.includes(Number(shot.durationSeconds)) || !capability.supportedResolutions.includes(resolution);
          const speakerOffscreen = shot.speakerCharacterId && !(shot.characterIds || []).includes(shot.speakerCharacterId);
          return <article key={shot.shotId} className={`overflow-hidden rounded-2xl border bg-slate-950/35 ${status === 'error' ? 'border-rose-400/25' : 'border-white/[.08]'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[.06] px-4 py-3"><div className="flex items-center gap-3"><span className="font-mono text-xs text-slate-500">{String(sceneIndex + 1).padStart(2, '0')}.{String(shotIndex + 1).padStart(2, '0')}</span><h4 className="font-semibold text-white">Tomada {shot.shotId}</h4><span className="rounded-md bg-white/5 px-2 py-1 text-xs tabular-nums text-slate-400">{shot.durationSeconds}s</span></div><span role={status === 'generating' ? 'status' : undefined} className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === 'error' ? 'bg-rose-400/10 text-rose-300' : status === 'completed' ? 'bg-emerald-400/10 text-emerald-300' : status === 'generating' ? 'bg-amber-400/10 text-amber-200' : 'bg-white/5 text-slate-400'}`}>{statusLabels[status]}</span></div>
            <div className="grid gap-5 p-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-3"><div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-white/[.06] bg-[radial-gradient(ellipse_at_top,_rgba(51,65,85,.3),_rgba(2,6,23,.8))] p-2">
                {src ? <img src={src} alt={`Quadro inicial da tomada ${shot.shotId}`} className="max-h-[360px] w-full object-contain" loading="lazy" /> : <div className="p-6 text-center"><span aria-hidden="true" className="text-3xl text-slate-600">▧</span><p className="mt-3 text-sm leading-6 text-slate-500">{shot.imageMediaId ? 'Quadro cadastrado no Flow. Importe a imagem para visualizar aqui.' : 'O quadro inicial ainda não foi gerado.'}</p></div>}
              </div><div className="grid grid-cols-1 gap-2"><button type="button" className={primary} disabled={isLocked || status === 'generating'} onClick={() => generate(item)}>{status === 'generating' ? 'Gerando…' : hasImage(shot) ? 'Regerar quadro…' : 'Gerar quadro'}</button><button type="button" className={button} disabled={isLocked} onClick={() => dispatch('selectShotImage', identity(item))}>Escolher da galeria</button><button type="button" className={button} onClick={() => dispatch('copyPrompt', { ...identity(item), kind: 'image', prompt: assembleShotImagePrompt(shot, characters, locations, project.settings || {}).prompt })}>Copiar prompt do quadro</button></div>
              {shot.lastError && status === 'error' && <div role="alert" className="space-y-2 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3"><p className="text-xs font-semibold text-rose-200">Erro da última tentativa</p><p className="break-words whitespace-pre-wrap text-sm leading-6 text-rose-100/90">{shot.lastError}</p>{hasImage(shot) && <p className="text-xs leading-5 text-slate-400">O quadro anterior está preservado e continua disponível.</p>}</div>}</div>
              <div className="min-w-0 space-y-4">
                <Field label="Quadro inicial · somente o que aparece neste instante" note={!direction.hasExplicitInitialFrame ? 'Descreva a composição estática. A ação antiga foi mantida na direção do vídeo.' : undefined}><DirectionEditor className={`${input} min-h-[112px] resize-y`} value={direction.initialFrame} disabled={isLocked} onCommit={value => updateDirection(item, 'initialFrame', value)} placeholder="Quem está à esquerda e à direita? O que cada pessoa segura? Para onde olha?" /></Field>
                <div className="grid gap-3 sm:grid-cols-[minmax(150px,.7fr)_minmax(0,1.3fr)]"><Field label="Quem fala"><select className={input} disabled={isLocked} value={shot.speakerCharacterId || ''} onChange={event => { const character = characters.find(c => c.id === event.target.value); updateShot(sceneIndex, shotIndex, { speakerCharacterId: event.target.value, speakerName: character?.name || '' }); }}><option value="">Sem fala</option>{speakerOffscreen && <option value={shot.speakerCharacterId}>{shot.speakerName || characters.find(c => c.id === shot.speakerCharacterId)?.name || shot.speakerCharacterId} · fora de quadro</option>}{present.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}</select></Field><Field label="Emoção"><input className={input} disabled={isLocked} value={shot.emotion || ''} onChange={event => updateShot(sceneIndex, shotIndex, { emotion: event.target.value })} /></Field></div>
                {speakerOffscreen && <p className="text-xs leading-5 text-amber-200">O falante atual está fora do elenco visível. A referência e a fala foram mantidas; confira se a voz deve vir de fora de quadro.</p>}
                <Field label="Fala exata"><textarea className={`${input} min-h-[82px] resize-y`} disabled={isLocked} value={shot.dialogueLine || ''} onChange={event => updateShot(sceneIndex, shotIndex, { dialogueLine: event.target.value })} /></Field>
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-500">{(shot.dialogueLine || '').trim().split(/\s+/).filter(Boolean).length} palavras · {shot.durationSeconds}s de tomada</span><button type="button" className={button} disabled={isLocked || !shot.dialogueLine?.trim()} onClick={() => setConfirmation({ title: 'Encurtar esta fala com IA?', paid: true, description: 'A fala será adaptada ao tempo da tomada. Revise o texto retornado antes de gerar o vídeo.', label: 'Encurtar fala', run: () => dispatch('shortenDialogue', identity(item)) })}>Encurtar fala com IA…</button></div>
                <details className="rounded-xl border border-white/[.07] bg-white/[.015]"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">Direção do vídeo, olhares e saída</summary><div className="space-y-3 border-t border-white/[.06] p-4">{[['temporalAction', 'Ação ao longo do vídeo'], ['gaze', 'Olhares e escuta'], ['exit', 'Saída para o corte'], ['voice', 'Direção de voz'], ['general', 'Direção geral']].map(([key, label]) => <Field key={key} label={label}><DirectionEditor className={`${input} min-h-[80px] resize-y`} value={direction[key]} disabled={isLocked} onCommit={value => updateDirection(item, key, value)} /></Field>)}</div></details>
                <details className="rounded-xl border border-white/[.07] bg-white/[.015]"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">Plano, câmera, elenco e configurações</summary><div className="space-y-4 border-t border-white/[.06] p-4">
                  <div className="grid gap-3 sm:grid-cols-2"><Field label="Tipo de plano"><Options value={shot.shotType || ''} values={shotTypes} onChange={value => updateShot(sceneIndex, shotIndex, { shotType: value })} disabled={isLocked} /></Field><Field label="Movimento de câmera"><Options value={shot.cameraMovement || ''} values={cameraMoves} onChange={value => updateShot(sceneIndex, shotIndex, { cameraMovement: value })} disabled={isLocked} /></Field><Field label="Duração"><Options value={String(shot.durationSeconds)} values={['4', '6', '8', '10']} onChange={value => updateShot(sceneIndex, shotIndex, { durationSeconds: Number(value) })} disabled={isLocked} /></Field><Field label="Cenário"><select className={input} value={shot.locationId || ''} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { locationId: event.target.value })}><option value="">Sem cenário vinculado</option>{locations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)}</select></Field></div>
                  <fieldset><legend className="mb-2 text-xs font-medium text-slate-400">Pessoas presentes no quadro</legend><div className="flex flex-wrap gap-2">{characters.map(character => <label key={character.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${shot.characterIds?.includes(character.id) ? 'border-amber-400/25 bg-amber-400/5 text-amber-100' : 'border-white/10 text-slate-400'}`}><input type="checkbox" className="accent-amber-400" checked={shot.characterIds?.includes(character.id) || false} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { characterIds: event.target.checked ? [...new Set([...(shot.characterIds || []), character.id])] : (shot.characterIds || []).filter(id => id !== character.id) })} />{character.name}</label>)}</div></fieldset>
                  {present.length > 0 && <div className="grid gap-3 sm:grid-cols-2">{present.map(character => <Field key={character.id} label={`Figurino · ${character.name}`}><select className={input} value={shot.wardrobeMap?.[character.id] || ''} disabled={isLocked} onChange={event => { const nextMap = { ...(shot.wardrobeMap || {}) }; if (event.target.value) nextMap[character.id] = event.target.value; else delete nextMap[character.id]; updateShot(sceneIndex, shotIndex, { wardrobeMap: nextMap }); }}><option value="">Padrão do personagem</option>{(character.wardrobes || []).map(wardrobe => <option key={wardrobe.id} value={wardrobe.id}>{wardrobe.name || wardrobe.label || wardrobe.description || wardrobe.id}</option>)}</select></Field>)}</div>}
                  <div className="grid gap-3 sm:grid-cols-2"><Field label="Modelo de vídeo desta tomada"><select className={input} value={shot.videoModel || ''} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { videoModel: event.target.value })}><option value="">Padrão do projeto · {project.settings?.defaultVideoModel || 'Omni 1.1 Flash'}</option>{!VIDEO_MODELS_CAPABILITIES[model] && <option value={model}>{model} · verificar compatibilidade</option>}{Object.keys(VIDEO_MODELS_CAPABILITIES).map(name => <option key={name} value={name}>{name}</option>)}</select></Field><Field label="Resolução do vídeo desta tomada"><select className={input} value={shot.videoResolution || ''} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { videoResolution: event.target.value })}><option value="">Padrão do projeto · {project.settings?.defaultResolution || '720p'}</option>{[...new Set([resolution, '360p', '720p'])].map(value => <option key={value} value={value}>{value}{capability && !capability.supportedResolutions.includes(value) ? ' · incompatível com este modelo' : ''}</option>)}</select></Field></div>
                  {incompatible && <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">A combinação de modelo, duração e resolução precisa ser ajustada antes de animar. A duração desta tomada foi mantida.</p>}
                  <Field label="Tom da voz"><input className={input} value={shot.voiceTone || ''} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { voiceTone: event.target.value })} /></Field><Field label="Som ambiente e efeitos"><textarea className={`${input} min-h-[75px] resize-y`} value={shot.sfxAmbience || ''} disabled={isLocked} onChange={event => updateShot(sceneIndex, shotIndex, { sfxAmbience: event.target.value })} /></Field>
                  <label className="flex items-start gap-2 text-sm leading-6 text-slate-300"><input type="checkbox" className="mt-1.5 accent-amber-400" checked={Boolean(shot.isContinuationOfPrevious)} disabled={isLocked || shotIndex === 0} onChange={event => updateShot(sceneIndex, shotIndex, { isContinuationOfPrevious: event.target.checked })} /><span>Usar também o quadro anterior como referência de continuidade. As referências de rosto e cenário serão mantidas.</span></label>
                </div></details>
                <details className="rounded-xl border border-white/[.07] bg-white/[.015]"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">Marcações por pessoa · opcional</summary><div className="space-y-4 border-t border-white/[.06] p-4"><p className="text-xs leading-5 text-slate-400">Defina posições e olhares e aplique à direção. A ação do vídeo e a voz continuam separadas.</p>{!present.length && <p className="text-sm text-slate-500">Selecione o elenco presente para definir as marcações.</p>}{present.map(character => <div key={character.id} className="space-y-3 rounded-xl border border-white/[.06] p-3"><p className="text-sm font-medium text-slate-200">{character.name}</p><div className="grid gap-3 sm:grid-cols-2"><Field label="Posição no quadro inicial"><input className={input} value={shot._sanjaBlocking?.[character.id]?.position || ''} disabled={isLocked} placeholder="À esquerda, em três quartos, junto ao balcão…" onChange={event => changeBlocking(item, character.id, 'position', event.target.value)} /></Field><Field label="Direção do olhar"><input className={input} value={shot._sanjaBlocking?.[character.id]?.lookAt || ''} disabled={isLocked} placeholder="Nos olhos de Valéria, à direita…" onChange={event => changeBlocking(item, character.id, 'lookAt', event.target.value)} /></Field></div></div>)}
                  <Field label="Composição e objetos que devem aparecer"><textarea className={`${input} min-h-[75px] resize-y`} value={shot._sanjaBlockingComposition || ''} disabled={isLocked} placeholder="Altura da câmera, porta ao fundo, copo na mão…" onChange={event => updateShot(sceneIndex, shotIndex, { _sanjaBlockingComposition: event.target.value,
                    ...(shot._sanjaBlockingApplied ? { visualAction: blockingDirection(shot, shot._sanjaBlocking || {}, event.target.value) } : {}) })} /></Field>
                  <div className="flex flex-wrap items-center gap-2"><button type="button" className={button} disabled={isLocked || !present.length} onClick={() => applyBlocking(item)}>{shot._sanjaBlockingApplied ? 'Reaplicar marcações…' : 'Aplicar marcações à direção…'}</button>{shot._sanjaBlockingPreviousDirection !== undefined && <button type="button" className={button} disabled={isLocked} onClick={() => updateShot(sceneIndex, shotIndex, { visualAction: shot._sanjaBlockingPreviousDirection, _sanjaBlockingApplied: false })}>Restaurar direção anterior</button>}<span className={`text-xs ${shot._sanjaBlockingApplied ? 'text-emerald-300' : 'text-slate-500'}`}>{shot._sanjaBlockingApplied ? 'Marcações aplicadas ao quadro e aos olhares.' : 'As marcações serão usadas depois de aplicar.'}</span></div>
                </div></details>
              </div>
            </div>
          </article>;
        })}</div>}
      </section>;
    })}</div>}
    <ConfirmDialog confirmation={confirmation} close={() => setConfirmation(null)} />
  </section>;
}

export default StoryboardPanel;
