import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  criarPlanoExportacao, criarPacoteZip, criarZipStore, arquivosDoPacote,
  baixarExportacao, criarDownloadFlow, codificarBase64, decodificarBase64,
  gerarSrt, formatarTempoSrt, nomeSeguro,
} from '../src/exportacao/index.js';

const texto = new TextDecoder();
const encoder = new TextEncoder();
const base64 = valor => Buffer.from(valor).toString('base64');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function projetoTeste() {
  return {
    title: 'João: / novela?', version: '3.0', savedAt: '2026-10-28T00:00:00Z',
    settings: { secondsPerShot: 6, hasNarrator: false }, scriptText: 'Rosa: Não aceito a injustiça!\nValéria: Saia!',
    campoDesconhecido: { preservar: ['sim', 0, false, null] },
    storyBible: {
      characters: [{ id: 'rosa', name: 'Rosa', referenceSheetBase64: base64('foto comum'), referenceSheetMimeType: 'image/jpeg' }],
      locations: [], scenes: [
        { sceneNumber: 8, actNumber: 1, title: 'Recepção', shots: [
          { shotId: 'id-original', durationSeconds: 4.123, speakerName: 'Rosa', dialogueLine: 'Não aceito a injustiça!', emotion: 'indignada', visualAction: 'Rosa olha para Valéria.', generatedImageBase64: base64('foto comum'), generatedMimeType: 'image/jpeg', generatedVideoBase64: base64('video um'), generatedVideoMimeType: 'video/webm' },
          { shotId: 'id-silencio', durationSeconds: 2, dialogueLine: '', visualAction: 'Valéria recua.' },
        ] },
        { sceneNumber: 8, actNumber: 2, title: 'Corredor', shots: [
          { shotId: 'id-original', durationSeconds: 6, speakerName: 'Rosa', dialogueLine: 'Eu volto amanhã.', generatedImageBase64: `data:image/jpeg;base64,${base64('foto comum')}` },
        ] },
      ],
    },
  };
}

test('JSON completo preserva todos os dados e metadados, separado do ZIP e sem mutar a entrada', () => {
  const projeto = projetoTeste();
  const antes = JSON.stringify(projeto);
  const plano = criarPlanoExportacao(projeto);
  assert.equal(JSON.stringify(projeto), antes);
  assert.deepEqual(JSON.parse(plano.projetoJson), projeto);
  assert.equal(plano.manifesto.resumo.incluirSrt, false);
  assert(!plano.arquivos.some(a => /\.srt$|_projeto_sanja\.json$|\.zip$/i.test(a.caminho)));
  assert(!JSON.stringify(plano.manifesto).includes(base64('foto comum')));
  assert(!JSON.stringify(plano.manifesto).includes('data:image/jpeg;base64,'));
  assert.equal(plano.manifesto.projeto.campoDesconhecido.preservar[0], 'sim');
});

test('mídia repetida em referência e tomadas é gravada uma vez, com todos os usos', () => {
  const plano = criarPlanoExportacao(projetoTeste());
  assert.equal(plano.manifesto.resumo.midiasUnicas, 2);
  assert.equal(plano.manifesto.resumo.usosDeMidia, 4);
  const foto = plano.manifesto.midias.find(m => m.mimeType === 'image/jpeg');
  assert.equal(foto.usos.length, 3);
  assert.equal(new Set(foto.usos.map(u => u.jsonPointer)).size, 3);
  assert.equal(plano.arquivos.filter(a => a.caminho === foto.arquivo).length, 1);
  const video = plano.manifesto.midias.find(m => m.mimeType === 'video/webm');
  assert.match(video.arquivo, /S01_T01_video\.webm$/);
  assert.equal(plano.manifesto.projeto.storyBible.scenes[1].shots[0].generatedImageBase64.arquivo, foto.arquivo);
});

test('cenas com números repetidos usam ordem e não sobrescrevem arquivos', () => {
  const projeto = projetoTeste();
  projeto.storyBible.scenes[1].shots[0].generatedImageBase64 = base64('foto diferente');
  const plano = criarPlanoExportacao(projeto);
  assert(plano.arquivos.some(a => /S02_T01_quadro/.test(a.caminho)));
  assert.equal(plano.manifesto.projeto.storyBible.scenes[0].sceneNumber, 8);
  assert.equal(plano.manifesto.projeto.storyBible.scenes[1].sceneNumber, 8);
  assert.equal(new Set(plano.arquivos.map(a => a.caminho.toLowerCase())).size, plano.arquivos.length);
});

test('erro em uma mídia preserva o projeto e permite exportar as outras com pendência explícita', () => {
  const projeto = projetoTeste();
  projeto.storyBible.scenes[0].shots[0].generatedVideoBase64 = 'isto não é base64!';
  const plano = criarPlanoExportacao(projeto);
  assert.deepEqual(JSON.parse(plano.projetoJson), projeto);
  assert.equal(plano.manifesto.resumo.midiasUnicas, 1);
  assert(plano.manifesto.pendencias.some(p => p.tipo === 'midia_invalida' && p.tomadaIndex === 0));
  assert(!JSON.stringify(plano.manifesto).includes('isto não é base64!'));
  assert(criarPacoteZip(plano).length > 22);
});

test('campos base64 adicionais são extraídos e JSON legado perde somente o ZIP embutido', () => {
  const projeto = projetoTeste();
  projeto.zipArchiveBase64 = 'UEsDBA==';
  projeto.storyBible.characters[0].extras = [{ base64: base64('audio adicional'), mimeType: 'audio/ogg' }];
  const plano = criarPlanoExportacao(projeto);
  const salvo = JSON.parse(plano.projetoJson);
  assert.equal(salvo.zipArchiveBase64, undefined);
  assert.equal(projeto.zipArchiveBase64, 'UEsDBA==');
  assert.equal(salvo.storyBible.characters[0].extras[0].base64, base64('audio adicional'));
  assert(plano.manifesto.midias.some(m => m.mimeType === 'audio/ogg' && m.arquivo.endsWith('.ogg')));
  assert(!JSON.stringify(plano.manifesto).includes('UEsDBA=='));
});

test('falas mantêm acentos e tempos com silêncio; SRT só entra quando solicitado', () => {
  const plano = criarPlanoExportacao(projetoTeste(), { incluirSrt: true });
  const falas = texto.decode(plano.arquivos.find(a => a.caminho === 'FALAS_POR_PERSONAGEM.txt').bytes);
  assert.match(falas, /Não aceito a injustiça!/);
  assert.match(falas, /S02_T01 \| 00:00:06,123/);
  const srt = gerarSrt(projetoTeste());
  assert.match(srt, /00:00:06,123 --> 00:00:12,123/);
  assert.equal(formatarTempoSrt(59.9996), '00:01:00,000');
  assert(plano.arquivos.some(a => a.caminho === 'LEGENDAS.srt'));
});

test('prompts salvos têm precedência; montadores originais são injetados e falhas são relatadas', () => {
  const projeto = projetoTeste();
  projeto.storyBible.scenes[0].shots[0].imagePrompt = 'PROMPT ORIGINAL EXATO';
  const plano = criarPlanoExportacao(projeto, {
    montarPromptImagem: () => ({ prompt: 'IMAGEM RECONSTRUÍDA' }),
    montarPromptVideo: () => { throw new Error('direção incompatível'); },
  });
  const prompts = texto.decode(plano.arquivos.find(a => a.caminho === 'PROMPTS_GERACAO.txt').bytes);
  assert.match(prompts, /IMAGEM \(salvo no projeto\): PROMPT ORIGINAL EXATO/);
  assert.match(prompts, /IMAGEM RECONSTRUÍDA/);
  assert(plano.manifesto.pendencias.some(p => p.tipo === 'prompt_indisponivel'));
});

test('pacote por cena inclui dependências compartilhadas e mídia daquela cena', () => {
  const plano = criarPlanoExportacao(projetoTeste());
  const arquivos = arquivosDoPacote(plano, { cenaIndex: 1 });
  assert(!arquivos.some(a => a.caminho.endsWith('.webm')));
  const manifesto = JSON.parse(texto.decode(arquivos.find(a => a.caminho === 'MANIFESTO.json').bytes));
  assert.equal(manifesto.escopo, 'cena');
  assert.equal(manifesto.projeto.storyBible.scenes.length, 1);
  assert.equal(manifesto.resumo.tomadas, 1);
  assert.equal(manifesto.resumo.videos, 0);
  assert.equal(manifesto.midias.length, 1);
  assert(manifesto.midias[0].usos.every(u => u.cenaIndex === 1 || u.cenaIndex === null));
  assert.throws(() => criarPacoteZip(plano, { cenaIndex: -1 }), /Cena inválida/);
});

test('ZIP impede caminhos perigosos, duplicados, limite de memória e contém assinatura PK real', () => {
  const arquivo = { caminho: 'ação/olá.txt', bytes: encoder.encode('olá') };
  const zip = criarZipStore([arquivo]);
  assert.deepEqual([...zip.slice(0, 4)], [0x50, 0x4b, 3, 4]);
  for (const caminho of ['../segredo', '/absoluto', 'C:/absoluto', 'a/../b', 'a\\b', 'a//b', 'a\u0000b']) {
    assert.throws(() => criarZipStore([{ ...arquivo, caminho }]), /Caminho inválido/);
  }
  assert.throws(() => criarZipStore([arquivo, { ...arquivo, caminho: 'AÇÃO/OLÁ.txt' }]), /Nome repetido/);
  assert.throws(() => criarZipStore([arquivo], { limiteBytes: 10 }), /limite de memória/);
  assert.equal(nomeSeguro('CON'), 'projeto');
});

test('base64 preserva bytes grandes sem spread e rejeita mídia inválida', () => {
  const bytes = Uint8Array.from({ length: 200000 }, (_, i) => i % 256);
  assert.deepEqual(decodificarBase64(codificarBase64(bytes)).bytes, bytes);
  assert.equal(decodificarBase64(`data:image/png;base64,${base64('png')}`, 'image/jpeg').mimeType, 'image/png');
  for (const valor of ['', 'a', '!!', 'Zm=8', 'Zm8===', 'data:text/plain,hello']) assert.throws(() => decodificarBase64(valor));
});

test('Flow não recebe ZIP sem capacidade confirmada e JSON nunca contém ZIP embutido', async () => {
  const chamadas = [];
  const baixar = criarDownloadFlow({ download: async payload => chamadas.push(payload) });
  const plano = criarPlanoExportacao(projetoTeste());
  const bloqueado = await baixarExportacao(plano, { baixarArquivo: baixar });
  assert.equal(bloqueado.status, 'indisponivel');
  assert.equal(chamadas.length, 0);
  const salvo = await baixarExportacao(plano, { baixarArquivo: baixar, modo: 'projeto' });
  assert.equal(salvo.status, 'solicitado');
  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].mimeType, 'application/json');
  assert.deepEqual(JSON.parse(Buffer.from(chamadas[0].base64, 'base64').toString('utf8')), projetoTeste());
});

test('downloads parciais continuam e retornam falha concreta; cancelamento não envia restantes', async () => {
  const plano = criarPlanoExportacao(projetoTeste());
  const enviados = [];
  const baixarArquivo = async arquivo => {
    if (arquivo.filename === 'PROMPTS_GERACAO.txt') throw new Error('limite de download');
    enviados.push(arquivo.filename);
  };
  const resultado = await baixarExportacao(plano, { baixarArquivo, modo: 'arquivos', incluirProjeto: false });
  assert.equal(resultado.status, 'parcial');
  assert(resultado.falhas.some(f => f.filename === 'PROMPTS_GERACAO.txt' && f.mensagem === 'limite de download'));
  assert(enviados.includes('MANIFESTO.json'));
  const controller = new AbortController();
  const cancelado = await baixarExportacao(plano, { baixarArquivo: async () => controller.abort(), modo: 'arquivos', signal: controller.signal });
  assert.equal(cancelado.status, 'cancelado');
  assert.equal(cancelado.solicitados.length, 1);
  assert(cancelado.restantes > 0);
});

test('falha de tamanho oferece cenas; exportação por cena continua após uma falha', async () => {
  const plano = criarPlanoExportacao(projetoTeste());
  const baixar = async () => {};
  baixar.suportaZip = true;
  const grande = await baixarExportacao(plano, { baixarArquivo: baixar, limiteBytes: 10, incluirProjeto: false });
  assert.equal(grande.status, 'falhou');
  assert(grande.alternativas.includes('cenas'));
  let chamadas = 0;
  const parcial = async () => { if (++chamadas === 1) throw new Error('falha de transporte'); };
  parcial.suportaZip = true;
  const cenas = await baixarExportacao(plano, { baixarArquivo: parcial, modo: 'cenas', incluirProjeto: false });
  assert.equal(cenas.status, 'parcial');
  assert.equal(cenas.solicitados.length, 1);
});

test('backup real: preservação, oito mídias únicas e integridade independente via Python zipfile', t => {
  const caminho = new URL('../../../producoes/rosa-humilhada-na-pousada/diagnostico/Projeto_atual_backup.json', import.meta.url);
  // O teste está em ferramentas/estudio-novelas/test: são três níveis até a raiz.
  const bytesOriginais = readFileSync(caminho);
  const projeto = JSON.parse(bytesOriginais);
  const plano = criarPlanoExportacao(projeto);
  assert.deepEqual(JSON.parse(plano.projetoJson), projeto);
  assert.equal(plano.manifesto.resumo.cenas, 10);
  assert.equal(plano.manifesto.resumo.tomadas, 30);
  assert.equal(plano.manifesto.resumo.midiasUnicas, 8);
  assert.equal(plano.manifesto.resumo.imagens, 2);
  assert.equal(plano.manifesto.resumo.videos, 0);
  assert.equal(sha(readFileSync(caminho)), sha(bytesOriginais));
  const midiasFonte = [
    ...projeto.storyBible.characters.map(c => c.referenceSheetBase64),
    ...projeto.storyBible.locations.map(l => l.generatedImageBase64),
    ...projeto.storyBible.scenes.flatMap(c => c.shots.map(s => s.generatedImageBase64)),
  ].filter(Boolean).map(m => sha(Buffer.from(m, 'base64')));
  const midiasExportadas = plano.arquivos.filter(a => a.categoria === 'midia').map(a => sha(a.bytes));
  assert.deepEqual([...new Set(midiasExportadas)].sort(), [...new Set(midiasFonte)].sort());
  const zip = criarPacoteZip(plano);
  const python = process.env.EXPORTACAO_PYTHON;
  if (!python) { t.diagnostic('Defina EXPORTACAO_PYTHON para executar também a inspeção independente com zipfile.'); return; }
  const verificacao = spawnSync(python, [new URL('./exportacao_verificar_zip.py', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')], { input: zip, encoding: 'utf8', maxBuffer: 1024 * 1024 });
  assert.equal(verificacao.status, 0, verificacao.stderr);
  const relatorio = JSON.parse(verificacao.stdout);
  assert.equal(relatorio.midias, 8);
  assert.equal(relatorio.crcValido, true);
  assert.equal(relatorio.semDuplicatas, true);
});
