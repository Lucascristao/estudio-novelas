import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createProject, importProject, projectStats, createProductionService, assembleShotImagePrompt, assembleVideoPrompt } from './projeto/index.js';
import { createNarrativeService, renderScriptText, scriptSynchronization } from './roteiro/index.js';
import { criarPlanoExportacao, criarDownloadFlow, criarDownloadNavegador, baixarExportacao } from './exportacao/index.js';
import { createProjectStorage } from './storage.js';
import RoteiroPanel from './ui/RoteiroPanel.jsx';
import AtivosPanel from './ui/AtivosPanel.jsx';
import StoryboardPanel from './ui/StoryboardPanel.jsx';
import VideosPanel from './ui/VideosPanel.jsx';
import ExportacaoPanel from './ui/ExportacaoPanel.jsx';
import './styles.css';

const steps = ['Roteiro', 'Personagens e cenários', 'Storyboard', 'Vídeos', 'Exportação'];
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40';
const clone = value => JSON.parse(JSON.stringify(value));
const idle = { state: 'idle', total: 0, completed: 0, failed: 0, pending: 0 };

class StudioBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <div role="alert" className="m-6 rounded-2xl border border-rose-400/30 bg-slate-900 p-6 text-slate-100"><h1 className="text-xl font-semibold">Não foi possível mostrar esta tela.</h1><p className="mt-3 text-sm">Seu último projeto salvo continua no navegador. Reabra o estúdio para restaurá-lo.</p><pre className="mt-4 whitespace-pre-wrap text-sm">{this.state.error.message}</pre></div>;
    return this.props.children;
  }
}

export default function App(props) { return <StudioBoundary><Studio {...props} /></StudioBoundary>; }

function Studio({ sdk, runtime = 'flow', canDownloadZip = false }) {
  const [project, setProject] = useState(createProject);
  const current = useRef(project);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [queue, setQueue] = useState(idle);
  const [message, setMessage] = useState(null);
  const [saved, setSaved] = useState('');
  const [cache, setCache] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [copyText, setCopyText] = useState('');
  const [replacement, setReplacement] = useState(null);
  const input = useRef(null);
  const services = useRef(null);
  const storage = useRef(null);
  const alive = useRef(true);
  const notify = (text, type = 'info') => setMessage({ text, type });
  storage.current ??= createProjectStorage();
  const publish = next => {
    const safe = clone(next);
    current.current = safe;
    setProject(safe);
    setSaveEnabled(true);
  };
  const stats = useMemo(() => projectStats(project), [project]);
  const queueLocked = Boolean(queue.active || queue.pending);
  const editingLocked = busy || queueLocked;

  useEffect(() => {
    alive.current = true;
    storage.current.load().then(value => { if (alive.current && value?.project) setCache(value); })
      .catch(() => { if (alive.current) setSaved('Salvamento local indisponível · use Salvar JSON'); });
    return () => { alive.current = false; };
  }, []);
  useEffect(() => {
    if (!saveEnabled) return;
    const timer = setTimeout(() => {
      setSaved('Salvando neste navegador…');
      storage.current.save(project).then(date => { if (alive.current) setSaved(`Salvo neste navegador às ${new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`); })
        .catch(() => { if (alive.current) setSaved('Falha ao salvar neste navegador · baixe o JSON'); });
    }, 600);
    return () => clearTimeout(timer);
  }, [project, saveEnabled]);

  function getServices() {
    if (!sdk) throw new Error('Esta prévia permite importar, editar e exportar. A geração precisa ser executada dentro do Flow.');
    if (!services.current) {
      const production = createProductionService({ sdk, project: current.current, onChange: publish,
        onProgress: event => { if (alive.current) setQueue(event.queue || idle); } });
      // Narrative text also travels through the production queue, so text and media never overlap.
      const narrative = createNarrativeService({ project: current.current,
        sdk: { generate: { text: (...args) => production.generateText(...args) } }, onChange: publish });
      services.current = { production, narrative };
    }
    return services.current;
  }
  function changeProject(next) {
    if (lock.current || queueLocked) return notify('Aguarde a operação ou cancele a fila antes de editar.', 'warning');
    try { publish(importProject(next)); } catch (error) { notify(error.message, 'error'); }
  }
  function openProject(next) {
    const previous = current.current;
    const filled = previous.storyBible.scenes.length || previous.storyBible.characters.length || previous.scriptText.trim();
    if (filled) { setReplacement(next); return; }
    publish(next); setCache(null); setStep(0);
  }
  async function importFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const live = services.current?.production.status;
    if (lock.current || live?.active || live?.pending) return notify('Aguarde a operação ou cancele a fila antes de abrir outro projeto.', 'warning');
    lock.current = true; setBusy(true);
    try {
      const next = importProject(await file.text());
      openProject(next);
      const count = projectStats(next);
      if (!current.current.storyBible.scenes.length || current.current === next) notify(`Arquivo lido: ${count.characters} personagens, ${count.scenes} cenas e ${count.shots} tomadas. As mídias foram preservadas.`);
    } catch (error) { notify(error.message, 'error'); }
    finally { lock.current = false; setBusy(false); }
  }
  function plan(options = {}) {
    const value = current.current;
    return criarPlanoExportacao(value, { incluirSrt: options.incluirSrt,
      montarPromptImagem: shot => assembleShotImagePrompt(shot, value.storyBible.characters, value.storyBible.locations, value.settings).prompt,
      montarPromptVideo: shot => assembleVideoPrompt(shot, value.storyBible.characters, value.storyBible.locations, value.settings) });
  }
  async function exportAction(action, payload = {}) {
    const prepared = plan(payload);
    const baixarArquivo = runtime === 'local' ? criarDownloadNavegador() : criarDownloadFlow(sdk, { suportaZip: canDownloadZip });
    const options = { baixarArquivo, onProgress: setExportProgress };
    if (action === 'exportProject') return baixarExportacao(prepared, { ...options, modo: 'projeto' });
    if (action === 'exportZip' || action === 'exportScene') return baixarExportacao(prepared, { ...options, modo: 'zip', incluirProjeto: false, cenaIndex: payload.cenaIndex });
    let paths = payload.caminhos || (payload.caminho ? [payload.caminho] : []);
    const documents = { roteiro: 'ROTEIRO_COMPLETO.txt', falas: 'FALAS_POR_PERSONAGEM.txt', prompts: 'PROMPTS_GERACAO.txt', srt: 'LEGENDAS.srt', manifesto: 'MANIFESTO.json', biblia: 'STORY_BIBLE.json' };
    if (action === 'exportDocument' && !paths.length) paths = [documents[payload.tipo]].filter(Boolean);
    if (action === 'downloadClip') {
      const tag = `S${String(payload.sceneIndex + 1).padStart(2, '0')}_T${String(payload.shotIndex + 1).padStart(2, '0')}`;
      paths = prepared.manifesto.midias.filter(media => media.mimeType.startsWith('video/') && media.usos.some(use => use.tag === tag)).map(media => media.arquivo);
    }
    if (!paths.length) throw new Error('Este arquivo não está disponível no projeto. Gere ou importe a mídia antes de baixar.');
    const files = prepared.arquivos.filter(file => paths.includes(file.caminho));
    if (files.length !== new Set(paths).size) throw new Error('Um dos arquivos selecionados não foi encontrado. Atualize a seleção.');
    return baixarExportacao({ ...prepared, arquivos: files }, { ...options, modo: 'arquivos', incluirProjeto: false });
  }
  async function action(name, payload = {}) {
    if (name === 'copyPrompt') {
      try { await navigator.clipboard.writeText(payload.prompt); notify('Prompt copiado.'); }
      catch { setCopyText(payload.prompt || ''); }
      return;
    }
    if (['pause', 'resume', 'cancel'].includes(name)) {
      const production = getServices().production;
      if (name === 'pause') return production.pause();
      if (name === 'cancel') return production.cancel();
      return production.resume();
    }
    const isExport = name.startsWith('export') || name === 'downloadClip';
    const live = services.current?.production.status;
    if (lock.current || live?.active || live?.pending) throw new Error('Já existe uma operação em andamento. Aguarde, retome ou cancele a fila.');
    lock.current = true; setBusy(true);
    try {
      if (isExport) return await exportAction(name, payload);
      if (name === 'syncScript') {
        const next = clone(current.current);
        next.scriptText = renderScriptText(next);
        next.scriptSync = scriptSynchronization(next);
        publish(next);
        return next;
      }
      const { production, narrative } = getServices();
      production.setProject(current.current);
      if (['suggestIdeas', 'generateStory', 'convertScript', 'continueEpisode', 'syncScript', 'shortenDialogue'].includes(name)) {
        narrative.setProject(current.current);
        if (name === 'convertScript') return await narrative.convertScript(payload.rawScript, payload);
        if (name === 'syncScript') return narrative.syncScriptText();
        if (name === 'shortenDialogue') return await narrative.shortenDialogue(payload.shotId);
        return await narrative[name](payload);
      }
      if (name === 'prepareReferences') return await production.prepareReferences();
      if (name === 'selectCharacterPhoto') return await production.selectCharacterPhoto(payload.characterId);
      if (name === 'generateCharacter') return await production.generateCharacter(payload.characterId, payload);
      if (name === 'generateLocation') return await production.generateLocation(payload.locationId, payload);
      if (name === 'generateMissingAssets') {
        for (const id of payload.characterIds || []) { if (production.status.cancelled) break; await production.generateCharacter(id); }
        for (const id of payload.locationIds || []) { if (production.status.cancelled) break; await production.generateLocation(id); }
        return;
      }
      if (name === 'reuploadReference') {
        const value = clone(current.current);
        const character = payload.kind === 'character';
        const asset = value.storyBible[character ? 'characters' : 'locations'].find(item => item.id === payload.id);
        if (!asset?.[character ? 'referenceSheetBase64' : 'generatedImageBase64']) throw new Error('Esta referência não contém uma imagem local para reenviar. Escolha uma foto ou gere a referência.');
        if (character) { delete asset.referenceMediaId; delete asset.userUploadedPhotoMediaId; } else delete asset.mediaId;
        production.setProject(value);
        return await production.prepareReferences({ includeFrames: false });
      }
      if (['generateShot', 'selectShotImage', 'generateVideo'].includes(name)) return await production[name](payload.sceneIndex, payload.shotIndex, payload);
      if (name === 'runStoryboard' || name === 'runAnimation') return await production[name](payload);
      throw new Error(`Ação não disponível: ${name}.`);
    } catch (error) { notify(error.message || String(error), 'error'); throw error; }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  }
  const props = { project, busy: editingLocked, onChange: changeProject, onAction: action, notify };
  const queueActive = queue.active || queue.pending || queue.state === 'paused';
  return <div className="min-h-screen bg-[#0b0d12] pb-12 font-sans text-sm text-slate-100">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101218]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400 text-lg font-black text-slate-950" aria-hidden="true">🎬</div><div className="min-w-0"><p className="text-base font-semibold tracking-tight text-white"><span className="text-amber-300">Estúdio de Novelas</span></p><p className="max-w-md truncate text-xs text-slate-400" title={project.title}>{project.title}</p></div></div>
        <div className="flex flex-wrap items-center gap-2"><button className={button} disabled={editingLocked} onClick={() => input.current?.click()}>Abrir JSON</button><button className={`${button} !border-amber-400/30 !bg-amber-400 !text-slate-950 hover:!bg-amber-300`} disabled={editingLocked} onClick={() => action('exportProject').catch(() => {})}>Salvar JSON</button></div>
        <input ref={input} type="file" accept=".json,application/json" className="hidden" aria-label="Abrir projeto JSON" onChange={importFile} />
      </div>
      <nav className="mx-auto flex max-w-[1500px] gap-1 overflow-x-auto px-4 pb-3 sm:px-7" aria-label="Etapas da produção">{steps.map((name, index) => <button key={name} onClick={() => setStep(index)} aria-current={step === index ? 'step' : undefined} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${step === index ? 'bg-amber-400/10 text-amber-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${step === index ? 'bg-amber-400 text-slate-950' : 'border border-white/15'}`}>{index + 1}</span>{name}</button>)}</nav>
    </header>
    <main className="mx-auto max-w-[1500px] space-y-5 px-4 pt-6 sm:px-7">
      <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400"><p>{stats.scenes} cenas · {stats.shots} tomadas · {Math.floor(stats.durationSeconds / 60)}min {String(stats.durationSeconds % 60).padStart(2, '0')}s planejados</p><p role="status">{saved || 'Salve o JSON para levar o projeto a outro navegador'}</p></div>
      {runtime === 'local' && <p className="rounded-xl border border-sky-300/15 bg-sky-300/5 px-4 py-3 text-sm text-sky-100">Prévia local · importe seu JSON para conferir a edição e a exportação. A geração funciona na versão conectada ao Flow.</p>}
      {cache && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4"><p className="text-sm">Há um projeto salvo neste navegador: <strong>{cache.project.title}</strong>.</p><div className="flex gap-2"><button className={button} disabled={editingLocked} onClick={() => openProject(importProject(cache.project))}>Restaurar projeto</button><button className={button} onClick={() => setCache(null)}>Agora não</button></div></div>}
      {message && <div role={message.type === 'error' ? 'alert' : 'status'} className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm leading-6 ${message.type === 'error' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : 'border-white/15 bg-slate-900 text-slate-200'}`}><p className="break-words">{message.text}</p><button className="shrink-0 rounded px-2 text-slate-400 hover:text-white" aria-label="Fechar aviso" onClick={() => setMessage(null)}>×</button></div>}
      {queueActive && <section className="space-y-3 rounded-2xl border border-amber-400/25 bg-slate-900 p-4" aria-label="Fila de produção"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-amber-200">{queue.state === 'paused' ? 'Fila pausada · confira a última tentativa' : queue.state === 'cancelling' ? 'Cancelando após a operação atual' : queue.active?.label || 'Preparando fila'}</p><p className="mt-1 text-sm text-slate-400">{queue.completed} concluídas · {queue.failed} com erro · {queue.pending} aguardando</p></div><div className="flex gap-2">{queue.state === 'paused' ? <button className={button} disabled={Boolean(queue.active)} onClick={() => action('resume').catch(error => notify(error.message, 'error'))}>Retomar pendentes</button> : <button className={button} disabled={queue.state === 'cancelling'} onClick={() => action('pause')}>Pausar</button>}<button className={button} onClick={() => action('cancel')}>Cancelar fila</button></div></div><p className="text-xs leading-5 text-slate-400">Uma chamada por vez. Retomar segue para os itens pendentes; uma geração que falhou só será repetida quando você solicitar.</p></section>}
      {step === 0 && <RoteiroPanel {...props} />}{step === 1 && <AtivosPanel {...props} />}{step === 2 && <StoryboardPanel {...props} busy={{ ...queue, locked: editingLocked }} />}{step === 3 && <VideosPanel {...props} busy={{ ...queue, locked: editingLocked }} />}{step === 4 && <ExportacaoPanel {...props} exportProgress={exportProgress} canDownloadZip={runtime === 'local' || canDownloadZip} />}
    </main>
    {copyText && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5"><section role="dialog" aria-modal="true" aria-label="Copiar prompt" className="w-full max-w-3xl space-y-4 rounded-2xl border border-white/15 bg-slate-900 p-5"><h2 className="text-xl font-semibold">Copie o prompt</h2><textarea className="h-80 w-full rounded-xl border border-white/15 bg-slate-950 p-4 text-sm leading-6" value={copyText} readOnly onFocus={event => event.target.select()} autoFocus /><button className={button} onClick={() => setCopyText('')}>Fechar</button></section></div>}
    {replacement && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5"><section role="dialog" aria-modal="true" aria-labelledby="replace-project-title" className="w-full max-w-lg space-y-4 rounded-2xl border border-white/15 bg-slate-900 p-6"><h2 id="replace-project-title" className="text-xl font-semibold">Abrir outro projeto?</h2><p className="text-sm leading-6 text-slate-300">O projeto atual será substituído por “{replacement.title}”. Salve o JSON atual antes de trocar se quiser guardar esta versão.</p><div className="flex flex-wrap justify-end gap-2"><button className={button} autoFocus onClick={() => setReplacement(null)}>Voltar</button><button className={button} disabled={editingLocked} onClick={() => { if (lock.current || services.current?.production.status.pending || services.current?.production.status.active) return; publish(replacement); setReplacement(null); setCache(null); setStep(0); }}>Trocar projeto</button></div></section></div>}
  </div>;
}
