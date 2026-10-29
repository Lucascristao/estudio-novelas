# Núcleo de roteiro

ES modules sem dependência de navegador. Construir o serviço, importar, editar texto, sincronizar e trocar defaults não fazem chamadas. Somente as cinco ações de IA abaixo usam o método `sdk.generate.text(prompt, { systemInstruction })` injetado; não há acesso a geração de mídia, upload ou download. Não existe retry automático, personagem sintético nem fala de fallback.

```js
import { createNarrativeService } from './roteiro/index.js';

const narrative = createNarrativeService({
  sdk: Flow,
  project: projetoSanjaCompleto,
  onChange(project, event) { /* guardar novo estado / autosave */ },
  onProgress(status) { /* running, completed ou error */ },
});

const ideas = await narrative.suggestIdeas({ theme: 'Uma injustiça na pousada', count: 4 });
await narrative.generateStory({ idea: ideas[0], replace: true });
await narrative.convertScript(textoCompleto, { replace: true });
await narrative.continueEpisode({ directive: 'Retomar a última revelação' });
await narrative.shortenDialogue('shot_12', { syncText: true });
```

## API pública

| Método | Efeito |
| --- | --- |
| `suggestIdeas({theme, settings, count=4})` | Retorna um array validado de ideias. Não troca título, configurações ou bíblia. Count entre 1 e 20. |
| `generateStory({idea, theme, settings, replace=false})` | Duas chamadas: fundação e decupagem. Só publica o projeto quando ambas forem válidas; nenhuma base parcial substitui o original. Exige `replace:true` para substituir trabalho existente. |
| `convertScript(rawScript, {settings, replace=false})` | Envia o texto **inteiro**, sem cortar em 3.000 caracteres. Guarda o original exato em `sourceScriptText`, valida a bíblia e deriva `scriptText` do storyboard. Exige replace para substituir tomadas existentes. |
| `continueEpisode({directive, settings, finalEpisode, allowNewAssets=false})` | Usa todas as cenas/falas anteriores, fichas, roupas e vozes como contexto. Incrementa episódio apenas no commit válido; mantém catálogos locais intactos e salva episódio anterior em `episodeHistory`. Parte 3 fecha a história por padrão; `finalEpisode` pode sobrepor essa decisão. |
| `shortenDialogue(shotId, {syncText=false})` | Altera só `dialogueLine` da tomada identificada, com limite de palavras. Preserva todos os outros campos, incluindo mídia, duração e aprovação. Retorna o projeto; não só a fala. |
| `updateShot(shotId, patch, {syncText=false})` | Editor por ID estável; valida projeto. Não muda o ID. Marca o texto como stale quando houver divergência, ou recalcula com syncText. |
| `editScriptText(text)` | Guarda edição livre e calcula se está ou não igual ao storyboard. Não reconverte automaticamente. |
| `syncScriptText()` | Substitui texto pelo render do storyboard atual e marca synced. |
| `setDefaultVideoModel(model, {resolution, durationSeconds})` | Só altera defaults de novas tomadas; ajusta os defaults incompatíveis se não foram explicitados. Todas as tomadas existentes e suas durações/modelos/resoluções/mídias permanecem intactas. |
| `setProject(project)` | Valida e troca projeto; respostas pendentes não podem substituir o novo projeto. |

Operações de edição retornam projeto imediatamente; operações de IA retornam Promise. A instância também expõe `project`, `status`, `scriptStatus` e `observerErrors`. Trate `project` como somente leitura; use os mutadores ou `setProject` para que proteção de revisão e sincronização funcionem. Callbacks de observação que falham não transformam uma geração concluída em erro do serviço.

Exportações puras: `renderScriptText`, `scriptSynchronization`, `parseAiJson`, `countWords`, `dialogueLimit`, `dialogueBudget`, `WORD_LIMITS_BY_DURATION`, `NarrativeError`; também `NarrativeService` e sua factory.

## Integridade e erros

- Usa `importProject` e `validateProject` de `../projeto/index.js`, mantendo formato Sanja 3.0 e propriedades desconhecidas. Erros de vínculos retornam questões em `error.issues`.
- `scriptText` é uma representação do storyboard. O estado `scriptSync` é derivado por comparação real (`synced` ou `stale`); um badge importado não é confiado. O original autoral fica separado em `sourceScriptText`.
- Continuação conserva IDs, fotos/base64, mediaIds, figurinos, perfis de voz, cenários e campos desconhecidos das fichas, mesmo se a IA sugerir mudanças. A IA recebe somente o canon narrativo/de identidade; fotos, vídeos e IDs de mídia não são enviados no prompt. Novas cenas não podem inventar mídia. Novos personagens/cenários precisam de `allowNewAssets:true`; não podem reutilizar nome existente com outro ID.
- `episodeHistory` contém snapshots dos episódios anteriores com suas mídias, para não perder trabalho ao avançar. IDs novos que colidem com episódios anteriores ganham prefixo `epN_`. O projeto de cada episódio pode ser exportado antes de continuar. O histórico ocupa espaço; a camada de exportação pode oferecer exportação do episódio atual ou do histórico deliberadamente.
- Só uma operação de texto fica ativa. Outra retorna `BUSY` antes de chamar o SDK. Edições durante uma geração invalidam seu commit com `STALE_PROJECT`. Encurtamento admite edições não relacionadas e aplica a fala ao estado mais recente; mudança na própria fala/direção ou troca do projeto rejeita o resultado antigo.
- Falha de SDK, parse, esquema ou limites produz `NarrativeError` com `code`, `recoverable:true`, `operation` e mensagem em PT-BR. O projeto anterior é preservado; a UI pode mostrar diagnóstico e oferecer nova tentativa explícita. JSON malformado pode fornecer `rawResponse` para inspeção. Não registrar automaticamente resposta bruta, tokens ou conteúdo base64.
- Limites preservados da original: 4s/9 palavras, 6s/14, 8s/18, 10s/23. A IA deve dividir falas longas ao converter/criar; o núcleo rejeita o excesso em vez de truncar. Encurtar também rejeita resposta maior que a fala original.
- Converter envia todo o texto; isso não prova que um modelo remoto consiga atender qualquer tamanho. Se o serviço recusar contexto, o erro é recuperável e o original permanece íntegro. Não há resumo silencioso nem remoção do fim.

Testes locais, sem navegador ou chamadas reais:

```powershell
node --test ferramentas/estudio-novelas/test/roteiro.test.js
```
