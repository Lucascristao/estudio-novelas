# 🎬 Estúdio de Novelas — AI Short Drama Studio

Ambiente completo na nuvem para criação, decupagem, roteirização e montagem de **mininovelas dramáticas verticais (Short Dramas)** sem depender de créditos do Google Flow e sem pesar no seu computador local.

---

## 🚀 Como Abrir no GitHub Codespaces (1 Clique)

1. No repositório [Lucascristao/estudio-novelas](https://github.com/Lucascristao/estudio-novelas), clique no botão verde **Code**.
2. Selecione a aba **Codespaces** e clique em **Create codespace on main**.
3. O GitHub vai iniciar seu servidor na nuvem, instalar o FFmpeg, as dependências do Node e abrir automaticamente a interface do Estúdio no seu navegador na porta **4173**!

---

## 🔑 Configuração da Chave Gemini (Google AI Studio)

Para decupar o roteiro em tomadas e diálogos automaticamente:

1. Crie um arquivo chamado `.env` na raiz do projeto (ou copie de `.env.example`).
2. Cole a sua chave gratuita:
```bash
GEMINI_API_KEY=sua_chave_aqui
```
*(Você também pode configurar a chave diretamente pela interface na primeira vez que abrir).*

---

## 🎭 As 5 Abas de Produção

1. **Roteiro:** Cole o texto da novela ou use a IA (Gemini 2.0 Flash) para decupar as cenas em diálogos, tomadas e direções dramáticas.
2. **Personagens e Cenários:** Cadastro de elenco fixo e locações vazias (mantendo a consistência visual e o figurino ao longo da história).
3. **Storyboard:** Geração das tomadas com o modelo FLUX (via Pollinations) em alta definição 9:16.
4. **Vídeos:** Montagem automática das tomadas com zoom dinâmico de câmera (Ken Burns), dublagem neural brasileira (Edge-TTS) e ritmo de novela.
5. **Exportação:** Download do projeto completo em JSON ou do vídeo pronto em `.mp4`.

---

## 💻 Desenvolvimento e Execução Local

Se quiser rodar localmente no seu computador:

```bash
# 1. Instalar dependências
npm install

# 2. Compilar
npm run build

# 3. Iniciar o servidor
npm start
```
Acesse: `http://localhost:4173`
