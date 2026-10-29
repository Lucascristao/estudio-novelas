import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flattenShots, projectStats, assembleVideoPrompt, VIDEO_MODELS_CAPABILITIES } from '../projeto/index.js';

/* Integration: all paid/SDK operations are delegated to the root.
 * generateVideo: { sceneIndex, shotIndex, shotId }
 * runAnimation: { onlyMissing, approvedOnly, targetResolution? }
 * downloadClip: { sceneIndex, shotIndex, shotId }
 * copyPrompt: { sceneIndex, shotIndex, shotId, kind: 'video', prompt }
 * pause | resume | cancel: {}
 * Approval/reordering/model edits use onChange(nextProject), retaining unknown fields.
 */
const button = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40';
const primary = `${button} !border-amber-400/30 !bg-amber-400 !text-slate-950 hover:!bg-amber-300`;
const input = 'w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-100 focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 disabled:opacity-60';
const hasVideo = shot => Boolean(shot.generatedVideoBase64 || shot.videoMediaId || shot.generatedVideoUrl);
const canDownloadClip = shot => Boolean(shot.generatedVideoBase64);
const hasImage = shot => Boolean(shot.generatedImageBase64 || shot.imageMediaId || shot.generatedImageUrl);
const source = (base64, mimeType, url = '') => base64 ? (base64.startsWith('data:') ? base64 : `data:${mimeType};base64,${base64}`) : url;
const imageSource = shot => source(shot.generatedImageBase64, shot.generatedMimeType || 'image/jpeg', shot.generatedImageUrl || '');
const videoSource = shot => source(shot.generatedVideoBase64, shot.generatedVideoMimeType || 'video/mp4', shot.generatedVideoUrl || '');
const time = seconds => `${Math.floor(Number(seconds || 0) / 60)}:${String(Math.floor(Number(seconds || 0) % 60)).padStart(2, '0')}`;
const statusOf = shot => shot.videoStatus === 'generating' ? 'generating' : shot.videoStatus === 'error' ? 'error' : hasVideo(shot) ? 'completed' : 'pending';
const statusLabels = { generating: 'Gerando vídeo', error: 'Falha na última tentativa', completed: 'Vídeo pronto', pending: 'Vídeo pendente' };
const badgeClasses = { generating: 'bg-amber-400/10 text-amber-200', error: 'bg-rose-400/10 text-rose-300', completed: 'bg-emerald-400/10 text-emerald-300', pending: 'bg-white/5 text-slate-400' };
function Field({ label, children, note }) {
  return <label className="block min-w-0 space-y-1.5"><span className="block text-xs font-medium text-slate-400">{label}</span>{children}{note && <span className="block text-xs leading-5 text-slate-500">{note}</span>}</label>;
}

export function VideosPanel({ project, busy = false, onChange, onAction, notify = () => {} }) {
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirmation, setConfirmation] = useState(null);
  const videoRef = useRef(null);
  const bible = project?.storyBible || {}, scenes = bible.scenes || [], settings = project?.settings || {};
  const stats = useMemo(() => projectStats(project), [project]);
  const timeline = useMemo(() => {
    let cursor = 0;
    return flattenShots(project).map(item => {
      const start = cursor;
      cursor += Math.max(0, Number(item.shot.durationSeconds) || 0);
      return { ...item, start, end: cursor };
    });
  }, [project]);
  const active = timeline.find(item => item.shot.shotId === selectedId) || timeline[0];
  const activeId = active?.shot.shotId;
  const queueState = typeof busy === 'object' ? busy?.state || busy?.queue?.state : typeof busy === 'string' ? busy : '';
  const isBusy = typeof busy === 'object' ? ['running', 'cancelling', 'pending'].includes(queueState) : typeof busy === 'string' ? ['running', 'cancelling', 'pending'].includes(busy) : Boolean(busy);
  const isPaused = queueState === 'paused';
  const isLocked = isBusy || (typeof busy === 'object' && Boolean(busy?.locked || (isPaused && busy?.pending > 0)));
  const failed = timeline.filter(({ shot }) => statusOf(shot) === 'error').length;
  const pending = timeline.filter(({ shot }) => !hasVideo(shot));
  const approved = timeline.filter(({ shot }) => shot.isApproved === true);

  useEffect(() => {
    if (activeId !== selectedId) setSelectedId(activeId || null);
  }, [activeId, selectedId]);
  useEffect(() => () => { videoRef.current?.pause(); }, []);

  function dispatch(action, payload = {}) {
    try { Promise.resolve(onAction?.(action, payload)).catch(error => notify(error?.message || 'Não foi possível concluir a operação.', 'error')); }
    catch (error) { notify(error?.message || 'Não foi possível iniciar a operação.', 'error'); }
  }
  function identity(item) { return { sceneIndex: item.sceneIndex, shotIndex: item.shotIndex, shotId: item.shot.shotId }; }
  function updateShot(item, patch) {
    if (isLocked) return;
    onChange({ ...project, storyBible: { ...bible, scenes: scenes.map((scene, index) => index !== item.sceneIndex ? scene : {
      ...scene, shots: scene.shots.map((shot, shotIndex) => shotIndex !== item.shotIndex ? shot : { ...shot, ...patch }),
    }) } });
  }
  function select(item) { videoRef.current?.pause(); setSelectedId(item.shot.shotId); }
  function move(item, offset) {
    if (isLocked) return;
    const target = item.shotIndex + offset;
    const original = scenes[item.sceneIndex];
    if (!original || target < 0 || target >= original.shots.length) return;
    const reordered = [...original.shots];
    const [shot] = reordered.splice(item.shotIndex, 1);
    reordered.splice(target, 0, shot);
    // Selection follows the shot ID, not its previous index; every field travels with it.
    setSelectedId(shot.shotId);
    onChange({ ...project, storyBible: { ...bible, scenes: scenes.map((scene, index) => index !== item.sceneIndex ? scene : { ...scene, shots: reordered }) } });
  }
  function compatibility(item, targetResolution) {
    const model = item.shot.videoModel || settings.defaultVideoModel || 'Omni 1.1 Flash';
    const resolution = targetResolution || item.shot.videoResolution || settings.defaultResolution || '720p';
    const capability = VIDEO_MODELS_CAPABILITIES[model];
    return { model, resolution, capability, valid: Boolean(capability?.supportedDurations.includes(Number(item.shot.durationSeconds)) && capability?.supportedResolutions.includes(resolution)) };
  }
  function confirmOne(item) {
    if (!hasImage(item.shot)) { notify('Esta tomada precisa de um quadro inicial no storyboard antes de animar.', 'info'); return; }
    const config = compatibility(item);
    if (!config.valid) { notify('Ajuste o modelo, a duração e a resolução desta tomada antes de gerar. Os valores não foram alterados.', 'error'); return; }
    setConfirmation({ title: `${hasVideo(item.shot) ? 'Regerar' : 'Gerar'} o vídeo ${item.shot.shotId}?`,
      description: `${config.model} · ${item.shot.durationSeconds}s · ${config.resolution}. O vídeo usará o quadro inicial desta tomada.${hasVideo(item.shot) ? ' O clipe atual continua disponível durante a geração e será preservado se ocorrer uma falha.' : ''}`,
      label: hasVideo(item.shot) ? 'Regerar vídeo' : 'Gerar vídeo', run: () => dispatch('generateVideo', identity(item)) });
  }
  function confirmBatch(mode) {
    const tasks = mode === 'approved' ? approved : pending;
    const targetResolution = mode === 'approved' ? '720p' : undefined;
    if (!tasks.length) { notify(mode === 'approved' ? 'Aprove ao menos uma tomada para gerar os clipes em 720p.' : 'Não há vídeos pendentes.', 'info'); return; }
    const missing = tasks.filter(({ shot }) => !hasImage(shot));
    const incompatible = tasks.filter(item => !compatibility(item, targetResolution).valid);
    if (missing.length || incompatible.length) {
      notify([missing.length ? `${missing.length} tomada(s) precisam de quadro inicial.` : '', incompatible.length ? `${incompatible.length} tomada(s) têm modelo, duração ou resolução incompatíveis.` : '', 'Ajuste estas tomadas antes de iniciar o lote.'].filter(Boolean).join(' '), 'error');
      return;
    }
    setConfirmation({ title: mode === 'approved' ? `Gerar ${tasks.length} ${tasks.length === 1 ? 'aprovado' : 'aprovados'} em 720p?` : `Gerar ${tasks.length} ${tasks.length === 1 ? 'vídeo pendente' : 'vídeos pendentes'}?`,
      description: `${mode === 'approved' ? 'Todos os vídeos marcados como aprovados serão gerados em 720p, inclusive os que já têm clipe. Os modelos e as durações de cada tomada serão mantidos.' : 'Somente as tomadas sem vídeo disponível serão geradas, usando o modelo, a resolução e a duração de cada uma.'} A fila processa uma chamada por vez. Uma falha pausa os próximos itens; o pedido que falhou não é repetido automaticamente.`,
      label: 'Iniciar geração', run: () => dispatch('runAnimation', { onlyMissing: mode !== 'approved', approvedOnly: mode === 'approved', ...(targetResolution ? { targetResolution } : {}) }) });
  }
  function copy(item) {
    dispatch('copyPrompt', { ...identity(item), kind: 'video', prompt: assembleVideoPrompt(item.shot, bible.characters || [], bible.locations || [], settings) });
  }
  const filtered = timeline.filter(({ shot }) => filter === 'all' || (filter === 'approved' ? shot.isApproved === true : statusOf(shot) === filter));
  const activeConfig = active ? compatibility(active) : null;
  const activeSrc = active ? videoSource(active.shot) : '';
  const activeImage = active ? imageSource(active.shot) : '';

  return <section className="space-y-6 text-sm text-slate-200" aria-label="Vídeos e timeline">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-amber-300">04 / Vídeos & timeline</p><h2 className="text-2xl font-semibold tracking-tight text-white">Dê movimento à sua história</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Assista uma tomada por vez, ajuste a ordem e aprove os clipes que seguem para a versão final.</p></div><div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={isLocked || !approved.length} onClick={() => confirmBatch('approved')}>Aprovados em 720p… <span className="rounded-md bg-white/5 px-1.5 text-xs">{approved.length}</span></button><button type="button" className={primary} disabled={isLocked || !pending.length} onClick={() => confirmBatch('pending')}>Animar pendentes… <span className="rounded-md bg-black/10 px-1.5 text-xs">{pending.length}</span></button></div></header>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[[stats.videos, 'Vídeos disponíveis', 'text-emerald-300'], [approved.length, 'Tomadas aprovadas', 'text-amber-300'], [failed, 'Últimas tentativas com falha', failed ? 'text-rose-300' : 'text-slate-100'], [time(stats.durationSeconds), 'Duração real da sequência', 'text-slate-100']].map(([value, label, color]) => <div key={label} className="rounded-2xl border border-white/[.07] bg-white/[.025] px-4 py-3"><div className={`text-xl font-semibold tabular-nums ${color}`}>{value}</div><div className="mt-1 text-xs leading-5 text-slate-400">{label}</div></div>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[.07] bg-slate-900/50 p-3"><p className="flex items-center gap-2 text-sm text-slate-400"><span className={`h-2 w-2 rounded-full ${isBusy ? 'animate-pulse bg-amber-300' : isPaused ? 'bg-rose-300' : 'bg-slate-500'}`} />{isBusy ? 'Operação em andamento; o resultado será preservado.' : isPaused ? 'Fila pausada. Confira o erro antes de retomar os próximos itens.' : 'Aprovar uma tomada não inicia uma geração.'}</p><div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={!isBusy} onClick={() => dispatch('pause')}>Pausar após atual</button><button type="button" className={button} disabled={isBusy} onClick={() => dispatch('resume')}>Retomar fila</button><button type="button" className={`${button} hover:!border-rose-400/30 hover:!text-rose-200`} onClick={() => dispatch('cancel')}>Cancelar pendentes</button></div></div>
    {!timeline.length ? <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center"><h3 className="text-lg font-medium text-white">Seu primeiro clipe começa com um quadro</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Crie as tomadas e seus quadros iniciais no storyboard. Elas aparecerão aqui na ordem da história.</p></div> : <>
      <section className="rounded-2xl border border-white/[.08] bg-slate-900/40 p-4 md:p-5" aria-label="Sequência de tomadas">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-base font-semibold text-white">Sequência da história</h3><p className="text-xs text-slate-500">{timeline.length} tomadas · {time(stats.durationSeconds)} · selecione para assistir</p></div>
        <ol className="flex gap-3 overflow-x-auto pb-3" aria-label="Timeline">{timeline.map((item, index) => {
          const { shot } = item, poster = imageSource(shot), selected = shot.shotId === activeId;
          return <li key={shot.shotId} className="w-32 shrink-0"><button type="button" aria-pressed={selected} onClick={() => select(item)} className={`w-full overflow-hidden rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${selected ? 'border-amber-400/70 bg-amber-400/5 ring-1 ring-amber-400/25' : 'border-white/[.08] bg-slate-950/50 hover:border-white/25'}`}>
            <div className="relative flex h-24 items-center justify-center bg-slate-950/60">{poster ? <img src={poster} alt="" className="h-full w-full object-contain" loading="lazy" /> : <span aria-hidden="true" className="text-2xl text-slate-600">{hasVideo(shot) ? '▷' : '▧'}</span>}<span className="absolute bottom-1 left-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-xs tabular-nums text-slate-300">{shot.durationSeconds}s</span>{shot.isApproved && <span className="absolute right-1 top-1 rounded-full bg-emerald-400 px-1.5 py-0.5 text-xs font-bold text-emerald-950" aria-label="Aprovada">✓</span>}</div>
            <div className="space-y-1 p-2"><p className={`truncate text-sm font-medium ${selected ? 'text-amber-100' : 'text-slate-200'}`}>{index + 1}. {shot.shotId}</p><p className="text-xs tabular-nums text-slate-500">{time(item.start)} — {time(item.end)}</p><p className={`text-xs ${statusOf(shot) === 'error' ? 'text-rose-300' : hasVideo(shot) ? 'text-emerald-300' : 'text-slate-500'}`}>{statusOf(shot) === 'error' ? 'Última tentativa falhou' : hasVideo(shot) ? 'Clipe disponível' : 'Sem clipe'}</p></div>
          </button></li>;
        })}</ol>
      </section>
      {active && <section className="overflow-hidden rounded-2xl border border-white/[.08] bg-slate-900/40" aria-label={`Prévia da tomada ${activeId}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.06] px-5 py-4"><div><p className="text-xs text-slate-500">{active.scene.title || `Cena ${active.sceneIndex + 1}`} · {time(active.start)}–{time(active.end)}</p><h3 className="mt-1 text-lg font-semibold text-white">Tomada {activeId}</h3></div><div className="flex flex-wrap items-center gap-2"><span role={statusOf(active.shot) === 'generating' ? 'status' : undefined} className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClasses[statusOf(active.shot)]}`}>{statusLabels[statusOf(active.shot)]}</span><label className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${active.shot.isApproved ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-white/10 text-slate-300'}`}><input type="checkbox" className="accent-emerald-400" checked={active.shot.isApproved === true} disabled={isLocked} onChange={event => updateShot(active, { isApproved: event.target.checked })} />{active.shot.isApproved ? 'Tomada aprovada' : 'Aprovar tomada'}</label></div></div>
        <div className="grid gap-5 p-4 md:p-5 xl:grid-cols-[minmax(300px,.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 space-y-3"><div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-white/[.06] bg-slate-950 p-2">
            {activeSrc ? <video key={`${activeId}:${active.shot.videoMediaId || activeSrc.slice(-32)}`} ref={videoRef} src={activeSrc} poster={activeImage || undefined} controls playsInline preload="metadata" autoPlay={false} className="max-h-[520px] w-full object-contain" aria-label={`Vídeo da tomada ${activeId}`} /> : activeImage ? <img src={activeImage} alt={`Quadro inicial da tomada ${activeId}; vídeo ainda indisponível`} className="max-h-[520px] w-full object-contain" /> : <p className="max-w-xs p-6 text-center text-sm leading-6 text-slate-500">{active.shot.videoMediaId ? 'Clipe cadastrado no Flow. Os bytes do vídeo ainda não estão disponíveis nesta prévia.' : 'O quadro inicial e o clipe ainda não estão disponíveis para prévia.'}</p>}
          </div><p className="text-center text-xs leading-5 text-slate-500">{activeSrc ? 'Prévia do clipe disponível. A reprodução começa somente ao apertar play.' : activeImage ? 'Este é o quadro inicial. Gere o vídeo para assistir ao movimento.' : 'A prévia aparece quando a mídia estiver disponível.'}</p>
          <details className="rounded-xl border border-white/[.07]"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">Ver quadro inicial</summary><div className="border-t border-white/[.06] p-3">{activeImage ? <img src={activeImage} alt={`Quadro inicial de referência da tomada ${activeId}`} loading="lazy" className="max-h-[360px] w-full object-contain" /> : <p className="p-3 text-sm leading-6 text-slate-500">{active.shot.imageMediaId ? 'O quadro está vinculado pelo mediaId no Flow; a imagem não está embutida no projeto.' : 'Gere ou importe o quadro inicial no storyboard.'}</p>}</div></details>
          </div>
          <div className="min-w-0 space-y-4">
            {active.shot.lastError && statusOf(active.shot) === 'error' && <div role="alert" className="space-y-2 rounded-xl border border-rose-400/20 bg-rose-400/5 p-4"><p className="text-xs font-semibold text-rose-200">Erro da última tentativa</p><p className="break-words whitespace-pre-wrap text-sm leading-6 text-rose-100/90">{active.shot.lastError}</p>{hasVideo(active.shot) && <p className="text-xs leading-5 text-slate-400">O clipe anterior foi preservado. A prévia e o download ficam disponíveis quando o vídeo está incorporado ao projeto.</p>}</div>}
            <div className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-xs font-medium text-amber-300">{active.shot.speakerName || (active.shot.dialogueLine ? 'Falante não definido' : 'Tomada sem fala')}</p><p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-100">{active.shot.dialogueLine || 'A narrativa desta tomada acontece pela ação e pelas reações.'}</p>{active.shot.emotion && <p className="mt-3 text-xs leading-5 text-slate-500">Emoção: {active.shot.emotion}</p>}</div>
            <div className="grid gap-3 sm:grid-cols-2"><Field label="Modelo desta tomada"><select className={input} disabled={isLocked} value={active.shot.videoModel || ''} onChange={event => updateShot(active, { videoModel: event.target.value })}><option value="">Padrão do projeto · {settings.defaultVideoModel || 'Omni 1.1 Flash'}</option>{!VIDEO_MODELS_CAPABILITIES[activeConfig.model] && <option value={activeConfig.model}>{activeConfig.model} · verificar compatibilidade</option>}{Object.keys(VIDEO_MODELS_CAPABILITIES).map(name => <option key={name} value={name}>{name}</option>)}</select></Field><Field label="Resolução desta tomada"><select className={input} disabled={isLocked} value={active.shot.videoResolution || ''} onChange={event => updateShot(active, { videoResolution: event.target.value })}><option value="">Padrão do projeto · {settings.defaultResolution || '720p'}</option>{[...new Set([activeConfig.resolution, '360p', '720p'])].map(value => <option key={value} value={value}>{value}{activeConfig.capability && !activeConfig.capability.supportedResolutions.includes(value) ? ' · incompatível com o modelo' : ''}</option>)}</select></Field><Field label="Duração da tomada" note="A mudança é aplicada ao storyboard e à timeline."><select className={input} disabled={isLocked} value={String(active.shot.durationSeconds)} onChange={event => updateShot(active, { durationSeconds: Number(event.target.value) })}>{[...new Set([String(active.shot.durationSeconds), '4', '6', '8', '10'])].map(value => <option key={value} value={value}>{value}s{activeConfig.capability && !activeConfig.capability.supportedDurations.includes(Number(value)) ? ' · incompatível com o modelo' : ''}</option>)}</select></Field><div className="self-start rounded-lg border border-white/[.06] p-3"><p className="text-xs text-slate-500">Configuração efetiva</p><p className="mt-1 text-sm leading-6 text-slate-300">{activeConfig.model}<br />{active.shot.durationSeconds}s · {activeConfig.resolution}</p></div></div>
            {!activeConfig.valid && <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">Esta combinação não é compatível. {activeConfig.capability ? `O modelo aceita ${activeConfig.capability.supportedDurations.join(', ')}s e ${activeConfig.capability.supportedResolutions.join(', ')}.` : 'Selecione um modelo conhecido.'} A ferramenta mantém a duração até você alterá-la.</p>}
            {!hasImage(active.shot) && <p className="rounded-xl border border-white/10 bg-white/[.025] p-3 text-sm leading-6 text-slate-400">Falta o quadro inicial desta tomada. Gere ou importe uma imagem no storyboard antes de animar.</p>}
            <div className="flex flex-wrap gap-2"><button type="button" className={primary} disabled={isLocked || !hasImage(active.shot) || !activeConfig.valid} onClick={() => confirmOne(active)}>{statusOf(active.shot) === 'generating' ? 'Gerando…' : hasVideo(active.shot) ? 'Regerar este vídeo…' : 'Animar esta tomada…'}</button><button type="button" className={button} disabled={!canDownloadClip(active.shot)} onClick={() => dispatch('downloadClip', identity(active))}>Baixar clipe</button><button type="button" className={button} onClick={() => copy(active)}>Copiar prompt do vídeo</button></div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[.07] p-3"><span className="text-xs leading-5 text-slate-500">Ordem dentro de {active.scene.title || `cena ${active.sceneIndex + 1}`}<br />A tomada selecionada acompanha a mudança.</span><div className="flex gap-2"><button type="button" className={button} disabled={isLocked || active.shotIndex === 0} onClick={() => move(active, -1)}>↑ Subir</button><button type="button" className={button} disabled={isLocked || active.shotIndex === active.scene.shots.length - 1} onClick={() => move(active, 1)}>↓ Descer</button></div></div>
            <details className="rounded-xl border border-white/[.07]"><summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">Direção completa desta tomada</summary><div className="space-y-3 border-t border-white/[.06] p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">{active.shot.visualAction || 'A direção será definida no storyboard.'}</p>{active.shot.sfxAmbience && <div><p className="text-xs font-medium text-slate-500">Som ambiente</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-400">{active.shot.sfxAmbience}</p></div>}</div></details>
          </div>
        </div>
      </section>}
      <section className="space-y-3" aria-label="Lista de tomadas"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-base font-semibold text-white">Todas as tomadas</h3><div role="group" aria-label="Filtrar vídeos" className="flex flex-wrap gap-1 rounded-xl border border-white/[.07] bg-slate-950/40 p-1">{[['all', 'Todos'], ['pending', 'Pendentes'], ['error', 'Falhas'], ['completed', 'Concluídos'], ['approved', 'Aprovados']].map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-sm transition ${filter === value ? 'bg-white/10 font-medium text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>)}</div></div>
        {!filtered.length ? <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">Nenhuma tomada corresponde a este filtro.</div> : <div className="overflow-hidden rounded-2xl border border-white/[.08]">{filtered.map(item => {
          const { shot } = item, status = statusOf(shot), config = compatibility(item);
          return <article key={shot.shotId} className={`flex flex-wrap items-center justify-between gap-3 border-b border-white/[.06] p-4 last:border-b-0 ${shot.shotId === activeId ? 'bg-amber-400/[.045]' : 'bg-slate-900/30'}`}>
            <button type="button" onClick={() => select(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="min-w-10 text-xs tabular-nums text-slate-500">{time(item.start)}</span><span className="min-w-0"><span className="block text-sm font-medium text-slate-100">{shot.shotId} <span className="ml-2 text-xs font-normal text-slate-500">{shot.durationSeconds}s · {config.resolution}</span></span><span className="mt-1 block truncate text-sm text-slate-400">{shot.speakerName ? `${shot.speakerName}: ` : ''}{shot.dialogueLine || shot.shotType || item.scene.title}</span><span className={`mt-1 inline-block text-xs ${status === 'error' ? 'text-rose-300' : status === 'completed' ? 'text-emerald-300' : 'text-slate-500'}`}>{statusLabels[status]}{shot.isApproved ? ' · Aprovada' : ''}</span></span></button>
            <div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-2 px-2 py-2 text-xs text-slate-400"><input type="checkbox" className="accent-emerald-400" aria-label={`Aprovar tomada ${shot.shotId}`} checked={shot.isApproved === true} disabled={isLocked} onChange={event => updateShot(item, { isApproved: event.target.checked })} />Aprovar</label><button type="button" className={button} disabled={isLocked || !hasImage(shot) || !config.valid} onClick={() => confirmOne(item)}>{hasVideo(shot) ? 'Regerar…' : 'Animar…'}</button><button type="button" className={button} disabled={!canDownloadClip(shot)} onClick={() => dispatch('downloadClip', identity(item))}>Baixar</button></div>
          </article>;
        })}</div>}
      </section>
    </>}
    {confirmation && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setConfirmation(null); }}><section role="dialog" aria-modal="true" aria-labelledby="videos-confirm-title" className="w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onKeyDown={event => { if (event.key === 'Escape') setConfirmation(null); }}><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-amber-300">Conferir antes de gerar</p><h3 id="videos-confirm-title" className="text-xl font-semibold text-white">{confirmation.title}</h3></div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{confirmation.description}</p><p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">Esta geração consome créditos do Flow. O valor depende do modelo, da duração, da resolução e da sua conta; não há uma estimativa confirmada aqui.</p><div className="flex flex-wrap justify-end gap-2"><button type="button" className={button} autoFocus onClick={() => setConfirmation(null)}>Voltar</button><button type="button" className={primary} onClick={() => { const run = confirmation.run; setConfirmation(null); run(); }}>{confirmation.label || 'Confirmar geração'}</button></div></section></div>}
  </section>;
}

export default VideosPanel;
