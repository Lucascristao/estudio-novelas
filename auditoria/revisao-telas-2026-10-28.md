# Auditoria do Sanja Dark Studio — 28/10/2026

Foram navegadas as cinco etapas do aplicativo compartilhado no Flow, com o projeto da Rosa carregado. A leitura ao vivo confirmou 4 personagens, 2 cenários, 10 cenas, 30 tomadas, 176 segundos planejados, 2 quadros e nenhum vídeo. A navegação não alterou o JSON nem iniciou gerações.

Fontes: interface atual (árvore de acessibilidade, elementos e estilos calculados), capturas enviadas pelo usuário e JavaScript de cliente recuperado do log fornecido. Não houve acesso ao repositório privado do autor. A captura de tela do navegador falhou ou retornou imagem preta nesta sessão; não se afirma aprovação visual por capturas novas.

## Roteiro

O original oferece criação por IA, roteiro próprio, história real/fictícia, oito gêneros, palavras-chave, quatro modelos, premissa, estrutura, formato, duração por tomada, duração total, estilo e bíblia da história. A premissa longa ocupa um campo de linha única. Há textos de edição com 10–11 px. O selo de sincronização não comprova que o texto e as tomadas coincidem.

Na nova interface: campos multilinha, corpo de edição a partir de 14 px, sugestões que preservam palavras personalizadas, valores importados mantidos nas listas, duração de 4 minutos disponível, padrões que não reescrevem tomadas existentes e estado real de sincronização. A conversão recebe o texto inteiro, sem truncar em 3.000 caracteres. Erro da IA preserva o projeto; não insere uma história genérica. Continuação recebe o contexto anterior e preserva as identidades.

## Personagens e cenários

O original mostra quatro fichas, traços físicos, sotaque/timbre e múltiplos figurinos. A foto de Rosa aparece, mas não está vinculada a uma referência ativa como as outras. A ação de escolher foto adapta a imagem por geração, misturando importação com criação.

As imagens de cenário são verticais (768 × 1376), porém aparecem recortadas em caixas horizontais de aproximadamente 529 × 296 com `object-fit: cover`. As descrições carregadas misturam pessoas e encenação com o ambiente, e isso se refletiu nas imagens enviadas pelo usuário.

Na nova interface: imagem inteira (`contain`), importação sem regeneração automática, preparo de referências por upload separado, perfil completo de voz, edição de figurinos e arquivamento que preserva vínculos. O comando de gerar cenário exige ambiente vazio, sem pessoas, mãos, membros ou reflexos humanos. Posições e olhares pertencem às tomadas.

## Storyboard

O original expõe gerar pendentes, gerar/regenerar tomada, forçar sem referências, envio de imagem, falante/fala, modelo, resolução, plano, câmera, emoção e continuidade. A direção de 1.000–1.500 caracteres fica num campo de uma única linha. Certos valores importados de câmera e plano não existem nas opções. Os 30 cartões ficam expandidos.

Na nova interface: busca, filtro por estado e cenas recolhíveis; quadro inicial separado da ação temporal, olhares, voz e saída para o corte; elenco, cenário, figurinos, duração, som ambiente e continuidade editáveis. Valores importados continuam visíveis. Marcações opcionais por personagem são aplicadas explicitamente ao comando compatível com o formato legado. As referências não são removidas automaticamente em caso de falha.

## Vídeos

O original contém timeline com 30 tomadas, ordenação dentro da cena, animação individual/em lote, aprovação e prompts. A numeração alterna T1 e `shot_1`. Tomadas sem fala exibem a direção inteira nos itens pequenos. O lote pode ser solicitado mesmo com a maior parte dos quadros ausentes.

Na nova interface: identificação consistente pela ordem da cena, IDs estáveis preservados no arquivo, somente um reprodutor ativo sem reprodução automática, aprovações e verificação de duração/modelo/resolução antes da chamada. A fila é única, sequencial, pode pausar/cancelar e preserva resultados recebidos após cancelamento. Retomar avança para pendentes sem repetir automaticamente a operação que falhou.

## Exportação

A tela original oferece pacote ZIP, SRT, projeto JSON e bíblia JSON. Pelo código, o pacote é codificado em base64 dentro de outro JSON que já contém as mídias. O download é JSON; não é um ZIP direto. Isso duplica dados e aumenta uso de memória. É um defeito demonstrável; sem o erro concreto da exportação não se afirma que seja sua única causa.

A nova implementação cria ZIP real, manifesto sem base64, mídias únicas, documentos e arquivos por cena; o projeto completo de continuidade é separado. Legendas são opcionais e começam desligadas. A interface informa arquivos disponíveis, pendências, resultados parciais e solicitações de download. Não afirma que um arquivo foi gravado no disco apenas porque o SDK aceitou a solicitação. ZIP no Flow permanece desabilitado até confirmar suporte real do host; a prévia local oferece ZIP pelo navegador.

## Limites de validação

Os testes locais usam o backup real para conferir dados/mídias e SDK simulado para falhas, filas e respostas. Nenhuma imagem ou vídeo pago foi gerado nesta reconstrução. A ferramenta própria publicada no Flow ainda precisa receber e executar o código final; uma prévia com falha no criador não é considerada entrega funcional. O serviço externo pode continuar indisponível mesmo com o cliente corrigido.
