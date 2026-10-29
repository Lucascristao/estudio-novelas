# Código recuperado da ferramenta compartilhada

Este é o JavaScript do cliente que veio incorporado no log fornecido pelo usuário. Não é acesso ao repositório original, ao servidor do Google ou às credenciais do autor. Não foi executado localmente.

A compilação preservou nomes de componentes e serviços; comentários virtual identificam a origem dos trechos. Os tipos TypeScript e a organização original em arquivos não foram recuperados.

O aplicativo importa react, react/jsx-runtime, jszip e flow-sdk. O Flow SDK depende do ambiente interno do Google Flow; esse aplicativo não passa a gerar mídia por ser aberto como HTML local.

## Partes identificadas

- App.tsx
- components/TopPipelineNav.tsx
- components/SanjaLogo.tsx
- components/ScriptEditorStep.tsx
- constants.ts
- services/narrativeEngine.ts
- components/AssetManagerStep.tsx
- services/promptAssembler.ts
- components/StoryboardStep.tsx
- services/storyboardQueue.ts
- components/AnimationStep.tsx
- services/videoQueue.ts
- components/ExportStep.tsx
- services/srtGenerator.ts
- components/AboutModal.tsx

## Problemas observados

- Retirada automática das referências em caso de falha, inclusive erro genérico do serviço.
- Fila de imagens com duas chamadas simultâneas e repetição após 1200 ms.
- Fotos incorporadas importadas sem mediaId não são registradas antes de montar o pedido de imagem.
- Estado de geração individual baseado em uma captura do projeto, com risco de perder alterações concorrentes.
- Mensagem genérica do host sem dados suficientes para determinar a causa externa.
- Prompt de cenário mistura ambiente com personagens e encenação.

SHA-256 do arquivo recuperado: 087836ba8c4ad96f7505350613af0af5629eabe0b81f085f01fbe31b934646bc
