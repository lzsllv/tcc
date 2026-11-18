const path = require('path');
const { URL } = require('url');

const PUBLIC_ROOT_PATH = path.join(process.cwd(), 'public');

const API_URL = process.env.API_BASE_URL || 'http://localhost:3333';

function gerarUrl(nomeArquivo, pasta, arquivoPadrao) {
    const pastaBase = (pasta || '').replace(/\\/g, '/');

    const arquivo = nomeArquivo || arquivoPadrao || 'sem-img.png';

    const caminhoRelativo = `/${pastaBase ? `${pastaBase}/` : ''}${arquivo}`;

    const caminhoFisico = path.join(PUBLIC_ROOT_PATH, caminhoRelativo);

    if (!require('fs').existsSync(caminhoFisico)) {
        return new URL('/imagens/sem-img.png', API_URL).href;
    }

    return new URL(caminhoRelativo, API_URL).href;
}

module.exports = gerarUrl;