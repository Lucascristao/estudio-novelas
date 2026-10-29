import React, { useId, useMemo, useState } from 'react';
import { VIDEO_MODELS_CAPABILITIES } from '../projeto/index.js';
import { countWords, dialogueLimit, scriptSynchronization } from '../roteiro/index.js';

/*
 * Props: { project, busy, onChange(nextProject), onAction(action, payload), notify(message, tipo) }.
 * Text actions expected from the host (the host publishes any changed project):
 * suggestIdeas { theme, settings, count } -> Idea[] or { ideas: Idea[] };
 * generateStory { idea, theme, settings, replace }; convertScript { rawScript, settings, replace };
 * continueEpisode { directive, finalEpisode }; syncScript {}.
 * Only suggestIdeas results are displayed locally. There is no SDK, media generation or fake output here.
 */

const GENRES = [
  ['Drama Familiar', ['herança', 'segredo de família', 'perdão tardio']],
  ['Drama Psicológico', ['culpa', 'dilema moral', 'obsessão']],
  ['Melodrama / Novela', ['humilhação', 'injustiça', 'reviravolta', 'triunfo moral']],
  ['Drama Policial & Investigativo', ['falso culpado', 'testemunha', 'corrupção']],
  ['Drama de Época / Histórico', ['casamento arranjado', 'tradição', 'diferença de classes']],
  ['Drama Social & Superação', ['dignidade', 'segunda chance', 'comunidade']],
  ['Tragédia e Consequência', ['ambição', 'ponto sem retorno', 'orgulho']],
  ['Romance Dramático', ['amor proibido', 'reencontro', 'sacrifício']],
];
const STRUCTURES = ['Parábola de contraste', 'Ascensão e queda', 'Vingança e virada', 'Segredo revelado', 'Injustiça e recompensa', 'Mistério', 'Romance proibido', 'Superação', 'Personalizada'];
const STYLES = ['Cinematográfico Ultra-Realista', 'Anime Contemporâneo', 'Cyberpunk Neon', 'Fantasia Sombria', 'Aquarela Expressiva', 'Vintage 35mm Retrô', 'Animação 3D Pixar Style', 'Ficção Científica Hiper-detalhada'];
const inputClass = 'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm font-normal leading-6 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50';
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40';
const primaryClass = `${buttonClass} border-amber-400 bg-amber-400 text-zinc-950 hover:border-amber-300 hover:bg-amber-300`;
const labelClass = 'mb-1.5 block text-xs font-medium leading-5 text-zinc-300';

function Field({ label, id, hint, children, className = '' }) {
  return <div className={className}><label htmlFor={id} className={labelClass}>{label}</label>{children}{hint && <p className="mt-1.5 text-xs leading-5 text-zinc-400">{hint}</p>}</div>;
}

function currentOption(value, values) {
  return value && !values.includes(value) ? <option value={value}>{value} (importado)</option> : null;
}

function dialogKeys(event, close) {
  if (event.key === 'Escape') { event.preventDefault(); close(); return; }
  if (event.key !== 'Tab') return;
  const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
  const first = buttons[0], last = buttons[buttons.length - 1], active = event.currentTarget.ownerDocument.activeElement;
  if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
}

export default function RoteiroPanel({ project, busy = false, onChange, onAction, notify = () => {} }) {
  const prefix = useId();
  const [mode, setMode] = useState('ai');
  const [keyword, setKeyword] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [pending, setPending] = useState(null);
  const [replacement, setReplacement] = useState(null);
  const [directive, setDirective] = useState('');
  const [finalPart, setFinalPart] = useState(null);
  const settings = project.settings || {};
  const bible = project.storyBible || { characters: [], locations: [], scenes: [] };
  const locked = Boolean(busy || pending);
  const shotCount = (bible.scenes || []).reduce((total, scene) => total + (scene.shots?.length || 0), 0);
  const actualSeconds = (bible.scenes || []).reduce((total, scene) => total + (scene.shots || []).reduce((sum, shot) => sum + (Number(shot.durationSeconds) || 0), 0), 0);
  const capabilities = VIDEO_MODELS_CAPABILITIES[settings.defaultVideoModel] || VIDEO_MODELS_CAPABILITIES['Omni 1.1 Flash'];
  const keywords = Array.isArray(settings.keywords) ? settings.keywords.map(word => String(word)) : [];
  const genreSuggestions = GENRES.find(([name]) => name === settings.selectedDramaGenre)?.[1] || [];
  const importedSeconds = Number(settings.secondsPerShot);
  const wordLimit = dialogueLimit(Number.isFinite(importedSeconds) && importedSeconds > 0 ? importedSeconds : 6);
  const sync = useMemo(() => {
    try { return scriptSynchronization(project); } catch { return { status: 'stale' }; }
  }, [project]);
  const fieldId = name => `${prefix}-${name}`;
  const publish = next => {
    let scriptSync;
    try { scriptSync = scriptSynchronization(next); } catch { scriptSync = { status: 'stale', source: 'storyboard' }; }
    onChange({ ...next, scriptSync });
  };
  const updateSettings = patch => publish({ ...project, settings: { ...settings, ...patch } });
  const updateBible = patch => publish({ ...project, storyBible: { ...bible, ...patch } });
  const addKeywords = values => {
    const existing = new Set(keywords.map(word => word.trim().toLocaleLowerCase('pt-BR')));
    const additions = values.map(word => word.trim()).filter(word => {
      const key = word.toLocaleLowerCase('pt-BR');
      if (!key || existing.has(key)) return false;
      existing.add(key); return true;
    });
    if (additions.length) updateSettings({ keywords: [...keywords, ...additions] });
    setKeyword('');
  };
  const changeDefaultModel = model => {
    const cap = VIDEO_MODELS_CAPABILITIES[model];
    if (!cap) return;
    updateSettings({ defaultVideoModel: model,
      secondsPerShot: cap.supportedDurations.includes(settings.secondsPerShot) ? settings.secondsPerShot : cap.supportedDurations[0],
      defaultResolution: cap.supportedResolutions.includes(settings.defaultResolution) ? settings.defaultResolution : cap.supportedResolutions[0] });
  };
  const run = async (action, payload = {}) => {
    if (locked) return;
    if (typeof onAction !== 'function') { notify('Esta ação ainda não está conectada ao Flow.', 'error'); return; }
    setPending(action);
    try {
      const result = await onAction(action, payload);
      if (action === 'suggestIdeas') {
        const list = Array.isArray(result) ? result : result?.ideas;
        if (!Array.isArray(list) || !list.length || list.some(idea => !['title', 'premise', 'hook'].every(key => typeof idea?.[key] === 'string' && idea[key].trim()))) {
          notify('A resposta não trouxe ideias completas. Seu roteiro continua preservado.', 'error');
          return;
        }
        setIdeas(list); setSelectedIdea(null);
      }
      return result;
    } catch (error) { notify(error?.message || 'Não foi possível concluir. Seu trabalho foi preservado.', 'error'); }
    finally { setPending(null); }
  };
  const requestWriting = (action, payload) => {
    const hasWork = shotCount > 0 || (bible.characters?.length || 0) > 0 || (action === 'generateStory' && Boolean(project.scriptText?.trim()));
    if (hasWork) setReplacement({ action, payload });
    else run(action, payload);
  };
  const generate = idea => {
    const hasOutline = bible.logline || bible.hook || bible.centralConflict || bible.ending?.description;
    const direction = idea || (hasOutline ? { id: 'manual-outline', title: project.title || '',
      premise: bible.logline || settings.nicheTheme || '', hook: bible.hook || '',
      structure: bible.narrativeStructure || settings.narrativeStructure, storyRealism: settings.storyRealism || bible.storyRealism,
      centralConflict: bible.centralConflict || '', ending: bible.ending || {} } : null);
    requestWriting('generateStory', { idea: direction, theme: settings.nicheTheme || '', settings });
  };

  return <section aria-labelledby={fieldId('heading')} aria-busy={locked} className="space-y-6 text-sm font-normal text-zinc-100">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-widest text-amber-300">Etapa 1 · História</p><h2 id={fieldId('heading')} className="mt-1 text-2xl font-semibold tracking-tight">Uma história pronta para virar cena</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Crie com uma ideia ou traga seu texto. Revise a história antes de preparar personagens e cenários.</p></div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-right text-sm leading-6"><span className="block font-medium">{shotCount} tomadas · {actualSeconds ? `${Math.floor(actualSeconds / 60)}min ${actualSeconds % 60}s` : 'ainda sem storyboard'}</span><span className="text-xs text-zinc-400">Parte {settings.currentEpisode || 1} · {bible.characters?.length || 0} personagens</span></div>
    </header>

    <div aria-label="Origem do roteiro" role="group" className="inline-flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5">
      {[['ai', 'Criar com IA'], ['custom', 'Meu roteiro']].map(([value, label]) => <button key={value} type="button" disabled={locked} aria-pressed={mode === value} onClick={() => setMode(value)} className={`${buttonClass} ${mode === value ? 'border-amber-400 bg-amber-400 text-zinc-950 hover:bg-amber-300' : 'border-transparent bg-transparent'}`}>{label}</button>)}
    </div>

    <fieldset disabled={locked} className="grid min-w-0 gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-2">
      <legend className="px-2 text-base font-semibold">Direção da história</legend>
      <Field label="Título da produção" id={fieldId('title')}><input id={fieldId('title')} className={inputClass} value={project.title || ''} onChange={event => publish({ ...project, title: event.target.value, storyBible: { ...bible, title: event.target.value } })} placeholder="Dê um nome à sua novela" /></Field>
      <Field label="Natureza da história" id={fieldId('realism')}><select id={fieldId('realism')} className={inputClass} value={settings.storyRealism || bible.storyRealism || 'ficticia'} onChange={event => publish({ ...project, settings: { ...settings, storyRealism: event.target.value }, storyBible: { ...bible, storyRealism: event.target.value } })}><option value="ficticia">Fictícia · criação autoral</option><option value="real">Baseada em fatos reais</option></select></Field>
      <Field label="Tema ou premissa para a IA" id={fieldId('theme')} className="md:col-span-2"><textarea id={fieldId('theme')} rows={2} className={inputClass} value={settings.nicheTheme || ''} onChange={event => updateSettings({ nicheTheme: event.target.value })} placeholder="Uma funcionária injustiçada encontra a prova que pode mudar tudo..." /></Field>
      <Field label="Tipo de drama" id={fieldId('genre')} hint="Trocar o gênero mantém suas palavras-chave."><select id={fieldId('genre')} className={inputClass} value={settings.selectedDramaGenre || 'Melodrama / Novela'} onChange={event => updateSettings({ selectedDramaGenre: event.target.value })}>{currentOption(settings.selectedDramaGenre, GENRES.map(([name]) => name))}{GENRES.map(([name]) => <option key={name}>{name}</option>)}</select></Field>
      <Field label="Estrutura narrativa" id={fieldId('structure')}><select id={fieldId('structure')} className={inputClass} value={settings.narrativeStructure || 'Vingança e virada'} onChange={event => publish({ ...project, settings: { ...settings, narrativeStructure: event.target.value }, storyBible: { ...bible, narrativeStructure: event.target.value } })}>{currentOption(settings.narrativeStructure, STRUCTURES)}{STRUCTURES.map(value => <option key={value}>{value}</option>)}</select></Field>
      <div className="md:col-span-2"><label htmlFor={fieldId('keyword')} className={labelClass}>Palavras-chave da trama</label>
        <div className="mb-3 flex flex-wrap gap-2">{keywords.length ? keywords.map((word, index) => <span key={`${word}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 py-1 pl-3 pr-1 text-sm text-amber-100">{word}<button type="button" aria-label={`Remover palavra-chave ${word}`} onClick={() => updateSettings({ keywords: keywords.filter((_, position) => position !== index) })} className="flex h-8 w-8 items-center justify-center rounded-full text-lg hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">×</button></span>) : <p className="text-sm text-zinc-400">Adicione os assuntos que não podem faltar.</p>}</div>
        <div className="flex gap-2"><input id={fieldId('keyword')} className={inputClass} value={keyword} onChange={event => setKeyword(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addKeywords([keyword]); } }} placeholder="Ex.: dignidade, carta escondida" /><button type="button" className={buttonClass} disabled={!keyword.trim()} onClick={() => addKeywords([keyword])}>Adicionar</button></div>
        <p className="mt-3 text-xs leading-5 text-zinc-400">Sugestões do gênero: {genreSuggestions.filter(word => !keywords.some(current => current.toLocaleLowerCase('pt-BR') === word.toLocaleLowerCase('pt-BR'))).map(word => <button key={word} type="button" onClick={() => addKeywords([word])} className="mr-1 rounded-lg px-2 py-1.5 text-xs text-amber-300 underline decoration-amber-300/30 underline-offset-4 focus-visible:ring-2 focus-visible:ring-amber-400">+ {word}</button>)}</p>
      </div>
    </fieldset>

    <details className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <summary className="cursor-pointer rounded-2xl px-5 py-4 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">Formato e planejamento <span className="ml-2 text-sm font-normal text-zinc-400">{settings.aspectRatio || '9:16'} · {settings.durationMinutes || 3}min · {settings.secondsPerShot || 6}s por tomada</span></summary>
      <fieldset disabled={locked} className="grid min-w-0 gap-4 border-t border-zinc-800 p-5 sm:grid-cols-2 lg:grid-cols-3"><legend className="sr-only">Configurações para novas tomadas</legend>
        <Field label="Formato" id={fieldId('ratio')}><select id={fieldId('ratio')} value={settings.aspectRatio || '9:16'} onChange={event => updateSettings({ aspectRatio: event.target.value })} className={inputClass}>{currentOption(settings.aspectRatio, ['9:16', '16:9'])}<option value="9:16">Vertical · 9:16</option><option value="16:9">Horizontal · 16:9</option></select></Field>
        <Field label="Duração alvo da parte" id={fieldId('duration')}><select id={fieldId('duration')} value={settings.durationMinutes ?? 3} onChange={event => updateSettings({ durationMinutes: Number(event.target.value) })} className={inputClass}>{![2, 3, 4].includes(settings.durationMinutes) && settings.durationMinutes != null && <option value={settings.durationMinutes}>{settings.durationMinutes}min (importado)</option>}{[2, 3, 4].map(minutes => <option key={minutes} value={minutes}>{minutes} minutos</option>)}</select></Field>
        <Field label="Modelo padrão de vídeo" id={fieldId('model')}><select id={fieldId('model')} value={settings.defaultVideoModel || 'Omni 1.1 Flash'} onChange={event => changeDefaultModel(event.target.value)} className={inputClass}>{currentOption(settings.defaultVideoModel, Object.keys(VIDEO_MODELS_CAPABILITIES))}{Object.keys(VIDEO_MODELS_CAPABILITIES).map(model => <option key={model}>{model}</option>)}</select></Field>
        <Field label="Qualidade padrão" id={fieldId('resolution')}><select id={fieldId('resolution')} value={settings.defaultResolution || capabilities.supportedResolutions[0]} onChange={event => updateSettings({ defaultResolution: event.target.value })} className={inputClass}>{currentOption(settings.defaultResolution, capabilities.supportedResolutions)}{capabilities.supportedResolutions.map(resolution => <option key={resolution} value={resolution}>{resolution} · {resolution === '360p' ? 'rascunho' : 'final'}</option>)}</select></Field>
        <Field label="Duração padrão da tomada" id={fieldId('shot-duration')} hint={`Referência de fala: até ${wordLimit} palavras.`}><select id={fieldId('shot-duration')} value={settings.secondsPerShot || 6} onChange={event => updateSettings({ secondsPerShot: Number(event.target.value) })} className={inputClass}>{![4, 6, 8, 10].includes(settings.secondsPerShot) && settings.secondsPerShot != null && <option value={settings.secondsPerShot}>{settings.secondsPerShot}s (importado)</option>}{[4, 6, 8, 10].map(seconds => <option key={seconds} value={seconds} disabled={!capabilities.supportedDurations.includes(seconds)}>{seconds}s{capabilities.supportedDurations.includes(seconds) ? '' : ' · incompatível'}</option>)}</select></Field>
        <Field label="Estilo visual" id={fieldId('style')}><select id={fieldId('style')} value={settings.style || STYLES[0]} onChange={event => updateSettings({ style: event.target.value })} className={inputClass}>{currentOption(settings.style, STYLES)}{STYLES.map(style => <option key={style}>{style}</option>)}</select></Field>
        <p className="text-xs leading-5 text-zinc-400 sm:col-span-2 lg:col-span-3">Modelo, qualidade e duração padrão se aplicam a novas tomadas. As tomadas já editadas mantêm suas configurações individuais.</p>
      </fieldset>
    </details>

    {mode === 'ai' && <section aria-labelledby={fieldId('ideas-heading')} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 id={fieldId('ideas-heading')} className="text-base font-semibold">Encontre o ponto de partida</h3><p className="mt-1 text-sm leading-6 text-zinc-400">Compare premissas e ganchos antes de escrever.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={locked} className={buttonClass} onClick={() => run('suggestIdeas', { theme: settings.nicheTheme || '', settings, count: 4 })}>{pending === 'suggestIdeas' ? 'Buscando ideias…' : 'Sugerir 4 ideias'}</button><button type="button" disabled={locked} className={primaryClass} onClick={() => generate(selectedIdea)}>{pending === 'generateStory' ? 'Escrevendo história…' : selectedIdea ? 'Escrever a ideia selecionada' : 'Escrever a partir da premissa'}</button></div></div>
      {!!ideas.length && <div role="group" aria-label="Ideias sugeridas" className="grid gap-3 md:grid-cols-2">{ideas.map((idea, index) => <button key={idea.id || index} type="button" disabled={locked} aria-pressed={selectedIdea === idea} onClick={() => setSelectedIdea(idea)} className={`rounded-2xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${selectedIdea === idea ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'}`}><span className="block text-base font-medium">{idea.title}</span><span className="mt-2 block text-sm leading-6 text-zinc-300">{idea.premise}</span><span className="mt-3 block rounded-lg bg-black/30 p-3 text-sm leading-6 text-amber-200"><span className="mb-1 block text-xs font-medium text-amber-300">Gancho dos primeiros 3 segundos</span>{idea.hook}</span><span className="mt-3 block text-xs text-zinc-400">{selectedIdea === idea ? '✓ Selecionada' : 'Selecionar esta ideia'}{idea.structure ? ` · ${idea.structure}` : ''}</span></button>)}</div>}
    </section>}

    <fieldset disabled={locked} className="grid min-w-0 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-2"><legend className="px-2 text-base font-semibold">Resumo e arco dramático</legend>
      <Field label="Sinopse" id={fieldId('synopsis')} className="md:col-span-2"><textarea id={fieldId('synopsis')} rows={3} className={inputClass} value={bible.logline ?? project.logline ?? ''} onChange={event => publish({ ...project, logline: event.target.value, storyBible: { ...bible, logline: event.target.value } })} placeholder="Quem sofre a injustiça, o que está em jogo e qual a virada?" /></Field>
      <Field label="Gancho inicial · primeiros 3 segundos" id={fieldId('hook')}><textarea id={fieldId('hook')} rows={3} className={inputClass} value={bible.hook || ''} onChange={event => updateBible({ hook: event.target.value })} /></Field>
      <Field label="Conflito central" id={fieldId('conflict')}><textarea id={fieldId('conflict')} rows={3} className={inputClass} value={bible.centralConflict || ''} onChange={event => updateBible({ centralConflict: event.target.value })} /></Field>
      <Field label="Final desta parte" id={fieldId('ending')} hint="Gancho nas duas primeiras partes; resolução da história na terceira."><textarea id={fieldId('ending')} rows={3} className={inputClass} value={bible.ending?.description || ''} onChange={event => updateBible({ ending: { ...bible.ending, description: event.target.value } })} /></Field>
      <Field label="Frase final ou última revelação" id={fieldId('punchline')}><textarea id={fieldId('punchline')} rows={3} className={inputClass} value={bible.ending?.finalPunchline || ''} onChange={event => updateBible({ ending: { ...bible.ending, finalPunchline: event.target.value } })} /></Field>
    </fieldset>

    <section aria-labelledby={fieldId('script-heading')} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id={fieldId('script-heading')} className="text-base font-semibold">{mode === 'custom' ? 'Cole seu roteiro completo' : 'Texto do roteiro'}</h3><p className="mt-1 text-sm leading-6 text-zinc-400">{mode === 'custom' ? 'A conversão usa todo o texto e guarda uma cópia do original.' : 'O storyboard define as cenas e falas. Edições livres podem ser convertidas novamente.'}</p></div><span className="text-xs leading-6 text-zinc-400">{countWords(project.scriptText)} palavras</span></div>
      <label htmlFor={fieldId('script')} className="sr-only">Texto completo do roteiro</label><textarea id={fieldId('script')} disabled={locked} rows={16} className={`${inputClass} min-h-80 resize-y leading-7`} aria-describedby={fieldId('sync-status')} value={project.scriptText || ''} onChange={event => publish({ ...project, scriptText: event.target.value })} placeholder="Cole seu texto aqui, ou escreva uma história a partir da premissa acima." />
      <div className="flex flex-wrap items-center justify-between gap-3"><p id={fieldId('sync-status')} role="status" className={`max-w-xl text-sm leading-6 ${sync.status === 'synced' ? 'text-emerald-300' : 'text-amber-200'}`}>{sync.status === 'synced' ? '✓ Texto atualizado a partir do storyboard.' : 'O texto e o storyboard têm diferenças. Atualizar pelo storyboard substitui este texto livre.'}</p><div className="flex flex-wrap gap-2"><button type="button" disabled={locked || !shotCount || sync.status === 'synced'} className={buttonClass} onClick={() => sync.status === 'stale' && project.scriptText?.trim() ? setReplacement({ action: 'syncScript', payload: {}, textOnly: true }) : run('syncScript')}>Atualizar pelo storyboard</button>{mode === 'custom' && <button type="button" disabled={locked || !project.scriptText?.trim()} className={primaryClass} onClick={() => requestWriting('convertScript', { rawScript: project.scriptText, settings })}>{pending === 'convertScript' ? 'Convertendo roteiro completo…' : 'Converter em cenas e tomadas'}</button>}</div></div>
      {project.sourceScriptText && <details className="rounded-xl border border-zinc-800 p-4"><summary className="cursor-pointer text-sm font-medium">Texto autoral original preservado</summary><label htmlFor={fieldId('source')} className="mt-3 block text-xs text-zinc-400">Cópia de leitura do texto usado na conversão</label><textarea id={fieldId('source')} readOnly rows={8} value={project.sourceScriptText} className={`${inputClass} mt-2 leading-7`} /></details>}
    </section>

    <details className="rounded-2xl border border-zinc-800 bg-zinc-900/60"><summary className="cursor-pointer px-5 py-4 text-base font-semibold focus-visible:ring-2 focus-visible:ring-amber-400">Continuar a história <span className="ml-2 text-sm font-normal text-zinc-400">Parte {(settings.currentEpisode || 1) + 1}</span></summary><fieldset disabled={locked} className="space-y-4 border-t border-zinc-800 p-5"><legend className="sr-only">Direção da próxima parte</legend><p className="text-sm leading-6 text-zinc-400">A continuação usa o episódio anterior e mantém personagens, fotos, figurinos, vozes e cenários. O episódio atual fica no histórico.</p><Field label="O que precisa acontecer na próxima parte?" id={fieldId('continuation')}><textarea id={fieldId('continuation')} className={inputClass} rows={3} value={directive} onChange={event => setDirective(event.target.value)} placeholder="Retomar a revelação da última tomada…" /></Field><label className="flex items-center gap-3 text-sm leading-6"><input type="checkbox" className="h-4 w-4 accent-amber-400" checked={finalPart ?? (settings.currentEpisode || 1) + 1 >= 3} onChange={event => setFinalPart(event.target.checked)} />Fechar a história nesta parte</label><button type="button" disabled={!shotCount} className={primaryClass} onClick={() => run('continueEpisode', { directive, finalEpisode: finalPart ?? (settings.currentEpisode || 1) + 1 >= 3 })}>{pending === 'continueEpisode' ? 'Escrevendo continuação…' : `Criar parte ${(settings.currentEpisode || 1) + 1}`}</button>{!shotCount && <p className="text-xs text-zinc-400">Crie ou importe um episódio com tomadas para continuar.</p>}</fieldset></details>

    <p aria-live="polite" className="min-h-5 text-sm text-amber-200">{pending ? pending === 'generateStory' ? 'Escrevendo a base e depois as tomadas. Aguarde a validação do roteiro completo.' : 'Processando a solicitação. Você poderá revisar o resultado ao terminar.' : busy ? 'Há uma operação em andamento. Seus campos estão protegidos durante o processamento.' : ''}</p>

    {replacement && <div role="alertdialog" aria-modal="true" aria-labelledby={fieldId('replace-title')} aria-describedby={fieldId('replace-body')} onKeyDown={event => dialogKeys(event, () => setReplacement(null))} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"><h3 id={fieldId('replace-title')} className="text-lg font-semibold">{replacement.textOnly ? 'Atualizar este texto pelo storyboard?' : 'Substituir a estrutura atual?'}</h3><p id={fieldId('replace-body')} className="mt-3 text-sm leading-6 text-zinc-300">{replacement.textOnly ? 'O texto livre será substituído pelas cenas e falas atuais do storyboard.' : `Este projeto já tem ${shotCount} tomadas e ${bible.characters?.length || 0} personagens. A nova escrita substituirá sua estrutura e suas mídias atuais. Salve o JSON completo antes de prosseguir.`}</p><div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" autoFocus className={buttonClass} onClick={() => setReplacement(null)}>Manter como está</button><button type="button" disabled={locked} className={primaryClass} onClick={() => { const request = replacement; setReplacement(null); run(request.action, { ...request.payload, replace: true }); }}>{replacement.textOnly ? 'Atualizar texto' : 'Substituir e escrever'}</button></div></div></div>}
  </section>;
}

export { RoteiroPanel };
