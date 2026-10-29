import React, { useEffect, useMemo, useRef, useState } from 'react';
import { criarPlanoExportacao, listarPacotesPorCena } from '../exportacao/index.js';

const list = value => Array.isArray(value) ? value : [];
const pad = value => String(value).padStart(2, '0');
const buttonBase = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40';
const buttonPrimary = `${buttonBase} bg-amber-400 text-slate-950 hover:bg-amber-300`;
const buttonSecondary = `${buttonBase} border border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-400 hover:bg-slate-700`;
const buttonQuiet = `${buttonBase} border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800`;
const selectClass = 'min-h-11 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:opacity-40';

function Icon({ name = 'download', className = 'h-5 w-5' }) {
  const paths = {
    download: <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M4 15v5h16v-5" /></>,
    document: <><path d="M14 3H5v18h14V8z" /><path d="M14 3v5h5M8 12h8M8 16h6" /></>,
    package: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 4-7 5 7" /></>,
    spinner: <path d="M21 12a9 9 0 1 1-9-9" />,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.download}</svg>;
}

function bytesLabel(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

function durationLabel(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  return total >= 60 ? `${Math.floor(total / 60)}min ${pad(total % 60)}s` : `${total}s`;
}

function StatusPill({ ready, children }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm ${ready ? 'bg-emerald-400/10 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>
    {ready && <Icon name="check" className="h-4 w-4" />}{children}
  </span>;
}

function DownloadResult({ report }) {
  if (!report) return null;
  const requested = list(report.solicitados).length;
  const failures = list(report.falhas);
  const messages = {
    solicitado: ['Solicitação enviada', `${requested} ${requested === 1 ? 'arquivo enviado' : 'arquivos enviados'} ao mecanismo de download. Confira a pasta de downloads.`, 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'],
    parcial: ['Exportação parcial', `${requested} solicitações enviadas; ${failures.length} ${failures.length === 1 ? 'arquivo precisa' : 'arquivos precisam'} de nova tentativa.`, 'border-amber-500/40 bg-amber-500/10 text-amber-100'],
    falhou: ['Não foi possível enviar os arquivos', 'Veja o motivo abaixo. Você pode escolher uma cena ou um arquivo individual.', 'border-rose-500/40 bg-rose-500/10 text-rose-100'],
    indisponivel: ['Esta opção não está disponível', 'Escolha o projeto JSON ou um dos arquivos individuais.', 'border-amber-500/40 bg-amber-500/10 text-amber-100'],
    cancelado: ['Exportação interrompida', `${requested} solicitações já tinham sido enviadas. Os arquivos restantes não foram enviados.`, 'border-slate-600 bg-slate-800 text-slate-100'],
  };
  const [title, description, colors] = messages[report.status] || ['Solicitação encaminhada', 'Aguarde a confirmação do aplicativo para esta operação.', 'border-slate-600 bg-slate-800 text-slate-100'];
  return <div className={`rounded-2xl border p-4 ${colors}`} role="status" aria-live="polite">
    <p className="text-base font-semibold">{title}</p>
    <p className="mt-1 text-sm leading-relaxed">{description}</p>
    {failures.length > 0 && <details className="mt-3 text-sm">
      <summary className="cursor-pointer rounded py-1 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current">Ver {failures.length === 1 ? 'o motivo' : `${failures.length} motivos`}</summary>
      <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto break-words">
        {failures.map((failure, i) => <li key={`${failure.filename || 'erro'}-${i}`}><span className="font-semibold">{failure.filename ? `${failure.filename}: ` : ''}</span>{failure.mensagem || 'O transporte recusou a solicitação.'}</li>)}
      </ul>
    </details>}
  </div>;
}

/** A exportação não altera o projeto; opções e filtros permanecem locais ao painel. */
export default function ExportacaoPanel({ project, busy = false, onAction, notify, exportProgress, canDownloadZip = false }) {
  const [incluirSrt, setIncluirSrt] = useState(false);
  const [sceneSelection, setSceneSelection] = useState('');
  const [group, setGroup] = useState('videos');
  const [tab, setTab] = useState('clipes');
  const [characterFile, setCharacterFile] = useState('');
  const [report, setReport] = useState(null);
  const [activeAction, setActiveAction] = useState('');
  const running = useRef(false);
  const disabled = Boolean(busy || activeAction);

  useEffect(() => {
    setReport(null);
    setSceneSelection('');
    setCharacterFile('');
  }, [project]);

  const prepared = useMemo(() => {
    try { return { plan: criarPlanoExportacao(project, { incluirSrt }), error: null }; }
    catch (error) { return { plan: null, error: error.message }; }
  }, [project, incluirSrt]);
  const plan = prepared.plan;
  const summary = plan?.manifesto.resumo;
  const files = plan?.arquivos || [];
  const pending = plan?.manifesto.pendencias || [];
  const scenePackages = plan ? listarPacotesPorCena(plan) : [];
  const safeBible = plan?.manifesto.projeto.storyBible;
  const fileMap = useMemo(() => new Map(files.map(file => [file.caminho, file])), [files]);
  const clips = list(safeBible?.scenes).flatMap((scene, sceneIndex) => list(scene.shots).map((shot, shotIndex) => ({ scene, shot, sceneIndex, shotIndex, tag: `S${pad(sceneIndex + 1)}_T${pad(shotIndex + 1)}` })));
  const references = list(safeBible?.characters).filter(character => character.referenceSheetBase64?.arquivo || character.userUploadedPhotoBase64?.arquivo).length + list(safeBible?.locations).filter(location => location.generatedImageBase64?.arquivo).length;
  const referenceTotal = list(safeBible?.characters).length + list(safeBible?.locations).length;
  const characterDocuments = files.filter(file => file.caminho.startsWith('Falas/'));
  const speakers = [...new Set(clips.filter(({ shot }) => String(shot.dialogueLine || '').trim()).map(({ shot }) => shot.speakerName || list(safeBible?.characters).find(character => character.id === shot.speakerCharacterId)?.name || 'Narrador ou voz off'))];
  const visibleFiles = files.filter(file => {
    if (group === 'videos') return file.mimeType.startsWith('video/');
    if (group === 'quadros') return file.categoria === 'midia' && file.cenaIndices.length > 0 && file.mimeType.startsWith('image/');
    if (group === 'referencias') return file.categoria === 'midia' && file.compartilhado;
    if (group === 'documentos') return file.categoria === 'documento';
    return true;
  });
  const selectedScene = scenePackages.find(scene => String(scene.cenaIndex) === sceneSelection);
  const selectedCharacter = characterDocuments.find(file => file.caminho === characterFile);
  const progressDone = Math.max(0, Number(exportProgress?.feitos ?? exportProgress?.done ?? 0));
  const progressTotal = Math.max(0, Number(exportProgress?.total || 0));
  const percentage = progressTotal ? Math.min(100, Math.round(progressDone / progressTotal * 100)) : 0;

  async function execute(action, payload = {}) {
    if (disabled || running.current) return;
    if (typeof onAction !== 'function') {
      notify?.('O mecanismo de exportação ainda não está conectado.', 'error');
      return;
    }
    running.current = true;
    setActiveAction(action);
    setReport(null);
    try {
      const result = await onAction(action, { ...payload, incluirSrt });
      const nextReport = result || { status: 'encaminhado', solicitados: [], falhas: [] };
      setReport(nextReport);
      if (nextReport.status === 'parcial') notify?.('Alguns arquivos precisam de nova tentativa. Veja os detalhes da exportação.', 'warning');
      else if (nextReport.status === 'falhou' || nextReport.status === 'indisponivel') notify?.('A exportação precisa de atenção. Veja os detalhes.', 'error');
    } catch (error) {
      const message = error?.message || String(error);
      setReport({ status: 'falhou', solicitados: [], falhas: [{ filename: payload.caminho || null, mensagem: message }] });
      notify?.(message, 'error');
    } finally {
      running.current = false;
      setActiveAction('');
    }
  }

  function documentButton(tipo, caminho) {
    return <button type="button" className={buttonQuiet} disabled={disabled || !plan} onClick={() => execute('exportDocument', { tipo, caminho })}><Icon />Solicitar arquivo</button>;
  }

  const manifestPreview = plan ? {
    formato: plan.manifesto.formato,
    versao: plan.manifesto.versao,
    titulo: project?.title || safeBible?.title || '',
    resumo: summary,
    midias: plan.manifesto.midias.map(media => ({ arquivo: media.arquivo, mimeType: media.mimeType, tamanhoBytes: media.tamanhoBytes, usos: media.usos.map(use => ({ caminhoNoProjeto: use.jsonPointer, tomada: use.tag })) })),
  } : null;

  return <div className="mx-auto max-w-7xl space-y-6 text-base text-slate-100">
    <header className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-7 lg:flex-row lg:items-center">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Entrega da produção</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Seu projeto, pronto para continuar.</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">Salve o projeto completo para reabrir depois. Leve os clipes, quadros e documentos em arquivos organizados para a edição.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
          <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1">{summary?.cenas || 0} cenas · {summary?.tomadas || 0} tomadas</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1"><Icon name="clock" className="h-4 w-4" />{durationLabel(summary?.duracaoPlanejadaSegundos)} planejados</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2 lg:max-w-64">
        <button type="button" className={buttonPrimary} disabled={disabled || !project} onClick={() => execute('exportProject')}><Icon name="document" />Solicitar projeto JSON</button>
        <p className="text-sm leading-relaxed text-slate-400">Inclui as mídias e todos os dados para continuar o trabalho.</p>
      </div>
    </header>

    {prepared.error && <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-base text-amber-100" role="alert">{prepared.error}</div>}

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Disponibilidade dos arquivos">
      {[
        ['Quadros disponíveis', `${summary?.imagens || 0} / ${summary?.tomadas || 0}`, `${Math.max(0, (summary?.tomadas || 0) - (summary?.imagens || 0))} pendentes`, 'image'],
        ['Vídeos disponíveis', `${summary?.videos || 0} / ${summary?.tomadas || 0}`, `${Math.max(0, (summary?.tomadas || 0) - (summary?.videos || 0))} pendentes`, 'play'],
        ['Referências no pacote', `${references} / ${referenceTotal}`, `${Math.max(0, referenceTotal - references)} pendentes`, 'document'],
        ['Mídias únicas', summary?.midiasUnicas || 0, `${summary?.usosDeMidia || 0} usos registrados`, 'package'],
      ].map(([label, value, detail, icon]) => <div key={label} className="rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2"><p className="text-sm font-medium leading-relaxed text-slate-300">{label}</p><Icon name={icon} className="h-5 w-5 shrink-0 text-slate-500" /></div>
        <p className="mt-3 text-2xl font-bold tabular-nums text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{detail}</p>
      </div>)}
    </section>

    {(disabled || progressTotal > 0) && (activeAction || exportProgress) && <div className="rounded-2xl border border-amber-400/30 bg-slate-900 p-4" role="status" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="inline-flex items-center gap-2 font-semibold text-amber-200"><Icon name={disabled ? 'spinner' : 'check'} className={`h-5 w-5 ${disabled ? 'animate-spin' : ''}`} />{disabled ? 'Preparando e enviando os arquivos…' : 'Solicitações processadas'}</span>{progressTotal > 0 && <span className="tabular-nums text-slate-300">{Math.min(progressDone, progressTotal)} de {progressTotal}</span>}</div>
      {progressTotal > 0 && <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label="Progresso da exportação" aria-valuemin={0} aria-valuemax={progressTotal} aria-valuenow={Math.min(progressDone, progressTotal)}><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${percentage}%` }} /></div>}
      {exportProgress?.filename && <p className="mt-2 break-all text-sm text-slate-400">{exportProgress.filename}</p>}
    </div>}
    <DownloadResult report={report} />

    <div className="grid gap-6 xl:grid-cols-5">
      <section className="space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 xl:col-span-3" aria-labelledby="package-title">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-amber-400/10 p-2.5 text-amber-300"><Icon name="package" className="h-6 w-6" /></span><div><h2 id="package-title" className="text-xl font-semibold">Pacote de produção</h2><p className="mt-1 text-sm leading-relaxed text-slate-400">Pastas por cena, mídias únicas, roteiro, falas, prompts e pendências.</p></div></div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <input type="checkbox" checked={incluirSrt} onChange={event => setIncluirSrt(event.target.checked)} disabled={disabled} className="mt-1 h-5 w-5 shrink-0 accent-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300" />
          <span><span className="block text-base font-medium">Incluir legendas SRT</span><span className="mt-1 block text-sm leading-relaxed text-slate-400">Opcional, desligado por padrão. Os tempos seguem as durações planejadas das tomadas.</span></span>
        </label>
        <button type="button" className={`${buttonPrimary} w-full`} disabled={disabled || !plan || !canDownloadZip} onClick={() => execute('exportZip')}><Icon name="package" />Solicitar ZIP completo</button>
        <div className="space-y-2">
          <label htmlFor="export-scene" className="block text-sm font-semibold text-slate-300">Ou escolha uma cena</label>
          <div className="flex flex-col gap-2 sm:flex-row"><select id="export-scene" value={sceneSelection} onChange={event => setSceneSelection(event.target.value)} disabled={disabled || !plan} className={selectClass}><option value="">Selecione a cena</option>{scenePackages.map(scene => <option key={scene.cenaIndex} value={scene.cenaIndex}>S{pad(scene.cenaIndex + 1)} · {scene.titulo}</option>)}</select><button type="button" className={`${buttonSecondary} shrink-0`} disabled={disabled || !selectedScene || !canDownloadZip} onClick={() => execute('exportScene', { cenaIndex: selectedScene.cenaIndex })}><Icon />ZIP da cena</button></div>
        </div>
        {!canDownloadZip && <div className="rounded-xl border border-slate-600 bg-slate-800/70 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100"><Icon name="info" />ZIP ainda não confirmado neste ambiente</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">Você pode solicitar o projeto JSON ou escolher arquivos individuais. Um grupo só será enviado quando você clicar no botão com a quantidade.</p>
          <button type="button" className={`${buttonSecondary} mt-3`} onClick={() => { setTab('arquivos'); setGroup('todos'); }}>Escolher arquivos</button>
        </div>}
        <p className="text-sm leading-relaxed text-slate-400">O JSON completo é um arquivo separado. O manifesto do pacote aponta para cada mídia, sem repetir seu conteúdo.</p>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 xl:col-span-2" aria-labelledby="documents-title">
        <h2 id="documents-title" className="text-xl font-semibold">Documentos da produção</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">Solicite só o que precisa nesta etapa.</p>
        <div className="mt-4 divide-y divide-slate-700">
          {[
            ['Roteiro completo', 'Texto da história e direção.', 'roteiro', 'ROTEIRO_COMPLETO.txt'],
            ['Falas por personagem', 'Todas as falas agrupadas.', 'falas', 'FALAS_POR_PERSONAGEM.txt'],
            ['Prompts de geração', 'Prompts registrados ou reconstruídos.', 'prompts', 'PROMPTS_GERACAO.txt'],
          ].map(([label, detail, type, path]) => <div key={type} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><h3 className="text-base font-medium">{label}</h3><p className="mt-1 text-sm text-slate-400">{detail}</p></div>{documentButton(type, path)}</div>)}
          <div className="space-y-3 py-4"><label htmlFor="export-character" className="block text-base font-medium">Falas de um personagem</label><div className="flex flex-col gap-2 sm:flex-row"><select id="export-character" value={selectedCharacter ? characterFile : ''} onChange={event => setCharacterFile(event.target.value)} disabled={disabled || !characterDocuments.length} className={selectClass}><option value="">Selecione o personagem</option>{characterDocuments.map((file, i) => <option key={file.caminho} value={file.caminho}>{speakers[i] || file.caminho.split('/').at(-1)}</option>)}</select><button type="button" className={`${buttonQuiet} shrink-0`} disabled={disabled || !selectedCharacter} onClick={() => execute('exportDocument', { tipo: 'personagem', caminho: selectedCharacter.caminho, personagem: speakers[characterDocuments.indexOf(selectedCharacter)] })}><Icon />Solicitar</button></div></div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><h3 className="text-base font-medium">Legendas SRT</h3><p className="mt-1 text-sm text-slate-400">{incluirSrt ? 'Ativadas para esta exportação.' : 'Ative a opção no pacote para incluir.'}</p></div><button type="button" className={buttonQuiet} disabled={disabled || !plan || !incluirSrt} onClick={() => execute('exportDocument', { tipo: 'srt', caminho: 'LEGENDAS.srt' })}><Icon />Solicitar SRT</button></div>
        </div>
      </section>
    </div>

    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900" aria-label="Conteúdo da exportação">
      <div className="flex flex-wrap gap-2 border-b border-slate-700 bg-slate-950/50 p-3" role="group" aria-label="Escolha a visualização">
        {[
          ['clipes', 'Clipes na ordem', clips.length], ['arquivos', 'Arquivos do pacote', files.length],
          ['pendencias', 'Pendências', pending.length], ['manifesto', 'Prévia do manifesto', null],
        ].map(([key, label, count]) => <button key={key} type="button" onClick={() => setTab(key)} aria-pressed={tab === key} className={`${buttonBase} ${tab === key ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{label}{count !== null && <span className="rounded-md bg-slate-950/50 px-2 py-0.5 tabular-nums">{count}</span>}</button>)}
      </div>

      {tab === 'clipes' && <div>
        <div className="border-b border-slate-700 p-5"><h2 className="text-lg font-semibold">Clipes na ordem do storyboard</h2><p className="mt-1 text-sm leading-relaxed text-slate-400">A numeração acompanha a sequência atual. Cada botão solicita somente aquele arquivo.</p></div>
        {clips.length ? <div className="max-h-[36rem] divide-y divide-slate-800 overflow-y-auto">{clips.map(({ scene, shot, sceneIndex, shotIndex, tag }) => {
          const imagePath = shot.generatedImageBase64?.arquivo;
          const videoPath = shot.generatedVideoBase64?.arquivo;
          const image = fileMap.get(imagePath);
          const video = fileMap.get(videoPath);
          return <article key={`${sceneIndex}-${shotIndex}-${shot.shotId || ''}`} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-sm font-semibold text-amber-200">{tag}</span><span className="text-sm text-slate-400">{durationLabel(shot.durationSeconds)} · {scene.title || `Cena ${sceneIndex + 1}`}</span>{video && shot.isApproved && <StatusPill ready>Aprovado</StatusPill>}</div><p className="mt-2 line-clamp-2 text-base leading-relaxed text-slate-200">{shot.dialogueLine ? `${shot.speakerName ? `${shot.speakerName}: ` : ''}“${shot.dialogueLine}”` : shot.visualAction || 'Sem direção registrada.'}</p></div>
            <div className="flex flex-wrap items-center gap-2">
              {image ? <button type="button" className={buttonQuiet} disabled={disabled} onClick={() => execute('exportFile', { caminho: imagePath })} title={imagePath}><Icon name="image" />Quadro <span className="font-normal text-slate-400">{bytesLabel(image.bytes.length)}</span></button> : <StatusPill>Quadro pendente</StatusPill>}
              {video ? <button type="button" className={buttonSecondary} disabled={disabled} onClick={() => execute('exportFile', { caminho: videoPath })} title={videoPath}><Icon name="play" />Vídeo <span className="font-normal text-slate-400">{bytesLabel(video.bytes.length)}</span></button> : <StatusPill>Vídeo pendente</StatusPill>}
            </div>
          </article>;
        })}</div> : <p className="p-6 text-base text-slate-400">As tomadas aparecerão aqui quando o storyboard estiver preenchido.</p>}
      </div>}

      {tab === 'arquivos' && <div className="space-y-4 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h2 className="text-lg font-semibold">Escolha os arquivos</h2><p className="mt-1 text-sm text-slate-400">Pastas e nomes que compõem o pacote de produção.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="export-file-group">Grupo de arquivos</label><select id="export-file-group" value={group} onChange={event => setGroup(event.target.value)} className={selectClass}>{[['videos', 'Vídeos'], ['quadros', 'Quadros das tomadas'], ['referencias', 'Referências'], ['documentos', 'Documentos'], ['todos', 'Todos os arquivos']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="button" className={`${buttonSecondary} shrink-0`} disabled={disabled || !visibleFiles.length} onClick={() => execute('exportFiles', { grupo: group, caminhos: visibleFiles.map(file => file.caminho) })}><Icon />Solicitar {visibleFiles.length} {visibleFiles.length === 1 ? 'arquivo' : 'arquivos'}</button></div></div>
        {visibleFiles.length ? <ul className="max-h-[32rem] divide-y divide-slate-800 overflow-y-auto rounded-xl border border-slate-700 bg-slate-950/40">{visibleFiles.map(file => <li key={file.caminho} className="flex flex-wrap items-center justify-between gap-3 p-4"><div className="min-w-0 flex-1"><p className="break-all font-mono text-sm leading-relaxed text-slate-200">{file.caminho}</p><p className="mt-1 text-sm text-slate-400">{bytesLabel(file.bytes.length)} · {file.categoria === 'midia' ? 'Mídia' : 'Documento'}</p></div><button type="button" className={buttonQuiet} disabled={disabled} onClick={() => execute('exportFile', { caminho: file.caminho })} aria-label={`Solicitar ${file.caminho}`}><Icon />Solicitar</button></li>)}</ul> : <div className="rounded-xl border border-dashed border-slate-700 p-6 text-base text-slate-400">Nenhum arquivo disponível neste grupo.</div>}
      </div>}

      {tab === 'pendencias' && <div className="space-y-4 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">O que ainda falta</h2><p className="mt-1 text-sm text-slate-400">Você pode exportar o material disponível mesmo com pendências.</p></div>{documentButton('pendencias', 'PENDENCIAS.json')}</div>{pending.length ? <ul className="max-h-[32rem] divide-y divide-slate-800 overflow-y-auto rounded-xl border border-slate-700">{pending.map((item, i) => <li key={`${item.tipo}-${i}`} className="flex gap-3 p-4 text-sm leading-relaxed"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" /><span>{item.tag && !item.mensagem?.startsWith(item.tag) && <span className="mr-2 font-mono font-semibold text-amber-200">{item.tag}</span>}{item.mensagem}</span></li>)}</ul> : <p className="rounded-xl bg-emerald-400/10 p-4 text-base text-emerald-200">Nenhuma pendência registrada no pacote atual.</p>}</div>}

      {tab === 'manifesto' && <div className="space-y-4 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Prévia do manifesto</h2><p className="mt-1 text-sm leading-relaxed text-slate-400">Resumo e caminhos dos arquivos. A versão completa inclui os dados do projeto e as referências de cada mídia.</p></div>{documentButton('manifesto', 'MANIFESTO.json')}</div><pre className="max-h-[32rem] overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-300">{manifestPreview ? JSON.stringify(manifestPreview, null, 2) : 'Abra um projeto para visualizar o manifesto.'}</pre></div>}
    </section>
  </div>;
}
