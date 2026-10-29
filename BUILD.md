# Compilar e abrir o estúdio

As dependências ficam somente nesta pasta; o projeto Sanja Flow da raiz não é alterado.

```powershell
cd "C:\Users\lucas\Projetos\sanja-flow\sanja-flow\ferramentas\estudio-novelas"
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

O build verifica a sintaxe de todos os arquivos JavaScript/JSX e compila o Tailwind localmente.
Não usa CDN, não inclui credenciais e não gera mídia.

- `dist/Estudio-de-Novelas.html`: versão portátil em um único arquivo, com React, JavaScript
  e CSS embutidos. Abra o arquivo no navegador e use **Abrir projeto** para selecionar seu JSON.
  A importação é manual; nenhum backup é carregado automaticamente. Permite editar e exportar
  arquivos locais. A geração de texto, imagem e vídeo depende do aplicativo dentro do Flow.
- `dist/index.html`, `local.js` e `local.css`: a mesma prévia, servida localmente.
- `dist/flow.js`: módulo React com exportação padrão para o Flow. Importa `react` e `flow-sdk`
  do ambiente hospedeiro e inclui o CSS compilado. O suporte ao MIME ZIP permanece desligado
  até a confirmação da versão real do SDK.

Para servir a prévia em `http://127.0.0.1:4173`:

```powershell
npm run preview
```

O servidor escuta somente no computador local. `npm run dev` compila antes de iniciar o servidor.
Para usar outra porta: `node scripts/preview.mjs --port 4174`.

Verificações sem navegador:

```powershell
npm run check
npm run smoke
node scripts/smoke.mjs --http
npm test
```

O smoke usa o backup real de Rosa para renderizar os cinco painéis e verifica os bundles e a
versão portátil. `--http` também testa o servidor já iniciado na porta 4173. Para conferir outro
projeto: `node scripts/smoke.mjs --project "C:\caminho\projeto.json"`.

Em ambientes que isolam sockets de processos, servidor e verificação HTTP precisam executar
no mesmo ambiente do navegador. A versão portátil dispensa o servidor.

O teste de exportação aceita `EXPORTACAO_PYTHON` apontando para um Python 3 para inspecionar
o ZIP também com `zipfile`/`zlib`, sem gravar nem gerar mídia.
