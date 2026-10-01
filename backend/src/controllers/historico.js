const db = require('../database/connection');

module.exports = {
 async listarHistorico(request, response) {
    try {
        const [historicos] = await db.query(
            'SELECT * FROM historico_precificacao'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de históricos.',
            dados: historicos
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async cadastrarHistorico(request, response) {
    try {
        const {
            preco_anterior,
            margem_anterior,
            data_alteracao,
            id_precificacao
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO historico_precificacao
            (preco_anterior, margem_anterior, data_alteracao, id_precificacao)
            VALUES (?, ?, ?, ?)`,
            [
                preco_anterior,
                margem_anterior,
                data_alteracao,
                id_precificacao
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Histórico cadastrado com sucesso.',
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
   async editarHistorico(request, response) {
    try {
        const {
            id_historico,
            preco_anterior,
            margem_anterior,
            data_alteracao,
            id_precificacao
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE historico_precificacao
             SET preco_anterior = ?,
                 margem_anterior = ?,
                 data_alteracao = ?,
                 id_precificacao = ?
             WHERE id_historico = ?`,
            [
                preco_anterior,
                margem_anterior,
                data_alteracao,
                id_precificacao,
                id_historico
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Histórico editado com sucesso.',
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
   async apagarHistorico(request, response) {
    try {
        const { id_historico } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM historico_precificacao
             WHERE id_historico = ?`,
            [id_historico]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Histórico apagado com sucesso.',
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