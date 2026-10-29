# Funções da ferramenta original e escopo da versão própria

Inventário obtido pela leitura do JavaScript fornecido no log. A presença de uma função no
código não comprova que ela funcione no serviço real. A versão própria só será considerada
validada nas operações efetivamente verificadas.

| Etapa | Funções identificadas na original | Direção para a versão própria |
| --- | --- | --- |
| Projeto | Abrir/salvar JSON 3.0 completo; manter fichas e mídias | Preservar dados, validar vínculos e conferir importação/exportação |
| Roteiro | Ideias, gêneros, palavras-chave, real/fictício, estrutura narrativa, roteiro em duas fases, conversão de texto, continuação de série | Manter criação, conversão e continuação sem sobrescrever um projeto preenchido silenciosamente |
| Personagens | Cadastro, edição, foto adaptada, geração de ficha, múltiplos figurinos, perfil textual de voz | Preservar foto original; registrar referências importadas sem recriar o rosto |
| Cenários | Cadastro, edição, geração individual e dos faltantes | Gerar ambientes vazios; encenação somente nas tomadas |
| Storyboard | Fala, falante, ação, plano, câmera, emoção, duração, encurtar fala com IA, continuidade, imagem de galeria, geração individual/lote, cancelamento | Quadro inicial estático separado da animação; manter referências e pausar em erro persistente |
| Vídeo | Modelo/resolução por tomada, quadro inicial, geração individual/lote, aprovação, geração de aprovados em 720p, reordenação, copiar prompt | Fila única, preservar resultados e compatibilidade com `videoResolution` e `isApproved` |
| Exportação | JSON completo, bíblia isolada, roteiro, prompts, falas por personagem, SRT, pacote de mídias | JSON completo separado; mídias individuais e ZIP real sem duplicação; SRT opcional |

## Defeito confirmado na implementação antiga de exportação

O botão "Baixar Pacote ZIP" chama `handleExportFullZip`, mas:

1. Gera o ZIP inteiro em base64.
2. Acrescenta `zipArchiveBase64` a um JSON cujo `storyBible` já contém as mídias em base64.
3. Serializa novamente esse objeto grande e converte o texto inteiro em outro base64.
4. Solicita `Flow.download` com MIME `application/json` e nome terminado em `_pacote_fase3.json`.

Logo, o botão não entrega um arquivo ZIP diretamente. Ele duplica conteúdos e aumenta o uso de
memória. Isso é um defeito verificável no código; a mensagem de erro específica da exportação
do usuário ainda não foi fornecida, portanto não é possível afirmar que esse seja o único motivo
da falha relatada.

Na versão própria: pacote de arquivos com MIME `application/zip`, extensão `.zip`, manifesto
sem cópias base64, mídia em arquivos separados, progresso e alternativa por cena ou arquivo.
JPEG e MP4 devem usar armazenamento sem recompressão desnecessária. Uma tomada pendente
deve aparecer no relatório de faltantes, não impedir a exportação das mídias prontas.
