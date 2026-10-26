const fse = require('fs-extra');
const path = require('path');
const { URL } = require('url'); // Módulo nativo do Node.js para trabalhar com URLs

/**
 * Caminho físico para a pasta 'public'.
 */
const PUBLIC_ROOT_PATH = path.join(process.cwd(), 'public');

/**
 * Lê a URL base da API a partir das variáveis de ambiente.
 * Fornece um valor padrão caso a variável não esteja definida.
 */
const API_URL = process.env.API_BASE_URL || 'http://localhost:3333';

/**
 * Gera uma URL pública e COMPLETA para um recurso (imagem, ícone, etc.).
 * (...)
 * @returns {string} A URL completa e formatada (ex: 'http://localhost:3333/upload/produtos/produto-123.jpg').
 */

function gerarUrl(nomeArquivo, pasta, arquivoPadrao) {
    const pastaBase = (pasta || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const arquivoPadraoNormalizado = (arquivoPadrao || 'sem-img.png').replace(/\\/g, '/').replace(/^\/+/, '');
    const arquivoInformado = nomeArquivo
        ? String(nomeArquivo).replace(/\\/g, '/').replace(/^\/+/, '')
        : arquivoPadraoNormalizado;

    const caminhoArquivo = arquivoInformado.includes('/')
        ? arquivoInformado.replace(/^public\//, '')
        : `${pastaBase ? `${pastaBase}/` : ''}${arquivoInformado}`;

    const caminhoFisico = path.join(PUBLIC_ROOT_PATH, caminhoArquivo);
    const caminhoFinal = fse.existsSync(caminhoFisico)
        ? caminhoArquivo
        : `${pastaBase ? `${pastaBase}/` : ''}${arquivoPadraoNormalizado}`;

    const caminhoRelativo = `/${caminhoFinal.replace(/^public\//, '').replace(/^\/+/, '')}`;
    const urlCompleta = new URL(caminhoRelativo, API_URL);

    return urlCompleta.href;
}

module.exports = gerarUrl;