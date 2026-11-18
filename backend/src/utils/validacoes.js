function campoObrigatorio(valor) {
    return valor !== undefined && valor !== null && valor !== '';
}

function valorNaoNegativo(valor) {
    return valor >= 0;
}
function existeRegistro(registros) {
    return Array.isArray(registros) && registros.length > 0;
}
module.exports = {
    campoObrigatorio,
    valorNaoNegativo,
    existeRegistro
};