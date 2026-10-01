const db = require('../database/connection');

module.exports = {
 async listarcustoFixo(request, response) {
    try {
        const [custosFixos] = await db.query(
            'SELECT * FROM custo_fixo'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de custos fixos.',
            dados: custosFixos
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async cadastrarcustoFixo(request, response) {
    try {
        const {
            descricao,
            valor,
            categoria,
            id_empresa
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO custo_fixo
            (descricao, valor, categoria, id_empresa)
            VALUES (?, ?, ?, ?)`,
            [
                descricao,
                valor,
                categoria,
                id_empresa
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Custo fixo cadastrado com sucesso.',
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
async editarcustoFixo(request, response) {
    try {
        const {
            id_custo_fixo,
            descricao,
            valor,
            categoria,
            id_empresa
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE custo_fixo
             SET descricao = ?,
                 valor = ?,
                 categoria = ?,
                 id_empresa = ?
             WHERE id_custo_fixo = ?`,
            [
                descricao,
                valor,
                categoria,
                id_empresa,
                id_custo_fixo
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Custo fixo editado com sucesso.',
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
async apagarcustoFixo(request, response) {
    try {
        const { id_custo_fixo } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM custo_fixo
             WHERE id_custo_fixo = ?`,
            [id_custo_fixo]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Custo fixo apagado com sucesso.',
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