# Exportação Sanja 3.0

O núcleo roda no navegador e no Node, sem pacote adicional. A entrada é o projeto completo
`{ title, settings, scriptText, storyBible, version, savedAt, ...camposExtras }`.

```js
import {
  criarPlanoExportacao, criarPacoteZip, criarDownloadFlow, baixarExportacao,
} from './exportacao/index.js';

const plano = criarPlanoExportacao(projeto, {
  incluirSrt: false,
  montarPromptImagem: assembleShotImagePrompt,
  montarPromptVideo: assembleVideoPrompt,
});

// Os montadores usam a assinatura original (tomada, personagens, cenários, settings).
// Um prompt salvo na tomada tem precedência sobre o prompt reconstruído.
const zipBytes = criarPacoteZip(plano);
const baixarArquivo = criarDownloadFlow(Flow); // ZIP permanece sem confirmação.
const resultado = await baixarExportacao(plano, { baixarArquivo, modo: 'projeto' });
```

- `plano.projetoJson`: JSON completo para reabrir, sem alterar o projeto original.
  Preserva base64, campos desconhecidos, IDs, status e metadados. Remove somente os campos
  legados de ZIP embutido na raiz (`zipArchiveBase64`, `zipBase64`).
- `plano.arquivos`: entradas `{ caminho, mimeType, bytes, categoria, cenaIndices }`.
  O pacote contém manifesto, roteiro, falas gerais e por personagem, prompts e pendências.
  Cada mídia aparece em um arquivo; conteúdos idênticos são comparados byte a byte e têm
  seus vários usos registrados no manifesto. Referências de personagens e cenários entram também.
- `plano.manifesto`: mantém os dados do projeto e substitui cada base64 por um caminho.
  Não serve para reabrir o projeto no editor; o JSON completo separado cumpre essa função.
- `criarPacoteZip(plano, { cenaIndex?, limiteBytes? })`: ZIP real em `Uint8Array`.
  O ZIP usa STORE, CRC32 e nomes UTF-8. Não inclui o JSON completo nem outro ZIP.
- `arquivosDoPacote(plano, { cenaIndex? })`: entradas para download individual. Em uma cena,
  seleciona as mídias da cena e os ativos compartilhados. Roteiro, falas e prompts permanecem
  documentos globais; manifesto e pendências são filtrados para a cena selecionada.
- `listarPacotesPorCena(plano)`: nomes e índices de cada pacote, sem alocar vários ZIPs juntos.
- `baixarExportacao(plano, { baixarArquivo, modo, incluirProjeto?, cenaIndex?, onProgress?, signal? })`:
  modos `projeto`, `zip`, `cenas` e `arquivos`. Download sequencial, cancelamento entre arquivos,
  continuação após erros parciais e relatório explícito. ZIP sem capacidade confirmada não é enviado.
- O adaptador recebe `{ filename, mimeType, bytes }`. Sua propriedade `suportaZip` deve ser
  explicitamente verdadeira para exportar ZIP. `criarDownloadFlow(Flow, { suportaZip: true })`
  só deve ser usado após validar essa capacidade na versão real do SDK. O adaptador direto
  `criarDownloadNavegador()` oferece Blob/download quando o ambiente permitir.

`status: 'solicitado'` significa que o transporte aceitou a solicitação; não comprova gravação
no disco. `parcial`, `falhou`, `cancelado` e `indisponivel` incluem detalhes para a interface.
O fallback nunca dispara dezenas de downloads automaticamente. A interface permite escolher
pacotes por cena ou arquivos individuais e informa as falhas.

Limites: ZIP32, até 65.535 entradas e 512 MiB por pacote por padrão; sem streaming e sem ZIP64.
O limite evita alocar um ZIP grande; a leitura do JSON e a extração das mídias ainda usam memória.
Aumentar o limite depende da memória disponível. SRT é opcional e começa desligado; seus tempos
seguem a duração planejada, sem promessa de sincronização com áudio ou duração de vídeo real.
Sem montadores ou prompts salvos, o log identifica a ausência e exporta a direção do storyboard.

Verificação local sem geração de mídia:

```powershell
node --test ferramentas/estudio-novelas/test/exportacao.test.mjs
# Opcional: apontar EXPORTACAO_PYTHON para um Python 3 permite validar o ZIP via zipfile/zlib.
```

Os testes usam o backup real da produção Rosa, conferem preservação, hashes das oito mídias,
deduplicação, erros parciais, variantes de MIME, caminhos, falas, SRT e bloqueio de ZIP não confirmado.
