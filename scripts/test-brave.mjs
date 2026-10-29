import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const JSON_PATH = 'C:\\Users\\lucas\\Downloads\\Novela nordestina\\pousada\\ROSA_HUMILHADA_NA_POUSADA_LIMPO_SEGURO.json';
const ARTIFACTS_DIR = 'C:\\Users\\lucas\\.gemini\\antigravity\\brain\\6259d74b-a333-4d10-a4c6-433b84335b48';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('1. Iniciando navegador Brave...');
  const testUserDataDir = resolve(tmpdir(), `brave_test_${Date.now()}`);
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: 'new',
    userDataDir: testUserDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-quic',
      '--disable-features=BraveShields',
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      '--use-fake-ui-for-media-stream',
    ],
    defaultViewport: { width: 1400, height: 950 },
  });

  const page = await browser.newPage();

  // Monitorar console da página
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('[vite]') && !text.includes('Download the React DevTools')) {
      console.log(`[Browser Console ${msg.type()}]:`, text);
    }
  });

  page.on('pageerror', err => {
    console.error('[Browser Error]:', err.message);
  });

  console.log('2. Acessando https://estudio-novelas.netlify.app ...');
  await page.goto('https://estudio-novelas.netlify.app', { waitUntil: 'networkidle2', timeout: 30000 });

  console.log('3. Carregando JSON do projeto da Rosa (31MB)...');
  const fileInput = await page.$('input[type="file"]');
  if (!fileInput) throw new Error('Input de arquivo não encontrado na página.');

  await fileInput.uploadFile(JSON_PATH);
  await sleep(4500);

  // Tirar print da Aba 1 com o projeto carregado
  await page.screenshot({ path: resolve(ARTIFACTS_DIR, 'brave_01_projeto_carregado.png') });
  console.log('Salvo: brave_01_projeto_carregado.png');

  console.log('4. Navegando para Aba 4 (Vídeos)...');
  // Os botões de navegação têm os números 1 a 5
  const navButtons = await page.$$('nav[aria-label="Etapas da produção"] button');
  if (navButtons.length >= 4) {
    await navButtons[3].click(); // Aba 4: Vídeos
  } else {
    const videosTab = await page.evaluateHandle(() => {
      return [...document.querySelectorAll('button')].find(b => b.textContent.includes('Vídeos'));
    });
    await videosTab.click();
  }

  await sleep(2500);
  await page.screenshot({ path: resolve(ARTIFACTS_DIR, 'brave_02_aba_videos.png') });
  console.log('Salvo: brave_02_aba_videos.png');

  console.log('5. Disparando animação da Tomada 1...');
  // Clica no botão "Animar esta tomada…"
  const animateBtn = await page.evaluateHandle(() => {
    return [...document.querySelectorAll('button')].find(b => b.textContent.includes('Animar esta tomada') || b.textContent.includes('Regerar este vídeo'));
  });

  if (!animateBtn || !(await animateBtn.asElement())) {
    throw new Error('Botão "Animar esta tomada" não encontrado ou desabilitado.');
  }

  await animateBtn.click();
  await sleep(1500);

  // Confirmação no modal
  console.log('6. Confirmando geração no modal...');
  const confirmBtn = await page.evaluateHandle(() => {
    return [...document.querySelectorAll('div[role="dialog"] button, section[role="dialog"] button')].find(b => b.textContent.includes('Iniciar geração') || b.textContent.includes('Confirmar geração') || b.textContent.includes('Gerar vídeo') || b.textContent.includes('Regerar vídeo'));
  });

  if (confirmBtn && (await confirmBtn.asElement())) {
    await confirmBtn.click();
    console.log('Clicou no botão de confirmação!');
  } else {
    console.warn('Botão de confirmação não encontrado no diálogo!');
  }

  console.log('7. Aguardando animação do vídeo (Canvas + Voz brasileira)...');
  // Aguarda até o vídeo ser concluído (geração dura ~6s)
  let completed = false;
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    const videoState = await page.evaluate(() => {
      const vid = document.querySelector('video');
      const statusPill = document.querySelector('[role="status"]');
      const hasSrc = vid && vid.src && (vid.src.startsWith('data:video') || vid.src.startsWith('blob:'));
      return {
        hasVideoSrc: Boolean(hasSrc),
        srcLength: vid?.src?.length || 0,
        statusText: statusPill?.textContent || '',
      };
    });

    console.log(`[Status ${i + 1}s]:`, JSON.stringify(videoState));
    if (videoState.hasVideoSrc && videoState.srcLength > 10) {
      completed = true;
      break;
    }
  }

  await page.screenshot({ path: resolve(ARTIFACTS_DIR, 'brave_03_video_pronto.png') });
  console.log('Salvo: brave_03_video_pronto.png');

  if (completed) {
    console.log('✅ TESTE BEM SUCEDIDO: O vídeo foi animado com sucesso e está pronto no player!');
    console.log('8. Extraindo arquivo de vídeo da página e salvando no disco...');
    const base64Data = await page.evaluate(async () => {
      const vid = document.querySelector('video');
      if (!vid || !vid.src) return null;
      const res = await fetch(vid.src);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });

    if (base64Data) {
      const cleanB64 = base64Data.replace(/^data:[^,]+;base64,/, '');
      const buffer = Buffer.from(cleanB64, 'base64');
      const dest1 = 'C:\\Users\\lucas\\Downloads\\Novela nordestina\\pousada\\tomada_01_valeria.webm';
      const dest2 = resolve(ARTIFACTS_DIR, 'tomada_01_valeria.webm');
      writeFileSync(dest1, buffer);
      writeFileSync(dest2, buffer);
      console.log(`🎬 Arquivo salvo em: ${dest1} (${buffer.length} bytes)`);
      console.log(`🎬 Cópia salva em: ${dest2}`);
    }
  } else {
    console.warn('⚠️ O vídeo não concluiu dentro do tempo limite esperado.');
  }

  console.log('8. Navegando para Aba 5 (Exportação)...');
  const exportTab = await page.evaluateHandle(() => {
    return [...document.querySelectorAll('button')].find(b => b.textContent.includes('Exportação'));
  });
  if (exportTab && (await exportTab.asElement())) {
    await exportTab.click();
    await sleep(1500);
    await page.screenshot({ path: resolve(ARTIFACTS_DIR, 'brave_04_aba_exportacao.png') });
    console.log('Salvo: brave_04_aba_exportacao.png');
  }

  await browser.close();
  console.log('Navegador encerrado. Teste concluído.');
}

run().catch(err => {
  console.error('Falha no teste:', err);
  process.exit(1);
});
