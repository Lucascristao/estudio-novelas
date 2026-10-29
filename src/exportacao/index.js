import { crc32, criarZipStore } from './zip.js';

export { criarZipStore, crc32 } from './zip.js';

const encoder = new TextEncoder();
const extensoes = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
  'image/gif': 'gif', 'image/svg+xml': 'svg', 'video/mp4': 'mp4', 'video/webm': 'webm',
  'video/quicktime': 'mov', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/ogg': 'ogg',
};
const mimePadrao = {
  referenceSheetBase64: 'image/jpeg', userUploadedPhotoBase64: 'image/jpeg',
  generatedImageBase64: 'image/jpeg', generatedVideoBase64: 'video/mp4',
};
const camposMime = {
  generatedImageBase64: 'generatedMimeType', generatedVideoBase64: 'generatedVideoMimeType',
  referenceSheetBase64: 'referenceSheetMimeType', userUploadedPhotoBase64: 'userUploadedPhotoMimeType',
};
const arquivosLegados = new Set(['zipArchiveBase64', 'zipBase64']);
const pad = numero => String(numero).padStart(2, '0');
const lista = valor => Array.isArray(valor) ? valor : [];
const json = valor => JSON.stringify(valor, null, 2);
const checksum = bytes => crc32(bytes).toString(16).padStart(8, '0');
const iguais = (a, b) => a.length === b.length && a.every((byte, i) => byte === b[i]);
const pointer = caminho => '/' + caminho.map(p => String(p).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');

export function nomeSeguro(valor, fallback = 'projeto') {
  const nome = String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 70);
  return nome && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(nome) ? nome : fallback;
}

export function decodificarBase64(valor, mimeType = 'application/octet-stream') {
  if (typeof valor !== 'string') throw new Error('A mídia não contém base64 em texto.');
  let texto = valor.trim();
  if (/^data:/i.test(texto)) {
    const data = /^data:([^,]*),([\s\S]*)$/i.exec(texto);
    if (!data || !/;base64$/i.test(data[1])) throw new Error('Data URL sem conteúdo base64.');
    mimeType = data[1].split(';')[0] || mimeType;
    texto = data[2];
  }
  texto = texto.replace(/\s/g, '');
  if (!texto || !/^[A-Za-z0-9+/]*={0,2}$/.test(texto) || texto.length % 4 === 1 ||
      (texto.includes('=') && texto.length % 4 !== 0)) throw new Error('Base64 inválido ou vazio.');
  let binario;
  try { binario = globalThis.atob(texto); } catch { throw new Error('Base64 inválido.'); }
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  if (!bytes.length) throw new Error('Mídia vazia.');
  return { bytes, mimeType: String(mimeType).split(';')[0].toLowerCase() };
}

export function codificarBase64(bytes) {
  // Múltiplos de três evitam padding no meio; não usa spread de mídias grandes.
  const partes = [];
  for (let i = 0; i < bytes.length; i += 24576) {
    let texto = '';
    for (const byte of bytes.subarray(i, i + 24576)) texto += String.fromCharCode(byte);
    partes.push(globalThis.btoa(texto));
  }
  return partes.join('');
}

function contextoMidia(caminho, projeto) {
  const cenaIndex = caminho[0] === 'storyBible' && caminho[1] === 'scenes' ? caminho[2] : null;
  const tomadaIndex = cenaIndex !== null && caminho[3] === 'shots' ? caminho[4] : null;
  const campo = caminho.at(-1);
  if (cenaIndex !== null && tomadaIndex !== null) {
    const cena = lista(projeto.storyBible?.scenes)[cenaIndex];
    const tag = `S${pad(cenaIndex + 1)}_T${pad(tomadaIndex + 1)}`;
    const tipo = campo === 'generatedImageBase64' ? 'quadro' : campo === 'generatedVideoBase64' ? 'video' : nomeSeguro(campo, 'midia');
    return { cenaIndex, tomadaIndex, tag, prefixo: `Cenas/Cena_${pad(cenaIndex + 1)}_Ato_${nomeSeguro(cena?.actNumber, '1')}/${tag}_${tipo}` };
  }
  if (caminho[0] === 'storyBible' && ['characters', 'locations'].includes(caminho[1])) {
    const item = projeto.storyBible[caminho[1]][caminho[2]];
    const pasta = caminho[1] === 'characters' ? 'Personagens' : 'Cenarios';
    return { cenaIndex: null, tomadaIndex: null, prefixo: `Ativos/${pasta}/${pad(caminho[2] + 1)}_${nomeSeguro(item?.name, 'ativo')}_${nomeSeguro(campo, 'midia')}` };
  }
  return { cenaIndex: null, tomadaIndex: null, prefixo: `Ativos/Outros/${nomeSeguro(caminho.join('_'), 'midia')}` };
}

function duracaoTomada(shot, fallback) {
  const valor = Number(shot.durationSeconds);
  return Number.isFinite(valor) && valor > 0 ? valor : (Number(fallback) > 0 && Number.isFinite(Number(fallback)) ? Number(fallback) : 6);
}

export function formatarTempoSrt(segundos) {
  const total = Math.max(0, Math.round(Number(segundos) * 1000));
  const pad3 = n => String(n).padStart(3, '0');
  return `${pad(Math.floor(total / 3600000))}:${pad(Math.floor(total / 60000) % 60)}:${pad(Math.floor(total / 1000) % 60)},${pad3(total % 1000)}`;
}

export function gerarSrt(projeto) {
  let tempo = 0;
  const blocos = [];
  for (const cena of lista(projeto.storyBible?.scenes)) {
    for (const tomada of lista(cena.shots)) {
      const fim = tempo + duracaoTomada(tomada, projeto.settings?.secondsPerShot);
      const fala = String(tomada.dialogueLine || '').trim();
      if (fala) blocos.push(`${blocos.length + 1}\n${formatarTempoSrt(tempo)} --> ${formatarTempoSrt(fim)}\n${tomada.speakerName ? `${tomada.speakerName}: ` : ''}${fala}\n`);
      tempo = fim;
    }
  }
  return blocos.join('\n');
}

/** Plano imutável em relação à entrada. JSON de continuidade fica FORA do pacote de produção. */
export function criarPlanoExportacao(entrada, { incluirSrt = false, montarPromptImagem, montarPromptVideo } = {}) {
  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) throw new Error('Abra um projeto JSON antes de exportar.');
  const projeto = JSON.parse(JSON.stringify(entrada));
  const legadosRemovidos = [];
  for (const campo of arquivosLegados) {
    if (Object.hasOwn(projeto, campo)) { delete projeto[campo]; legadosRemovidos.push(campo); }
  }
  if (!projeto.storyBible || !Array.isArray(projeto.storyBible.scenes)) throw new Error('O projeto precisa de Story Bible e lista de cenas.');
  const nomeBase = nomeSeguro(projeto.title || projeto.storyBible.title);
  const arquivos = [];
  const midias = [];
  const pendencias = [];
  const buckets = new Map();
  const caminhos = new Set();
  const midiasPorPointer = new Map();
  const usarCaminho = caminho => {
    let resultado = caminho;
    let numero = 2;
    while (caminhos.has(resultado.toLowerCase())) resultado = caminho.replace(/(\.[^/.]+)?$/, (_, ext = '') => `_${numero++}${ext}`);
    caminhos.add(resultado.toLowerCase());
    return resultado;
  };
  function percorrer(valor, caminho = [], pai = null) {
    const campo = caminho.at(-1);
    if (typeof campo === 'string' && arquivosLegados.has(campo)) return undefined;
    const base64 = typeof campo === 'string' && /base64$/i.test(campo);
    const dataUrl = typeof valor === 'string' && /^data:[^,]*;base64,/i.test(valor);
    if (base64 || dataUrl) {
      if (!valor) return null;
      const contexto = contextoMidia(caminho, projeto);
      const jsonPointer = pointer(caminho);
      const mimeType = pai?.[camposMime[campo]] || pai?.[String(campo).replace(/Base64$/i, 'MimeType')] || pai?.mimeType || mimePadrao[campo] || 'application/octet-stream';
      try {
        const decodificada = decodificarBase64(valor, mimeType);
        const crc = checksum(decodificada.bytes);
        const chave = `${decodificada.bytes.length}:${crc}`;
        const candidatos = buckets.get(chave) || [];
        let midia = candidatos.find(item => iguais(item.bytes, decodificada.bytes));
        if (!midia) {
          const arquivo = usarCaminho(`${contexto.prefixo}.${extensoes[decodificada.mimeType] || 'bin'}`);
          midia = { arquivo, mimeType: decodificada.mimeType, tamanhoBytes: decodificada.bytes.length, crc32: crc, usos: [], bytes: decodificada.bytes };
          candidatos.push(midia);
          buckets.set(chave, candidatos);
          midias.push(midia);
          arquivos.push({ caminho: arquivo, mimeType: midia.mimeType, bytes: midia.bytes, categoria: 'midia', cenaIndices: [] });
        }
        midia.usos.push({ jsonPointer, cenaIndex: contexto.cenaIndex, tomadaIndex: contexto.tomadaIndex, tag: contexto.tag || null, mimeType: decodificada.mimeType });
        const arquivo = arquivos.find(item => item.caminho === midia.arquivo);
        if (contexto.cenaIndex !== null && !arquivo.cenaIndices.includes(contexto.cenaIndex)) arquivo.cenaIndices.push(contexto.cenaIndex);
        if (contexto.cenaIndex === null) arquivo.compartilhado = true;
        midiasPorPointer.set(jsonPointer, midia.arquivo);
        return { arquivo: midia.arquivo, mimeType: decodificada.mimeType };
      } catch (error) {
        pendencias.push({ tipo: 'midia_invalida', jsonPointer, cenaIndex: contexto.cenaIndex, tomadaIndex: contexto.tomadaIndex, mensagem: error.message });
        return { arquivo: null, erro: 'Mídia inválida; conteúdo preservado somente no JSON completo.' };
      }
    }
    if (Array.isArray(valor)) return valor.map((item, i) => percorrer(item, [...caminho, i], valor));
    if (valor && typeof valor === 'object') return Object.fromEntries(Object.entries(valor)
      .filter(([key]) => !arquivosLegados.has(key))
      .map(([key, item]) => [key, percorrer(item, [...caminho, key], valor)]));
    return valor;
  }
  const projetoSemBase64 = percorrer(projeto);
  function adicionarTexto(caminho, texto, mimeType = 'text/plain', cenaIndices = []) {
    arquivos.push({ caminho: usarCaminho(caminho), mimeType, bytes: encoder.encode(texto), categoria: 'documento', cenaIndices });
  }
  const falas = new Map();
  const prompts = ['PROMPTS E DIREÇÃO — SANJA\nPrompts reconstruídos refletem a configuração atual, que pode ter mudado após a geração.\n'];
  let tempo = 0;
  let totalTomadas = 0;
  let imagens = 0;
  let videos = 0;
  for (const [cenaIndex, cena] of projeto.storyBible.scenes.entries()) {
    for (const [tomadaIndex, tomada] of lista(cena.shots).entries()) {
      totalTomadas++;
      const tag = `S${pad(cenaIndex + 1)}_T${pad(tomadaIndex + 1)}`;
      const base = `/storyBible/scenes/${cenaIndex}/shots/${tomadaIndex}`;
      const temImagem = midiasPorPointer.has(`${base}/generatedImageBase64`);
      const temVideo = midiasPorPointer.has(`${base}/generatedVideoBase64`);
      if (temImagem) imagens++;
      if (temVideo) videos++;
      for (const [tipo, campo, presente] of [['imagem', 'generatedImageBase64', temImagem], ['video', 'generatedVideoBase64', temVideo]]) {
        if (!presente && !tomada[campo]) pendencias.push({ tipo: `${tipo}_ausente`, cenaIndex, tomadaIndex, tag, mensagem: `${tag}: ${tipo === 'imagem' ? 'quadro' : 'vídeo'} ainda não gerado.` });
      }
      if (tomada.lastError) pendencias.push({ tipo: 'erro_geracao', cenaIndex, tomadaIndex, tag, mensagem: String(tomada.lastError) });
      if (temVideo && !tomada.isApproved) pendencias.push({ tipo: 'aprovacao_pendente', cenaIndex, tomadaIndex, tag, mensagem: `${tag}: vídeo ainda não aprovado.` });
      const duracao = duracaoTomada(tomada, projeto.settings?.secondsPerShot);
      if (Number(tomada.durationSeconds) !== duracao) pendencias.push({ tipo: 'duracao_estimada', cenaIndex, tomadaIndex, tag, mensagem: `${tag}: duração ausente ou inválida; ${duracao}s usados nos índices de fala.` });
      const fala = String(tomada.dialogueLine || '').trim();
      if (fala) {
        const personagem = tomada.speakerName || projeto.storyBible.characters?.find(c => c.id === tomada.speakerCharacterId)?.name || 'Narrador ou voz off';
        if (!falas.has(personagem)) falas.set(personagem, []);
        falas.get(personagem).push(`[${tag} | ${formatarTempoSrt(tempo)} | ${duracao}s] (${tomada.emotion || 'sem emoção indicada'}) ${fala}`);
      }
      prompts.push(`=== ${tag} | ID ${tomada.shotId || ''} | ${duracao}s ===`);
      for (const [rotulo, montar, salvo] of [
        ['IMAGEM', montarPromptImagem, tomada.imagePrompt || tomada.promptImagem || tomada.generatedImagePrompt],
        ['VÍDEO', montarPromptVideo, tomada.videoPrompt || tomada.promptVideo || tomada.generatedVideoPrompt],
      ]) {
        if (salvo) prompts.push(`${rotulo} (salvo no projeto): ${typeof salvo === 'string' ? salvo : json(salvo)}`);
        else if (typeof montar === 'function') {
          try {
            const resultado = montar(tomada, lista(projeto.storyBible.characters), lista(projeto.storyBible.locations), projeto.settings || {});
            const texto = typeof resultado === 'string' ? resultado : resultado?.prompt;
            if (!texto) throw new Error('O montador não retornou um prompt em texto.');
            prompts.push(`${rotulo} (reconstruído da configuração atual): ${texto}`);
          } catch (error) {
            pendencias.push({ tipo: 'prompt_indisponivel', cenaIndex, tomadaIndex, tag, mensagem: `${rotulo}: ${error.message}` });
            prompts.push(`${rotulo}: não foi possível reconstruir o prompt.`);
          }
        } else prompts.push(`${rotulo}: prompt final não registrado no projeto; direção abaixo.`);
      }
      prompts.push(`Direção: ${tomada.visualAction || ''}\nCâmera: ${tomada.shotType || ''}; ${tomada.cameraMovement || ''}\nFala: ${tomada.speakerName || ''}: ${fala}\nAmbiente sonoro: ${tomada.sfxAmbience || ''}\n`);
      tempo += duracao;
    }
  }
  for (const [grupo, campo, tipo] of [['characters', 'referenceSheetBase64', 'referencia_personagem_ausente'], ['locations', 'generatedImageBase64', 'referencia_cenario_ausente']]) {
    for (const [i, item] of lista(projeto.storyBible[grupo]).entries()) {
      if (!item[campo]) pendencias.push({ tipo, cenaIndex: null, mensagem: `Referência ausente: ${item.name || item.id || i + 1}.` });
    }
  }
  if (legadosRemovidos.length) pendencias.push({ tipo: 'pacote_legado_removido', cenaIndex: null, mensagem: 'ZIP embutido legado removido do JSON exportado; as mídias do projeto foram preservadas.' });
  adicionarTexto('ROTEIRO_COMPLETO.txt', String(projeto.scriptText || ''));
  adicionarTexto('PROMPTS_GERACAO.txt', prompts.join('\n'));
  adicionarTexto('FALAS_POR_PERSONAGEM.txt', [...falas].map(([nome, linhas]) => `${nome}\n${linhas.join('\n')}\n`).join('\n'));
  for (const [i, [nome, linhas]] of [...falas].entries()) adicionarTexto(`Falas/${pad(i + 1)}_${nomeSeguro(nome, 'personagem')}.txt`, `${nome}\n${linhas.join('\n')}\n`);
  adicionarTexto('PENDENCIAS.json', json(pendencias), 'application/json');
  if (incluirSrt) adicionarTexto('LEGENDAS.srt', gerarSrt(projeto));
  adicionarTexto('LEIA-ME.txt', 'Pacote de produção Sanja\n\nAs mídias estão gravadas uma vez. MANIFESTO.json relaciona os usos de cada arquivo. Arquivos compartilhados podem ter o caminho da primeira tomada que os usou.\nO JSON completo de continuidade é um download separado e contém as mídias originais. Este pacote não contém outro ZIP ou um JSON com cópia das mídias.\nA numeração S01_T01 segue a ordem atual do storyboard. IDs e números originais continuam no manifesto.\nLegendas são opcionais. Tempos de fala usam a duração planejada, não análise do áudio renderizado.\nSe o pacote ficar grande, exporte por cena ou baixe arquivos individuais. Downloads solicitados ao Flow dependem das capacidades da versão instalada.\n');
  const manifesto = {
    formato: 'sanja-pacote-producao', versao: 1, escopo: 'projeto',
    projeto: projetoSemBase64,
    resumo: { cenas: projeto.storyBible.scenes.length, tomadas: totalTomadas, imagens, videos, midiasUnicas: midias.length, usosDeMidia: midias.reduce((n, m) => n + m.usos.length, 0), duracaoPlanejadaSegundos: tempo, incluirSrt: Boolean(incluirSrt), pendencias: pendencias.length },
    midias: midias.map(({ bytes, ...midia }) => midia), pendencias,
  };
  adicionarTexto('MANIFESTO.json', json(manifesto), 'application/json');
  return { nomeBase, projetoJson: json(projeto), projetoFilename: `${nomeBase}_projeto_sanja.json`, manifesto, arquivos };
}

export function arquivoProjeto(plano) {
  return { caminho: plano.projetoFilename, mimeType: 'application/json', bytes: encoder.encode(plano.projetoJson), categoria: 'projeto' };
}

export function listarPacotesPorCena(plano) {
  return lista(plano.manifesto.projeto.storyBible.scenes).map((cena, cenaIndex) => ({ cenaIndex, titulo: cena.title || `Cena ${cenaIndex + 1}`, filename: `${plano.nomeBase}_Cena_${pad(cenaIndex + 1)}.zip` }));
}

export function arquivosDoPacote(plano, { cenaIndex } = {}) {
  if (cenaIndex === undefined) return plano.arquivos;
  if (!Number.isInteger(cenaIndex) || !plano.manifesto.projeto.storyBible.scenes[cenaIndex]) throw new Error('Cena inválida para exportação.');
  const arquivos = plano.arquivos.filter(a => a.categoria !== 'midia' || a.compartilhado || a.cenaIndices.includes(cenaIndex));
  const manifesto = JSON.parse(json(plano.manifesto));
  manifesto.escopo = 'cena';
  manifesto.cenaIndexOriginal = cenaIndex;
  manifesto.projeto.storyBible.scenes = [manifesto.projeto.storyBible.scenes[cenaIndex]];
  const paths = new Set(arquivos.map(a => a.caminho));
  manifesto.midias = manifesto.midias.filter(m => paths.has(m.arquivo)).map(m => ({ ...m, usos: m.usos.filter(u => u.cenaIndex === null || u.cenaIndex === cenaIndex) }));
  manifesto.pendencias = manifesto.pendencias.filter(p => p.cenaIndex == null || p.cenaIndex === cenaIndex);
  const shots = lista(manifesto.projeto.storyBible.scenes[0].shots);
  manifesto.resumo = { ...manifesto.resumo, cenas: 1, tomadas: shots.length, midiasUnicas: manifesto.midias.length, usosDeMidia: manifesto.midias.reduce((n, m) => n + m.usos.length, 0), pendencias: manifesto.pendencias.length,
    imagens: shots.filter(s => s.generatedImageBase64?.arquivo).length, videos: shots.filter(s => s.generatedVideoBase64?.arquivo).length,
    duracaoPlanejadaSegundos: shots.reduce((n, s) => n + duracaoTomada(s, manifesto.projeto.settings?.secondsPerShot), 0) };
  return arquivos.map(a => a.caminho === 'MANIFESTO.json' ? { ...a, bytes: encoder.encode(json(manifesto)) } : a.caminho === 'PENDENCIAS.json' ? { ...a, bytes: encoder.encode(json(manifesto.pendencias)) } : a);
}

export function criarPacoteZip(plano, opcoes = {}) {
  return criarZipStore(arquivosDoPacote(plano, opcoes), opcoes);
}

/** O adaptador devolve uma solicitação aceita, não uma confirmação de gravação em disco. */
export function criarDownloadFlow(Flow, { suportaZip = false } = {}) {
  if (typeof Flow?.download !== 'function') throw new Error('Flow.download não está disponível.');
  const baixar = async ({ filename, mimeType, bytes }) => {
    if (mimeType === 'application/zip' && !suportaZip) throw new Error('Download ZIP ainda não confirmado nesta versão do Flow. Use arquivos individuais.');
    const resultado = await Flow.download({ filename, mimeType, base64: codificarBase64(bytes) });
    if (resultado?.success === false || resultado?.ok === false || resultado?.error) throw new Error(typeof resultado.error === 'string' ? resultado.error : resultado.error?.message || 'O Flow recusou o download.');
    return resultado;
  };
  baixar.suportaZip = suportaZip;
  return baixar;
}

export function criarDownloadNavegador({ document = globalThis.document, URL = globalThis.URL } = {}) {
  if (!document?.createElement || !URL?.createObjectURL) throw new Error('Download direto do navegador não está disponível.');
  const baixar = async ({ filename, mimeType, bytes }) => {
    const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
    const link = document.createElement('a');
    try {
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
    } finally {
      link.remove();
      // O clique precisa terminar antes de revogar a URL no navegador.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  };
  baixar.suportaZip = true;
  return baixar;
}

/** Sem fallback automático para dezenas de downloads; a interface oferece a próxima opção. */
export async function baixarExportacao(plano, { baixarArquivo, modo = 'zip', cenaIndex, incluirProjeto = true, onProgress, signal, limiteBytes } = {}) {
  if (typeof baixarArquivo !== 'function') throw new Error('Escolha um adaptador de download.');
  if (!['zip', 'cenas', 'arquivos', 'projeto'].includes(modo)) throw new Error('Modo de exportação inválido.');
  const tarefas = [];
  if (incluirProjeto || modo === 'projeto') tarefas.push({ filename: plano.projetoFilename, criar: () => arquivoProjeto(plano) });
  if (modo === 'arquivos') tarefas.push(...arquivosDoPacote(plano, { cenaIndex }).map(a => ({ filename: a.caminho, criar: () => a })));
  if (modo === 'zip' || modo === 'cenas') {
    if (!baixarArquivo.suportaZip) {
      return { status: 'indisponivel', solicitados: [], falhas: [{ filename: null, mensagem: 'Download ZIP não confirmado neste ambiente. Escolha JSON ou arquivos individuais.' }], alternativas: ['projeto', 'arquivos'] };
    }
    const cenas = modo === 'cenas' ? listarPacotesPorCena(plano) : [{ cenaIndex, filename: cenaIndex === undefined ? `${plano.nomeBase}_producao.zip` : `${plano.nomeBase}_Cena_${pad(cenaIndex + 1)}.zip` }];
    for (const cena of cenas) tarefas.push({ filename: cena.filename, criar: () => ({ caminho: cena.filename, mimeType: 'application/zip', bytes: criarPacoteZip(plano, { cenaIndex: cena.cenaIndex, limiteBytes }) }) });
  }
  const solicitados = [];
  const falhas = [];
  for (let i = 0; i < tarefas.length; i++) {
    if (signal?.aborted) return { status: 'cancelado', solicitados, falhas, restantes: tarefas.length - i, alternativas: ['cenas', 'arquivos'] };
    let arquivo;
    try {
      arquivo = tarefas[i].criar();
      await baixarArquivo({ filename: arquivo.caminho, mimeType: arquivo.mimeType, bytes: arquivo.bytes });
      solicitados.push(arquivo.caminho);
    } catch (error) { falhas.push({ filename: tarefas[i].filename, mensagem: error.message || String(error) }); }
    onProgress?.({ feitos: i + 1, total: tarefas.length, solicitados: solicitados.length, falhas: falhas.length, filename: tarefas[i].filename });
  }
  return { status: falhas.length ? (solicitados.length ? 'parcial' : 'falhou') : 'solicitado', solicitados, falhas, alternativas: falhas.length ? ['cenas', 'arquivos'] : [] };
}
