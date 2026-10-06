const db = require('../database/connection');

const {
    campoObrigatorio,
    valorNaoNegativo,
    existeRegistro
} = require('../utils');

module.exports = {
   async listarEmpresas(request, response) {
    try {
        const [empresas] = await db.query(
            'SELECT * FROM empresa'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de empresas.',
            dados: empresas
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
   async cadastrarEmpresas(request, response) {
    try {
        const {
            id_usuario,
            nome_fantasia,
            cnpj,
            segmento
        } = request.body;
        if (
    !campoObrigatorio(id_usuario) ||
    !campoObrigatorio(nome_fantasia) ||
    !campoObrigatorio(cnpj) ||
    !campoObrigatorio(segmento)
) {
    return response.status(400).json({
        sucesso: false,
        mensagem: 'Preencha todos os campos obrigatórios.',
        dados: null
    });
}
const [usuario] = await db.query(
    `SELECT id_usuario
     FROM usuario
     WHERE id_usuario = ?`,
    [id_usuario]
);

if (!existeRegistro(usuario)) {
    return response.status(400).json({
        sucesso: false,
        mensagem: 'O usuário informado não existe.',
        dados: null
    });
}
        const [resultado] = await db.query(
            `INSERT INTO empresa
            (nome_fantasia, cnpj, segmento,id_usuario)
            VALUES (?, ?, ?, ?)`,
            [
                nome_fantasia,
                cnpj,
                segmento,
                id_usuario
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Empresa cadastrada com sucesso.',
            dados: resultado
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
  async editarEmpresas(request, response) {
    try {
        const {
            id_empresa,
            nome_fantasia,
            cnpj,
            segmento,
            id_usuario
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE empresa
             SET nome_fantasia = ?,
                 cnpj = ?,
                 segmento = ?,
                 id_usuario = ?
             WHERE id_empresa = ?`,
            [
                nome_fantasia,
                cnpj,
                segmento,
                id_usuario,
                id_empresa
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Empresa editada com sucesso.',
            dados: resultado
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
   async apagarEmpresas(request, response) {
    try {
        const { id_empresa } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM empresa
             WHERE id_empresa = ?`,
            [id_empresa]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Empresa apagada com sucesso.',
            dados: resultado
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
}