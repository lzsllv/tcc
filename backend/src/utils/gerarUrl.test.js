const assert = require('node:assert/strict');
const test = require('node:test');
const gerarUrl = require('./gerarUrl');

test('gera uma URL de imagem sem duplicar o diretório informado no banco', () => {
    assert.equal(
        gerarUrl('imagens/bolo2.jpg', 'imagens', 'sem-img.png'),
        'http://localhost:3333/imagens/bolo2.jpg'
    );
});
