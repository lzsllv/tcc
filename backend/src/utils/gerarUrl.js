function gerarUrl(request, imagem) {
    if (!imagem) {
        return null;
    }

    return `${request.protocol}://${request.get('host')}/${imagem}`;
}

module.exports = gerarUrl;