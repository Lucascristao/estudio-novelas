# Inventário funcional da ferramenta original — Sanja Dark Studio

Auditoria estática de `referencia/App.recuperado.js` (4.978 linhas), realizada em 28/10/2026. Foram lidos também `AGENTS.md`, `CLAUDE.md`, `producoes/NOVELAS.md`, o README e a matriz PARIDADE deste diretório. Não houve execução no navegador nem geração de mídia. Nomes de modelos, preços e capacidades abaixo são constantes da original, **não uma verificação do catálogo atual do Flow**.

O requisito de destino é uma versão própria **dentro do Google Flow**, mantendo os dados Sanja existentes e as funções úteis, com UX/UI e exportação melhores. Não confundir a existência de um botão, de um campo no JSON ou de uma função com funcionamento comprovado no serviço real.

As referências `L123` indicam linhas do JavaScript recuperado. O inventário separa controles existentes de dados consumidos sem editor, para não prometer como paridade uma função que a original apenas insinua.

## 1. Estrutura, navegação e persistência

Fontes: navegação L126–231; aplicação L4835–4978.

| Elemento | Comportamento original e detalhes a preservar |
| --- | --- |
| Cabeçalho fixo | Marca Sanja Dark Studio, cinco etapas clicáveis, Abrir, Salvar e Sobre. Ícones Material Symbols e tema escuro com destaque âmbar. Layout quebra em telas menores; navegação tem rolagem horizontal. |
| Etapas | `script`, `assets`, `storyboard`, `animation`, `export`. Qualquer uma pode ser aberta pelo cabeçalho sem validação de pré-requisitos. |
| Contadores | Ativos mostra **quantidade de personagens**, não personagens + locações. Storyboard mostra total de tomadas, apesar do nome interno `sceneCount`. Animação mostra tomadas com `generatedVideoBase64`. Badges só aparecem quando maiores que zero. |
| Abrir | Input de arquivo oculto, aceita `.json`, lê texto com FileReader, chama o loader e limpa o input para permitir escolher o mesmo arquivo novamente. Não mostra progresso, validação, confirmação ou resultado ao usuário. |
| Salvar no cabeçalho | Sempre disponível, inclusive com projeto vazio. Cria JSON completo versão 3.0 e usa `Flow.download`; sem spinner, captura de erro ou confirmação visual. |
| Estado global | Apenas memória React: `currentStep`, título, texto, `storyBible`, configurações e modal Sobre. Não existe autosave, IndexedDB, localStorage, recuperação pós-reload, histórico, desfazer ou proteção ao sair. |
| Estado por etapa | Estados locais desaparecem quando a etapa é desmontada: ideias sugeridas, modo IA/autoral, resposta bruta, erros, fila/ref local, aba de ativos, monitor selecionado etc. Promessas já iniciadas não são canceladas ao navegar. |
| Voltar/avançar | Botões nos rodapés. Roteiro só exige texto não vazio para avançar. Ativos não exige referências prontas. Storyboard exige uma bíblia com ao menos uma cena, não exige imagens. Animação permite ir à exportação sem vídeos. Cabeçalho contorna todos esses bloqueios. |
| Sobre/manual | Modal com cinco explicações: suíte/modelos, roteiro autoral/IA em duas fases, capacidades de duração/resolução, timeline/aprovação e exportação/SRT. Fecha por X ou “Entrar no Sanja Dark Studio”. Não há tratamento explícito de Escape, clique no fundo, foco inicial ou contenção de foco. |

### Dependências reais

- Imports: `react`, `react/jsx-runtime`, `flow-sdk`, `jszip`. `Flow.generate.text`, `.image`, `.video`, `Flow.media.select`, `Flow.upload` e `Flow.download` dependem do ambiente interno do Flow.
- APIs do navegador: FileReader, TextEncoder, `btoa`, `navigator.clipboard`, timers e renderização de imagens/vídeos com data URLs.
- Não há servidor próprio, banco de dados, biblioteca de montagem de vídeo, renderização de filme final ou integração com editor no código recuperado.
- Recursos gerados ficam embutidos em base64 na bíblia e também possuem IDs do Flow. Um ID guardado no JSON não prova que continue válido no projeto/sessão do Flow atual.

## 2. Configurações, catálogos e valores iniciais

Fontes: constantes L238–454; defaults L4841–4861.

| Campo | Padrão / catálogo / presença de editor |
| --- | --- |
| `language` | Português (Brasil); sem editor; os prompts de fala usam PT-BR fixo. |
| `aspectRatio` | 9:16; botões 9:16 e 16:9. Ficha de personagem sempre usa 3:4. |
| `durationMinutes` | 1; botões 1, 2, 3, 5 minutos. Não existe opção 4 minutos na UI original. |
| `secondsPerShot` | 6; botões 4, 6, 8, 10, desabilitados quando incompatíveis com o modelo. |
| `style` | Cinematográfico Ultra-Realista; também Anime Contemporâneo, Cyberpunk Neon, Fantasia Sombria, Aquarela Expressiva, Vintage 35mm Retrô, Animação 3D Pixar Style e Ficção Científica Hiper-detalhada. |
| `cameraTone` | Dramático com Cortes Alternados; armazenado, sem editor e sem uso nos montadores de prompt. |
| `nicheTheme` | Vazio; input de tema/premissa. |
| `selectedDramaGenre` | Drama Familiar; oito cartões de gênero descritos abaixo. |
| `storyRealism` | `real`; cartões `real` e `ficticia`. |
| `contextDirectives` | Continuidade estrita entre tomadas/diálogos; armazenado, sem editor e não interpolado nos geradores. |
| `keywords` | Herança, dívida de honra, irmãos rivais, perdão tardio e segredo de família. Trocar gênero substitui a lista inteira pelos defaults daquele gênero. |
| `narrativeStructure` | Parábola de contraste; outras: Ascensão e queda, Vingança e virada, Segredo revelado, Injustiça e recompensa, Mistério, Romance proibido, Superação e Personalizada. “Personalizada” não abre campo extra. |
| `productionType` | `single`; não há seletor na UI. Só um JSON com `series` revela episódio e botão de próxima parte. |
| `storyTone` | Dramático; sem editor, usado ao sugerir ideias. |
| `hasNarrator` | `false`; armazenado, sem editor e não controla geração. |
| `currentEpisode` | 1; sem editor, condicional de série. |
| `defaultVideoModel` | Omni 1.1 Flash; quatro modelos disponíveis nas constantes. |
| `defaultResolution` | 360p; botões 360p Rascunho e 720p Final, conforme capacidade. |

### Modelos e estimativas codificadas

| Modelo | Durações | Resoluções | Créditos codificados |
| --- | --- | --- | --- |
| Omni 1.1 Flash | 4, 6, 8, 10s | 360p e 720p | 4s: 4/7; 6s: 5/10; 8s: 6/12; 10s: 7/15 (360p/720p). |
| Veo 3.1 - Lite | 8s | 720p | 10. |
| Veo 3.1 - Fast | 8s | 720p | 20. |
| Veo 3.1 - Quality | 8s | 720p | 100. |

Os cartões mostram nome, badge de posicionamento, descrição, durações e resoluções. `calculateShotCredits` tem fallback para Omni/modelo desconhecido, tenta preço 720p ao pedir 360p incompatível e por fim retorna 7. Isso pode mascarar configuração inválida. Limites de palavras: 4s → 9; 6s → 14; 8s → 18; 10s → 23.

O catálogo adicional `CATEGORIES`/`SUBGENRES_BY_CATEGORY` contém oito categorias e 32 subgêneros. Não há editor para eles. `selectedSubgenre` fica sempre no primeiro valor inicial (“Conflito de Gerações”) e é colocado no pedido de ideias mesmo quando o gênero escolhido é outro.

## 3. Tela 1 — Roteiro e criação narrativa

Fontes: serviços L457–1110; componente L1114–2045.

### Campos, indicadores e ações visíveis

| Grupo | Controles e condicionais |
| --- | --- |
| Modo | “Criar com IA” / “Meu Roteiro”. Alternar só muda a seção de ações, mantendo natureza, gênero, configurações, título e texto. |
| Natureza | Cartões História Real (Baseada em Fatos) e História Fictícia (Criativa/Autoral), descrição e badge Ativo. |
| Gênero | Drama Familiar; Drama Psicológico; Melodrama / Novela; Drama Policial & Investigativo; Drama de Época / Histórico; Drama Social & Superação; Tragédia e Consequência; Romance Dramático. Cada cartão mostra dois exemplos de palavras-chave; a seleção mostra explicação completa. |
| Palavras-chave | Chips `#palavra`, X individual, input “Nova palavra-chave”, adicionar por + ou Enter. Trim, minúsculas, ignora vazio e duplicata exata. Sem limite. Trocar gênero elimina personalizações anteriores sem confirmação. |
| Modelo/capacidades | Quatro cartões e estimativa total de créditos. Trocar modelo adapta duração e resolução globais e **reescreve todas as tomadas já existentes** com nova duração/modelo/resolução. Sem confirmação. |
| Planejamento | Tema/premissa específica, estrutura narrativa, formato, duração por tomada, qualidade sugerida, duração alvo, estilo visual. Alterar duração/qualidade isoladamente só altera defaults; trocar modelo, ao contrário, altera tomadas existentes. |
| IA | “Sugerir Ideias” pede quatro; spinner “Sugerindo...”. Bloqueado durante sugestão ou workflow de história. “Criar Roteiro Completo” bloqueado durante workflow, mas não durante sugestão/conversão autoral. Pode gerar sem ideia selecionada ou título. |
| Ideias | Grade de cartões com título, real/fictícia, estrutura, premissa, gancho 3s, marca Selecionada e botão “Escrever História com base nesta Ideia”. Clicar no cartão muda título, tema, estrutura e natureza. Botão para escrever impede propagação do clique. Há uma terceira ação redundante na faixa “Ideia Ativa”. |
| Andamento do roteiro | `idle`, `foundation`, `shots`; textos “1/2 Gerando Base & Bíblia...” e “2/2 Gerando Tomadas...”, inclusive no cartão em trabalho. Sem porcentagem, cancelamento ou salvamento intermediário da base. |
| Autoral | Instrução para colar texto e “Converter Roteiro em Ativos”, bloqueado quando vazio ou convertendo. Spinner “Convertendo...”. Usa o mesmo texto editável abaixo. |
| Título | Input editável “Título da Produção”; independente de `storyBible.title`. |
| Métricas | Duração real = soma de `durationSeconds`; antes da bíblia, mostra duração planejada. Total de tomadas real ou estimado. Contagem de palavras do texto. Estimativa de créditos do roteiro usa total de tomadas × custo do **default**, não soma dos ajustes individuais. |
| Bíblia ativa | Se existe, mostra natureza, números de personagens/locações/cenas, gancho 3s, conflito central rotulado “10s”, final/tipo e frase de impacto opcional. Somente leitura. |
| Série | Apenas se `productionType === 'series'`: badge de episódio e “Criar Parte N+1”. A bíblia precisa existir para a ação da próxima parte aparecer. |
| Texto | Textarea de 12 linhas, fonte mono, redimensionável, editável em ambos os modos. A legenda afirma “Sincronizado com a Story Bible” sempre que há bíblia; editar o texto não a atualiza. |
| Erro | Faixa com mensagem, “Ver resposta da IA” se houver resposta guardada e “Tentar de novo”. Este último sempre chama o workflow de história, mesmo que o erro tenha sido na sugestão ou conversão. Não há dispensar erro. |
| Diagnóstico | Modal de resposta bruta da IA, textarea somente leitura, X e Fechar. Guarda só a resposta mais recente. Sem copiar, download ou histórico. |
| Avançar | “Avançar para Ativos e Visuais”, habilitado por texto não vazio, mesmo sem conversão/bíblia. |

### Fluxo de IA e transformação dos dados

1. **Sugestão:** uma chamada `Flow.generate.text`; pede quatro objetos com `id`, `title`, `premise`, `category`, `subgenre`, `storyRealism`, `structure`, `hook`. Aceita o parse sem validar que seja array; seleciona a primeira ideia e troca título. A lista é local e não é salva no projeto.
2. **Base/bíblia:** pede título, logline, natureza, estrutura, gancho, conflito, final, fichas de personagens, locações e atos. O parâmetro `continuationFromBible` é recebido mas nunca usado. Configuração de continuidade, duração, narrador, episódio e vários outros defaults não entram nessa base.
3. **Decupagem:** apesar do nome `generateShotsInBatches`, faz uma única chamada para todas as tomadas. Calcula `max(4, ceil(max(30, minutos*60)/segundosPorTomada))`. Solicita gancho na primeira, resposta causal entre tomadas e limite de palavras. Disponibiliza apenas a primeira locação no prompt. Não valida quantidade, duração, tamanho das falas, IDs ou coerência retornados.
4. Normaliza objetos de tomada, acrescenta `wardrobeMap`, resolve falante por nome se possível, inicializa status de imagem/vídeo. Divide em cenas de três tomadas e atribui atos por terços. Títulos/objetivos/cause/consequence das cenas são preenchidos mecanicamente. Não existe editor de cenas.
5. Só ao fim troca a bíblia completa e renderiza o texto do roteiro, substituindo o projeto anterior e suas mídias sem confirmação ou snapshot.
6. `callAiWithStrictJsonRetry` tenta duas vezes em erro de serviço, vazio ou parse. Remove cercas Markdown, normaliza aspas, escapa quebras dentro de strings, remove vírgulas finais e tenta extrair objetos/arrays. Não repara chaves sem aspas nem valida o esquema.
7. Se a base falhar, usa silenciosamente personagens sintéticos Carlos Mendes e Roberto Valente, ambientes e final genéricos. Se as tomadas falharem, gera repetição de ações/falas fixas. A UI pode terminar como sucesso apesar de a história solicitada não ter sido escrita.
8. **Conversão autoral:** envia somente os primeiros **3.000 caracteres**, pede uma bíblia com cenas, normaliza apenas a fundação e aceita `parsed.scenes` sem normalizar suas tomadas. Depois substitui texto/bíblia/título. Não informa truncamento. Perde propriedades não reconhecidas da fundação.
9. **Texto renderizado:** título, natureza, logline, estrutura/final, gancho, conflito, personagens, locações, cenas/objetivos, tomadas com duração/plano/câmera/ação/fala/SFX e conclusão/frase final. Não é regenerado após edições em ativos, storyboard ou timeline.

## 4. Tela 2 — Ativos e visuais

Fontes: prompt assembler L2052–2128; componente L2132–2942.

### Comportamento geral

- Abas “Personagens (N)” e “Locações & Cenários (N)”; a aba inicial é personagens. Modelo de imagem fixo `🍌 Nano Banana Pro`, sem seletor.
- “Novo Personagem” ou “Nova Locação” conforme aba; “Gerar Faltantes (N)” aparece apenas quando faltam base64 de fichas/locações. O contador não considera se os IDs estão ativos.
- Lote percorre sequencialmente personagens sem ficha e depois locações sem imagem. Mostra apenas “Gerando...”, sem barra/contador/cancelamento/relatório de erros. Continua após falhas porque os handlers as capturam.
- Sucesso em faixa verde temporária (3,5s), erro em faixa vermelha com Fechar. Erro da ficha inclui mensagem; erros de foto/locação são genéricos.
- Ao entrar sem bíblia, ou com personagens **e** locações vazios, um efeito injeta automaticamente dois personagens e duas locações de exemplo. Preserva algumas propriedades/cenas, mas não espalha todos os dados prévios. Não interpreta `scriptText`, apesar de receber esse prop.
- Voltar ao Roteiro e Avançar para Storyboard sempre habilitados. Ausência de personagem mostra estado vazio com “Adicionar Personagem”; não há equivalente dedicado para locações vazias.

### Cartão de personagem

| Elemento | Detalhe |
| --- | --- |
| Identidade | Nome, papel, idade, ID e arquétipo **somente leitura**. Novo cadastro nasce com nome automático “Personagem N”, idade 28, papel supporting, arquétipo Aliado e ficha textual genérica. Não existe renomear pela UI original. |
| Ficha | Preview 3:4; placeholder “Folha de Corpo Inteiro”; overlay de geração; badge de mediaId ativo; badge “Foto Adaptada” se `userUploaded`. |
| Gerar Folha / Regenerar | Uma imagem em corpo inteiro, vista frontal, pose neutra, fundo cinza de estúdio, identidade física e figurino padrão. Persiste base64, MIME e `referenceMediaId`; status pending → generating → completed/error. Regenerar não usa foto anterior como referência nem pede confirmação. |
| Foto | Abre galeria do Flow (`Flow.media.select({filter:'image'})`), seleciona `mediaId` e **imediatamente gera uma imagem adaptada** 3:4. Não é simples importação de foto, não tem confirmação intermediária e não guarda o base64 da foto original. Persiste ficha adaptada, ID gerado, `userUploadedPhotoMediaId`, `userUploaded:true`. |
| Traços editáveis | Rosto, cabelo, barba e porte/compleição: inputs de texto. Alterar não regenera nem sinaliza referência desatualizada. |
| Voz | Apenas sotaque e timbre são editáveis. Gênero, faixa etária e ritmo existem no perfil e são usados no vídeo, sem controles. Não há áudio, voz clonada, seletor de locutor ou preview de voz. |
| Figurinos | Lista de nome, ID somente leitura e descrição; “Adicionar Figurino” cria ID timestamp, nome sequencial e roupa genérica. Não há excluir, ordenar, marcar padrão ou selecionar figurino por tomada. O `defaultWardrobeId` é consumido e preservado, mas não editável. |
| Campos sem editor | `fixedVisualPrompt`, personalidade, nome/idade/papel/arquétipo e demais partes do voiceProfile. Não há excluir personagem, duplicar, imagem ampliada ou download individual. |

O gerador de ficha faz corpo inteiro frontal, **não uma prancha de quatro vistas**. O código guarda uma imagem de referência por personagem, não uma por figurino. `handleGenerateCharacterSheet` bloqueia outro handler de ficha por `generatingSheetId`, mas o botão Foto não tem o mesmo guard global e as gerações de locação têm bloqueio separado.

### Cartão de locação

- Nome editável; ID e horário somente leitura. Preview em caixa visual 16:9 mesmo quando a mídia é gerada em 9:16; `object-cover` recorta a imagem para preencher a caixa, ocultando parte de uma referência vertical.
- Gerar Imagem/Regenerar, spinner e overlay; persiste `generatedImageBase64`, `generatedMimeType`, `mediaId`, `status`.
- Editores: `fixedDescription` (textarea de duas linhas) e `lightingPalette` (input). `atmosphere` e `timeOfDay` são usados na geração sem editor.
- Prompt contém nome, descrição fixa, luz, atmosfera e horário, arquitetura/natureza e proibição de logos/billboards. **Não proíbe pessoas, mãos, partes do corpo ou reflexos humanos.** Conteúdo inadequado desses campos é repassado integralmente.
- Novo cadastro tem nome automático e ambiente genérico. Não há excluir, foto/galeria de locação, download individual ou confirmação ao substituir imagem.

## 5. Tela 3 — Storyboard por tomada

Fontes: fila L2950–3040; componente L3044–3700.

### Visão geral, cenas e progresso

- Cabeçalho com proporção, quadros prontos/total e “Gerar Quadros Faltantes (N)”. Faltante significa ausência de `generatedImageBase64`; não valida mídia, ID ou status.
- Durante lote, ação vira “Cancelar Fila (concluídas/total)”, barra percentual e descrição de duas gerações concorrentes com fallback automático. Contador avança **só em sucesso**, não em falha.
- Sucesso temporário (3–4s); erro geral dispensável com Fechar. Fim de fila usa “finalizada (sucessos/total)”, sem lista consolidada de falhas.
- Se não há bíblia/cenas, estado vazio “Nenhuma tomada estruturada...” e “Voltar e Gerar Roteiro”. Esse botão usa `onBack`, que leva a **Ativos**, não diretamente ao roteiro.
- Cena mostra número preenchido com zero, ato, título e quantidade de tomadas, todos sem edição. Não mostra objetivo/cause/consequence, não permite adicionar/remover/duplicar cenas ou tomadas.

### Controles por tomada

| Controle / informação | Comportamento exato |
| --- | --- |
| Identificação | Número local dentro da cena, duração, plano e câmera. Não mostra um número global consistente entre todas as telas. |
| Continuidade | Checkbox “Continuar plano da anterior” apenas a partir da segunda tomada **da mesma cena**. Salva `isContinuationOfPrevious`. Não atravessa a fronteira entre cenas. |
| Enviar Imagem | Seleciona imagem da galeria do Flow; exige `base64`; substitui quadro/MIME/imageMediaId, marca completed, limpa lastError. Não é seletor de arquivo local independente. |
| Gerar Quadro / Regenerar | Gera quadro individual com prompt e referências; disabled só para a própria tomada em geração. Overlay “Gerando Quadro...”. Sem confirmação de substituição. |
| Forçar sem referências | Só aparece se `imageStatus === 'error'`; chama geração individual com lista de referências vazia. A tentativa automática anterior já pode ter gerado sem referências. |
| Preview | Imagem no formato global; placeholder “1º Frame Pendente”; erro abreviado com `title` completo se não há imagem; badge de imageMediaId. Com imagem antiga e erro novo, o quadro antigo permanece e o erro não aparece nesse placeholder. |
| Ação visual | Input de texto único para `visualAction`. Não há separação de quadro inicial estático e ação animada. |
| Falante | Select de todos os personagens ou “(Sem fala / Ação)”; tenta atualizar `speakerCharacterId` e `speakerName` em duas chamadas. Selecionar sem fala não limpa `dialogueLine`. Não filtra pelo elenco presente. |
| Fala | Input PT-BR; contador palavras/limite conforme duração; cor de excesso. Não impede gerar imagem/vídeo com excesso. |
| Encurtar | Só aparece quando excede o limite. Chama texto IA com fala, duração, falante e ação; spinner por shotId. Remove aspas do retorno e substitui a fala sem revisão ou desfazer. Não valida o novo limite. |
| Modelo de vídeo | Select com os quatro modelos. Muda `videoModel` e, se necessário, duração para primeiro valor suportado. Não corrige a resolução incompatível. |
| Resolução alvo | Select das resoluções suportadas pelo modelo, `videoResolution` ou default. Um valor herdado inválido pode ficar sem opção correspondente. |
| Custo | Estimativa da tomada para modelo/duração/resolução atuais. |
| Plano | Select: Plano Geral (Wide), Plano Médio (Medium), Primeiro Plano (Close-up), Plano Detalhe (Extreme Close-up), Plano Sequência Aéreo. |
| Câmera | Select: Estático, Panorâmica Lenta, Dolly In / Zoom Suave, Travelling Lateral, Câmera na Mão / Dinâmico. |
| Emoção | Input de texto. |
| Ausências de editor | Não há duração direta, locação, elenco presente, figurino por personagem, `voiceTone`, `sfxAmbience`, `transition`, prompt final, imageMediaId ou status manual. Esses campos são dados de importação/geração, não controles existentes. |

### Referências e prompt de imagem

- Usa locação por `locationId`, com descrição/atmosfera/luz/horário, e seu `mediaId`.
- Para cada `characterId` presente: nome, idade, porte, rosto, cabelo, barba, identidade fixa, figurino escolhido por `wardrobeMap` ou padrão/primeiro e proibição de logos.
- Referência do personagem = `referenceMediaId` ou, na falta, `userUploadedPhotoMediaId`. **Base64 importado sem ID é ignorado**, sem upload preparatório.
- Acrescenta plano, movimento de câmera, `visualAction`, foco no falante por ID/emoção e estilo. Não usa o texto da fala no prompt da imagem.
- Limita às primeiras cinco referências, com a locação antes dos personagens; não informa quais ficaram de fora. Não há resolução de prioridade para elenco numeroso.
- Na geração **individual** de continuação, acrescenta `imageMediaId` anterior no início e direção de continuidade, truncando a cinco. Na fila em lote não aplica essa regra.
- Individual: em qualquer exceção da primeira chamada, repete imediatamente sem referências. Se a primeira retornar objeto sem base64, o erro é lançado depois desse bloco e não ocorre esse fallback interno. Lote: até duas tentativas com 1,2s; só primeira usa referências.

## 6. Tela 4 — Animação e timeline

Fontes: fila L3707–3828; componente L3832–4448.

### Visão geral e timeline

- Cabeçalho com vídeos prontos/total, tomadas aprovadas e soma das durações planejadas. Recomenda rascunho 360p seguido de aprovadas em 720p.
- “Animar Todas as Tomadas” só bloqueia quando não há tomadas. Abre confirmação; **inclui vídeos já existentes e tomadas sem quadro**. Não existe ação “animar apenas faltantes”.
- “Regerar N Aprovadas (720p)” só aparece com ao menos uma `isApproved`. Aprovação não exige vídeo nem quadro; lote pode conter tomadas sem primeiro frame.
- Durante fila: Cancelar com contador, barra percentual e texto de concorrência 2/retry automático. Contador só soma sucessos. Mensagem de término diz “Animações concluídas com sucesso (N/total)” mesmo que existam falhas.
- Timeline horizontal com todas as tomadas por ordem das cenas: miniatura de vídeo, senão imagem, senão ícone; número global T1... e duração; check de aprovação; trecho de fala/ação; resolução declarada ou Pendente.
- Setas Mover antes/depois reordenam **apenas dentro da cena**; ficam disabled na primeira/última. Não há arrastar, cruzar cenas, faixa de tempo proporcional à duração, seleção múltipla ou reprodução contínua do filme.
- Clicar numa miniatura abre monitor. O monitor é uma cópia do objeto no estado local, não uma seleção resolvida sempre por ID; pode ficar desatualizado após gerar, reordenar ou aprovar pelo cartão.

### Monitor e cartões

| Área | Ações e estados |
| --- | --- |
| Monitor | Título com shotId, Fechar monitor, vídeo com controls/autoplay/loop ou imagem/placeholder, prompt final completo somente leitura, alternância Aprovar/Desaprovar e Copiar Prompt. |
| Cartão | Vídeo com controls/autoplay/loop, senão quadro, senão “Gere o quadro no Storyboard”. Todos os vídeos prontos recebem autoplay/loop ao mesmo tempo. |
| Geração | Overlay “Animando via MODELO...”, resolução declarada e “Lip-sync em PT-BR”. `videoStatus` generating ou comparação com animatingShotId; este estado é declarado, mas seu setter nunca é usado. |
| Dados | shotId/duração, Aprovar/Aprovada, modelo/resolução, custo, ação em até duas linhas, nome/fala ou “Sem diálogo”, `lastError` se presente. Sem editores de modelo, resolução, fala ou prompt nesta etapa; ajustes estão no storyboard. |
| Individual | Animar Ns / Regerar (resolução); disabled apenas se a própria tomada está gerando ou se não existe `generatedImageBase64`. Uma tomada apenas com imageMediaId não habilita o botão, embora a fila aceite esse ID. Não há confirmação de créditos para ação individual. |
| Copiar | Usa clipboard e feedback “Copiado!” ou ícone por 2,5s. Não aguarda/captura falha do clipboard. |
| Aprovação | Disponível no monitor e em todos os cartões, inclusive pendentes. Salva `isApproved` sem condição de mídia. Regeneração não limpa a aprovação. |

### Confirmação de lote

Modal “Confirmação de Geração de Vídeo”, modo Todas ou Aprovadas 720p; estimativa total de créditos, número de tomadas, explicação de duas simultâneas e uma repetição, Cancelar e Confirmar e Iniciar. No modo Todas, a descrição menciona apenas o **modelo global**, apesar de o custo e os pedidos usarem modelos individuais. Não lista substituições de vídeos prontos, tomadas inviáveis, custo de possível retry ou distribuição por modelo/resolução. Não trata Escape/foco.

### Pedido de vídeo e resultados

1. Resolve primeiro frame por `imageMediaId`. Se ausente e existe base64, chama `Flow.upload` com nome `Shot_ID_Frame`. Esse novo ID não é salvo de volta na tomada; futuras gerações podem reenviar o mesmo quadro.
2. Sem primeiro frame, marca erro e continua a fila. Falha de upload produz erro específico.
3. Monta prompt: estilo/luz, plano/câmera, personagens com idade/rosto/cabelo/porte/figurino, locação/descrição, `visualAction`, fala e voz PT-BR, emoção, SFX. Só o falante fala; os demais reagem; pede lip-sync. Proíbe música de fundo, legendas e texto na tela.
4. Não interpola `voiceTone`, `transition`, `contextDirectives`, `cameraTone`, `hasNarrator`, personalidade ou barba/identidade fixa no vídeo. O frame inicial é a única imagem enviada no pedido, não um conjunto explícito de fichas do elenco.
5. Ajusta resolução/duração incompatíveis para a primeira opção suportada pelo modelo, apenas na variável local. Chama `.video` com prompt, primeiro frame, modelo, proporção, duração e resolução efetivos.
6. Até duas tentativas, espera 2s entre elas, inclusive em erros genéricos/resultado ambíguo. Não consulta resultado de uma solicitação anterior.
7. Salva só `generatedVideoBase64`, MIME, `videoMediaId`, status completed e remove lastError. Não valida base64 retornado, não salva duração/resolução/modelo efetivos nem ID do upload inicial.
8. Regerar 720p substitui `generatedVideoBase64`, mas **não atualiza `videoResolution` para 720p**. Perde o rascunho anterior e pode continuar rotulando a mídia nova como 360p.

## 7. Tela 5 — Exportação e continuidade

Fontes: SRT/falas L4456–4523; exportação L4527–4762; save/load L4862–4893.

### Quatro ações visíveis

| Ação | Estado, formato e conteúdo |
| --- | --- |
| Baixar Pacote ZIP | Habilitada com qualquer bíblia; spinner “Compactando...”, depois “Baixado!” por 4s. Na realidade baixa JSON `application/json` com sufixo `_pacote_fase3.json`; contém um `zipArchiveBase64`. Sem porcentagem, cancelamento, estimativa de tamanho ou alternativa por arquivo. |
| Baixar Legendas (.SRT) | Habilitada com bíblia, estado de exportação próprio. Texto UTF-8 convertido em base64, MIME `text/plain`, arquivo `_legendas.srt`. Pode baixar SRT vazio quando não há falas. |
| Salvar Projeto JSON | Mesma função do cabeçalho, mas nesta tela bloqueada se não há bíblia. Envelope completo `_projeto_sanja.json`, MIME application/json, versão 3.0 e savedAt ISO. |
| Baixar Bíblia (JSON) | JSON puro da `storyBible`, `_story_bible.json`; spinner próprio e erro específico. Não contém envelope settings/scriptText/version/savedAt. O loader da própria ferramenta não reconhece este formato isolado. |

Erros aparecem em faixa vermelha sem Fechar. Exportações têm estados independentes e podem ser iniciadas em paralelo. Não existe ação avulsa para roteiro, prompts, falas, imagens, vídeos ou referências: os três primeiros só são incluídos no ZIP embutido e as mídias ficam no JSON/pacote.

### Conteúdo exato do ZIP interno

```text
<titulo_sanitizado>/
  STORY_BIBLE.json
  ROTEIRO_COMPLETO.txt
  FALAS_POR_PERSONAGEM.txt
  LEGENDAS.srt
  PROMPTS_GERACAO.txt
  Cena_01_Ato_1/
    S01_T01_quadro.jpg   # png somente se MIME contiver png
    S01_T01_video.mp4
    ...
  Cena_02_Ato_1/
    ...
```

- Sanitização troca caracteres fora de ASCII alfanumérico/underscore/hífen por `_`, compacta underscores e corta em 30 caracteres; exportação usa “projeto” como fallback. Acentos não são transliterados.
- Prefixos derivam de `sceneNumber` e posição atual da tomada, não do shotId. Mover tomadas muda nome/ordem de arquivos. `sceneNumber` duplicado pode colidir; não há validação nem manifesto ligando ID e nome.
- `STORY_BIBLE.json` inclui novamente as mídias em base64. Imagens/vídeos são adicionados também como arquivos separados. Fichas de personagens e locações não têm arquivos separados; permanecem dentro da bíblia.
- PROMPTS_GERACAO contém uma seção por tomada com tag Sxx_Txx, duração, prompt de imagem e de vídeo/modelo **recalculados com os dados atuais**. Não registra necessariamente o prompt usado para gerar a mídia que está sendo exportada; não inclui resolução, IDs de referências, tentativas, data, retorno ou erro.
- Só acrescenta mídia com base64 existente. Tomadas incompletas não impedem baixar o restante, mas não aparecem em relatório de faltantes.
- MIME de imagem desconhecido/WebP é renomeado jpg; vídeo é sempre nomeado mp4 sem verificar o MIME. Não há teste do arquivo final nem checksum.
- Não há vídeo final montado, trilha de áudio separada, EDL, projeto de editor ou pacote por cena.

### SRT e falas por personagem

- SRT usa início/fim de **cada tomada inteira**, não alinhamento ao áudio real. Começa em zero e soma todas as durações, inclusive tomadas sem fala ou sem vídeo. Fallback de duração = 6s. Numera só blocos com fala, mantém gaps e prefixa o nome do falante em maiúsculas quando existe.
- Formato de tempo HH:MM:SS,mmm; texto não é quebrado em linhas por legibilidade e não existe offset, velocidade de leitura, preview ou revisão de timing.
- Falas agrupam por `speakerName` ou “Narrador / Voz Off”, na ordem de primeira aparição; cada linha inclui timecode XmYs, shotId, emoção e fala. Personagens homônimos ficam agrupados juntos, porque não usa ID.
- O SRT sempre entra no pacote, mesmo quando a produção é sem texto na tela. Na versão própria deve ser opção de exportação, sem inserir legenda automaticamente no vídeo.

## 8. Contrato de dados e importação/exportação

### Envelope do projeto completo

```text
title, logline, settings, storyBible, scriptText, version:"3.0", savedAt
```

O pacote atual acrescenta `zipArchiveBase64`. O loader lê apenas `title`, `scriptText`, `settings` e `storyBible`, com testes truthy. Ignora os demais campos do envelope e quaisquer desconhecidos. Não valida versão, esquema, tipos, base64 ou vínculos. Não migra versões. Não reconhece bíblia pura, lista de tomadas ou ZIP. Um arquivo inválido só gera console.error.

Importar após um projeto preenchido pode produzir mistura: título/texto vazios não limpam os anteriores; `storyBible:null` não limpa a bíblia anterior; settings ausente mantém anterior. Settings existente substitui defaults integralmente, de modo que JSON parcial pode quebrar usos de `.keywords`, arrays e objetos aninhados. A versão própria deve normalizar sem apagar desconhecidos e apresentar erros/avisos compreensíveis.

### Campos conhecidos a preservar, ainda que sem editor na original

| Entidade | Campos observados |
| --- | --- |
| Bíblia | `title`, `logline`, `storyRealism`, `narrativeStructure`, `hook`, `centralConflict`, `ending` (`type`, `description`, `finalPunchline`), `characters`, `locations`, `acts`, `scenes`. |
| Personagem | `id`, `name`, `age`, `role`, `archetype`, `physicalTraits` (`face`, `hair`, `beard`, `physique`), `fixedVisualPrompt`, `wardrobes`, `defaultWardrobeId`, `personality`, `voiceProfile` (`gender`, `ageGroup`, `timbre`, `accent`, `rhythm`), `status`, `referenceSheetBase64`, `referenceSheetMimeType`, `referenceMediaId`, `userUploadedPhotoMediaId`, `userUploaded`. |
| Figurino | `id`, `name`, `description`. |
| Locação | `id`, `name`, `fixedDescription`, `atmosphere`, `lightingPalette`, `timeOfDay`, `status`, `generatedImageBase64`, `generatedMimeType`, `mediaId`. |
| Ato | `actNumber`, `title`, `narrativeGoal`. |
| Cena | `sceneId`, `sceneNumber`, `actNumber`, `title`, `objective`, `cause`, `consequence`, `shots`. |
| Tomada/direção | `shotId`, `durationSeconds`, `shotType`, `cameraMovement`, `locationId`, `characterIds`, `wardrobeMap`, `visualAction`, `speakerCharacterId`, `speakerName`, `dialogueLine`, `emotion`, `voiceTone`, `sfxAmbience`, `transition`, `isContinuationOfPrevious`. |
| Tomada/mídia | `imageStatus`, `videoStatus`, `generatedImageBase64`, `generatedMimeType`, `imageMediaId`, `videoModel`, `videoResolution`, `generatedVideoBase64`, `generatedVideoMimeType`, `videoMediaId`, `isApproved`, `lastError`. |

Estados usados: pending, generating, completed, error. Não há cancelled, queued, paused, unknown outcome, stale ou upload/preparação separados. `lastError` é único para imagem/vídeo, portanto uma etapa pode apagar ou mostrar erro da outra.

## 9. Defeitos concretos e riscos derivados do código

Prioridade: P0 = preservar trabalho/identidade e evitar pedidos pagos indevidos; P1 = função importante incorreta; P2 = UX/clareza e robustez. A coluna de efeito descreve consequência verificável ou risco diretamente inferido; não atribui indisponibilidade do serviço ao cliente sem evidência.

| Prioridade | Evidência | Defeito e ação necessária na versão própria |
| --- | --- | --- |
| P0 | L3132–3149; L3014–3037 | Remove referências automaticamente ao repetir erro genérico. Pode trocar identidade/locação. Preservar referências e pausar; geração sem referência deve ser escolha explícita e revisável. |
| P0 | L2955; L3712; L3792–3826 | Duas simultâneas e retry automático de mídia sem saber se o pedido anterior terminou. Uma fila única por app, estado de resultado ambíguo e sem repetição paga automática. |
| P0 | L3260; L3974; cancel/start das duas filas | Cancelar esvazia pendentes e libera UI, mas não aborta chamadas ativas; callbacks ainda podem escrever. Pode iniciar outra fila enquanto a anterior responde. Mostrar “parando após a chamada atual”, manter trava até drenar e ignorar resultados só por política explícita sem perder mídia recebida. |
| P0 | L3078; L3155; L3872–3889 | Atualizações usam captura de bíblia e índices, com cópia rasa/mutação de cenas. Importação, edição/reordenação durante a espera podem perder alterações ou gravar resultado em outra tomada. Usar IDs, atualizações funcionais e snapshot/versionamento de tarefa. |
| P0 | L3444–3477; L4358–4364; L3894 | Ações individuais só bloqueiam a própria tomada, e cada vídeo individual cria nova fila/ref. Lotes podem sobrepor-se e perder a referência de cancelamento. Bloqueio/planejador global também para ações individuais e ativos. |
| P0 | L2080–2118 | Referências base64 importadas sem mediaId são silenciosamente ignoradas na imagem. Preparação/upload explícito por identidade/hash, sem recriar rosto. |
| P0 | L4862–4893 | Sem autosave e importação/substituição sem backup/validação; erro invisível. Autosave local, snapshot pré-importação, relatório e confirmação concreta de substituição. |
| P0 | L1249–1294; L1315–1325 | Gerar história ou converter sobrescreve bíblia/mídias existentes sem aviso; nem a base intermediária é recuperável. Guardar versão anterior e separar criar novo de substituir. |
| P1 | L819–916 | Continuação ignora a bíblia recebida; não preserva elenco, contexto, cliffhanger nem mídia. Implementar continuação real com episódio/contexto e escolha de manter fichas. |
| P1 | L1302–1307 + L1259–1263 | Incremento funcional do episódio é seguido de `setSettings(effectiveSettings)` calculado da captura anterior; pode restaurar número antigo. Uma atualização atômica, passagem explícita do próximo episódio e rollback controlado se falhar. |
| P1 | L909–915; L960–982 | Fallback sintético silencioso fabrica história e falas genéricas após erro. Mostrar falha/rascunho substituto identificado; nunca apresentar como roteiro solicitado concluído. |
| P1 | L901 | Exemplo da base tem `actNumber` sem aspas no terceiro ato, contrariando “JSON puro”; sanitizador não corrige isso. Corrigir esquema/exemplo e validar saída. |
| P1 | L1023 | Conversão descarta tudo após 3.000 caracteres. Suportar texto completo/chunks com contexto e informar limites antes de substituir. |
| P1 | L1170–1196 | Trocar modelo global sobrescreve ajustes de todas as tomadas e metadados mesmo com mídia pronta. Separar default para novas tomadas de aplicar às existentes, com seleção/preview de alterações. |
| P1 | L3590–3601 | Troca de modelo por tomada corrige duração mas não resolução; chamadas consecutivas ainda usam helper com estado capturado. Validar a configuração como um único conjunto. |
| P1 | L3100–3123 vs L3000 | Continuidade individual não é aplicada pelo lote. Processar continuidade com dependência da anterior e ordenação adequada, inclusive por decisão entre cenas. |
| P1 | L3941–3972 | “Animar Todas” reprocessa prontas sem diferenciação e envia sem quadro. Preflight com prontas/faltantes/inviáveis e opção somente pendentes. |
| P1 | L3916–3923 + L3966–3971 | Final 720p não atualiza resolução; rascunho é substituído. Armazenar versões e metadados reais por geração, escolhendo qual exportar/aprovar. |
| P1 | L3781–3806 | Duração/resolução efetivas ficam locais; cronologia/SRT e custos podem divergir do vídeo. Persistir atributos efetivos e diferenciar planejamento de mídia pronta. |
| P1 | L3801–3810 | Não valida retorno de vídeo antes de completed. Exigir conteúdo/ID válidos, capturar MIME/duração real quando disponível. |
| P1 | L2024–2032; L3065; L3883 | Texto do roteiro fica separado e pode divergir da bíblia; UI afirma sincronização. Definir fonte canônica, atualização derivada e revisão quando converter texto. |
| P1 | L4630–4646 | Botão ZIP entrega JSON com ZIP base64, além de mídias duplicadas na bíblia e no ZIP. Entregar `.zip` real, manifesto sem base64 redundante, downloads por arquivo/cena e progresso. |
| P1 | L4543–4565 vs L4882–4893 | Bíblia pura exportada não pode ser reimportada pelo loader. Detectar envelope completo/bíblia pura/pacote legado e validar adequadamente. |
| P1 | L3190–3255; L3909–3938 | Progresso só mede sucessos, falhas não contam como processadas; mensagens finais sugerem sucesso total. Mostrar concluídas, falhas, pendentes/canceladas separadamente. |
| P1 | Componentes desmontados e sem cleanup | Navegar/recarregar perde gerenciamento local da fila; tarefas podem continuar sem UI. Coordenador persistente no nível do app, reconciliação e recuperação de trabalhos. |
| P1 | L2330–2356 | “Foto” seleciona e gera imediatamente; não preserva arquivo original nem valida resultado como a ficha normal. Separar selecionar/importar, adaptar opcionalmente e gerar; manter original. |
| P1 | L2126–2128 | Locação não recebe restrição de ambiente vazio e usa atmosfera potencialmente narrativa. Aplicar `NOVELAS.md` aos campos e prompt de referência, sem contaminar tomadas com a proibição de pessoas. |
| P2 | L4120; L4189–4239 | Monitor mantém cópia de tomada e aprovação pode divergir de cartão/resultado. Guardar apenas shotId selecionado e resolver estado atual. |
| P2 | L4212–4215; L4276–4279 | Vários vídeos com autoplay/loop e áudio simultâneos. Um player ativo; miniaturas leves e reprodução explícita. |
| P2 | L3994–3999 | Copiar anuncia sucesso sem aguardar clipboard. Aguardar, tratar falha e oferecer seleção manual. |
| P2 | L4609–4627 | Nomeia tipos desconhecidos como jpg/mp4 e não detecta nomes duplicados. Mapear MIME, nomes únicos e manifesto de ID/ordem/arquivo. |
| P2 | L4456–4487 | SRT se baseia em duração planejada, não fala real; sem revisão/leitura. Rotular como estimado, usar duração efetiva e permitir ajuste/exportação opcional. |
| P2 | L2146–2251 | Abrir Ativos pode inserir exemplos automaticamente, alterando projeto e perdendo campos. Estado vazio explícito e ação voluntária para exemplos. |
| P2 | L2052–2078; L4847–4857 | Campos guardados mas não usados criam expectativa falsa: voiceTone, transition, contextDirectives, cameraTone, hasNarrator. Preservar em round-trip e decidir uso/editor com clareza. |

## 10. Omissões e imprecisões do README/PARIDADE atuais

Os documentos atuais capturam direção geral e o defeito do ZIP, mas ainda não bastam como contrato de paridade ou checklist de aceite.

| Tema | O que falta tornar explícito |
| --- | --- |
| Navegação/manual | Abrir/salvar em todas as telas, badges corretos, estados vazios, voltar/avançar, ajuda contextual, comportamento de troca de etapa durante tarefa e proteção ao substituir projeto. |
| Gêneros/ideias | Catálogos completos, explicação de gênero, palavras-chave editáveis por chip/Enter, gancho/estrutura/premissa de cada ideia, seleção e geração a partir da ideia exata. |
| Configurações | Todos os defaults e campos sem editor, regras de compatibilidade modelo/duração/resolução, distinção de default/aplicar existentes, limites de fala e estimativas individuais/agregadas. |
| Série | PARIDADE lista continuação como função sem registrar que a implementação ignora a bíblia e que não existe seletor de série. A própria versão deve ter modo de série acessível, episódio, contexto e manutenção de referências. |
| Roteiro autoral | Limite/truncamento de 3.000 caracteres, validação, fonte canônica texto/bíblia, resposta bruta da IA, retries de texto e identificação de fallback sintético. |
| Ativos | “Cadastro, edição” é amplo demais: nome/idade/papel do personagem não são editáveis na original. Especificar quais campos serão editáveis na própria, foto original vs adaptação, padrão de figurino, MIME e IDs, geração faltante com preflight e fila. |
| Storyboard | PARIDADE sugere duração como controle, mas não há editor direto. Faltam elenco/locação/figurino por tomada (dados úteis já consumidos), SFX/voz/transição, IDs, ordem global, continuidade só individual, galeria como substituição e status de referências. |
| Vídeo | “Modelo/resolução por tomada” é configurado no storyboard, não no cartão de vídeo. Faltam preflight, individual sem confirmação, regeneração de prontas, custo heterogêneo, quadro importado/upload, versões 360p/720p e resolução efetiva. |
| Timeline | Restrições de reordenação por cena, seleção de tomada, monitor, aprovação/desaprovação em dois lugares, cópia de prompt e diferença entre ordem editorial e ID persistente. Não prometer montagem de filme/reprodução sequencial como função da original. |
| Cancelamento | Não é cancelamento remoto. Especificar pendentes, em curso, drenagem, recuperação pós-reload e efeito de erro/resultado ambíguo. |
| Exportação avulsa | PARIDADE lista roteiro/prompts/falas como funções, mas na original só existem no ZIP embutido. A própria deve ter ações avulsas deliberadas e checklist dos conteúdos. |
| Compatibilidade | Envelope 3.0, bíblia pura, pacote legado com zipArchiveBase64, campos desconhecidos, settings parcial, valores vazios, IDs duplicados/quebrados e MIME precisam de testes/relatório. |
| Pacote | Manifesto com IDs/ordem/metadados, referências de elenco/locação em arquivos, faltantes, opções por cena/arquivo, nomes únicos, progresso real e tamanho estimado. SRT é por duração de tomada, não alinhamento labial comprovado. |
| Limites de prova | UI funcional, preservação de dados, upload de referência, imagem e vídeo devem ter verificações separadas; nenhum nome de botão ou parse de código comprova geração real. |

## 11. Critérios recomendados para a versão própria dentro do Flow

1. **Abrir o projeto existente sem geração automática.** Reconhecer envelope/bíblia/pacote legado, mostrar resumo e preservar bytes de mídia, IDs e propriedades desconhecidas. Testar round-trip e projeto parcial. Guardar snapshot antes da troca.
2. **Recuperar referências, sem reinventar rosto.** Mostrar original, referência ativa, origem/validade e ação explícita de registrar imagens incorporadas no Flow. Upload/preparação de referência não deve chamar gerador.
3. **Uma fila global observável.** Registrar snapshot de tarefa por ID, progresso por item/etapa, retorno/erro real, mídia recebida e metadados efetivos; pausar indisponibilidade e pedidos ambíguos. Cancelar pendentes, drenar chamada ativa e preservar o resultado.
4. **Paridade editorial com controles completos.** Manter ideias, autoria, gêneros/chaves, fichas, figurinos/vozes, storyboard, modelos por tomada, timeline, aprovação, monitor e copiar. Acrescentar editor de duração, elenco, locação, figurino, áudio/voz e gestão de cenas/tomadas; marcar esses acréscimos como melhorias, não funções já existentes.
5. **Direção sem conflito.** Referências de locação explicitamente vazias conforme `NOVELAS.md`; pessoas/posição/olhar/escuta só no quadro da tomada. Preservar eixo da conversa, posições, destinatário da fala, escuta e saída para o corte, sem olhar para a lente. Separar quadro estático, movimento e direção de voz com compatibilidade para `visualAction` legado e campos reconhecidos pelo app.
6. **Configuração sem apagamento.** Defaults para novos itens separados de aplicação aos selecionados; preflight e estimativas para o conjunto real. Alterar direção não deve apagar uma mídia pronta: marcar desatualizada e manter versões.
7. **Exportação que abre diretamente.** JSON completo para continuidade; ZIP real com manifesto, roteiro, prompts usados/atuais identificados, falas, referências e mídia em arquivos, SRT opcional. Downloads individuais e por cena. Permitir prontas mesmo com pendentes e listar faltantes.
8. **UX de produção.** Terminologia clara em PT-BR, numeração global e local estável, tela de ajuda curta, erros legíveis copiáveis, confirmação concreta de substituição/regeneração paga, player único e acessibilidade de teclado/foco. Não inserir detalhes técnicos do SDK no fluxo principal sem utilidade para a decisão.
9. **Preferências da produção local.** Para novelinhas brasileiras: três partes de 2–4 minutos, um JSON por parte, drama popular brasileiro exagerado com humilhação/injustiça/reviravolta, gancho nas duas primeiras e fechamento na terceira. A UI deve aceitar 4 minutos e durações por tomada adequadas às falas, em geral cerca de 6s, com encadeamento sem pausas vazias. Esses requisitos vêm de `NOVELAS.md`, não de capacidades comprovadas da original.

O teste de aceite prioritário é importar o backup em andamento, editar sem perder as quatro fichas, dois cenários e dois quadros, salvar/reabrir e conferir o pacote real. Testes de geração de referência/imagem/vídeo são uma fase separada, somente quando autorizados, e devem conferir arquivos recebidos.
