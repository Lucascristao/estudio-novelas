// ZIP 2.0 / STORE: arquivos já comprimidos (JPEG, PNG, MP4) não precisam de DEFLATE.
// Sem SDK, Buffer, Node ou dependências. Limites ZIP32 são conferidos antes da alocação.
const encoder = new TextEncoder();
const MAX32 = 0xffffffff;
const tabelaCrc = Uint32Array.from({ length: 256 }, (_, i) => {
  let crc = i;
  for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  return crc >>> 0;
});

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = tabelaCrc[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function validarCaminhoZip(caminho) {
  if (typeof caminho !== 'string' || !caminho || caminho.includes('\\') || caminho.startsWith('/') ||
      /^[a-z]:/i.test(caminho) || /[\x00-\x1f]/.test(caminho) ||
      caminho.split('/').some(parte => !parte || parte === '.' || parte === '..')) {
    throw new Error(`Caminho inválido no ZIP: ${String(caminho)}`);
  }
  return caminho;
}

export function criarZipStore(arquivos, { limiteBytes = 512 * 1024 * 1024 } = {}) {
  if (!Array.isArray(arquivos) || arquivos.length > 65535) {
    throw new Error('Quantidade excede o limite ZIP32. Exporte por cena.');
  }
  const nomes = new Set();
  let tamanho = 22;
  const entradas = arquivos.map(arquivo => {
    const caminho = validarCaminhoZip(arquivo.caminho);
    if (nomes.has(caminho.toLowerCase())) throw new Error(`Nome repetido no ZIP: ${caminho}`);
    nomes.add(caminho.toLowerCase());
    const nome = encoder.encode(caminho);
    const bytes = arquivo.bytes;
    if (!(bytes instanceof Uint8Array)) throw new TypeError(`Conteúdo inválido: ${caminho}`);
    if (nome.length > 65535 || bytes.length > MAX32) throw new Error('Arquivo excede o limite ZIP32.');
    tamanho += 30 + nome.length + bytes.length + 46 + nome.length;
    if (tamanho > MAX32 || tamanho > limiteBytes) {
      throw new Error('Pacote excede o limite de memória configurado. Exporte por cena ou arquivos individuais.');
    }
    return { nome, bytes, crc: crc32(bytes) };
  });
  const resultado = new Uint8Array(tamanho);
  const view = new DataView(resultado.buffer);
  const u16 = (offset, value) => view.setUint16(offset, value, true);
  const u32 = (offset, value) => view.setUint32(offset, value, true);
  let pos = 0;
  for (const entrada of entradas) {
    entrada.offset = pos;
    u32(pos, 0x04034b50);
    u16(pos + 4, 20);
    u16(pos + 6, 0x0800); // Nomes UTF-8.
    u16(pos + 12, 33); // 1980-01-01, data determinística válida no formato DOS.
    u32(pos + 14, entrada.crc);
    u32(pos + 18, entrada.bytes.length);
    u32(pos + 22, entrada.bytes.length);
    u16(pos + 26, entrada.nome.length);
    resultado.set(entrada.nome, pos + 30);
    resultado.set(entrada.bytes, pos + 30 + entrada.nome.length);
    pos += 30 + entrada.nome.length + entrada.bytes.length;
  }
  const inicioCentral = pos;
  for (const entrada of entradas) {
    u32(pos, 0x02014b50);
    u16(pos + 4, 20);
    u16(pos + 6, 20);
    u16(pos + 8, 0x0800);
    u16(pos + 14, 33);
    u32(pos + 16, entrada.crc);
    u32(pos + 20, entrada.bytes.length);
    u32(pos + 24, entrada.bytes.length);
    u16(pos + 28, entrada.nome.length);
    u32(pos + 42, entrada.offset);
    resultado.set(entrada.nome, pos + 46);
    pos += 46 + entrada.nome.length;
  }
  u32(pos, 0x06054b50);
  u16(pos + 8, entradas.length);
  u16(pos + 10, entradas.length);
  u32(pos + 12, pos - inicioCentral);
  u32(pos + 16, inicioCentral);
  return resultado;
}
