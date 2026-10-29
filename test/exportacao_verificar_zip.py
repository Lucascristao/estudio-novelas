"""Verificador independente: recebe ZIP pela entrada padrão e não grava mídia."""
import hashlib
import io
import json
import re
import sys
import zipfile
import zlib


def conferir_manifesto(valor):
    if isinstance(valor, dict):
        for chave, item in valor.items():
            if chave.lower().endswith("base64"):
                assert not isinstance(item, str), f"Base64 repetido: {chave}"
            conferir_manifesto(item)
    elif isinstance(valor, list):
        for item in valor:
            conferir_manifesto(item)
    elif isinstance(valor, str):
        assert not re.match(r"data:[^,]*;base64,", valor, re.I), "Data URL embutida"


with zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read())) as pacote:
    assert pacote.testzip() is None, "CRC inconsistente"
    nomes = pacote.namelist()
    assert len(nomes) == len(set(nome.casefold() for nome in nomes)), "Caminhos duplicados"
    assert all(not nome.lower().endswith(".zip") for nome in nomes), "ZIP dentro do ZIP"
    assert all(not nome.lower().endswith("_projeto_sanja.json") for nome in nomes), "Backup de mídia duplicado"
    for nome in nomes:
        assert not nome.startswith(("/", "\\")) and ".." not in nome.split("/")
    manifesto = json.loads(pacote.read("MANIFESTO.json"))
    conferir_manifesto(manifesto)
    hashes = []
    for midia in manifesto["midias"]:
        conteudo = pacote.read(midia["arquivo"])
        assert len(conteudo) == midia["tamanhoBytes"], "Tamanho divergente"
        assert f"{zlib.crc32(conteudo):08x}" == midia["crc32"], "CRC da mídia divergente"
        hashes.append(hashlib.sha256(conteudo).hexdigest())
    assert len(hashes) == len(set(hashes)), "Mesma mídia exportada duas vezes"
    print(json.dumps({"arquivos": len(nomes), "midias": len(hashes), "crcValido": True, "semDuplicatas": True}))
