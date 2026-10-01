const db = require('../database/connection');

module.exports = {
   async listarPrecificacao(request, response) {
    try {
        const [precificacoes] = await db.query(
            'SELECT * FROM precificacao'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de precificações.',
            dados: precificacoes
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
 async cadastrarPrecificacao(request, response) {
    try {
        const {
            preco_sugerido,
            margem_real,
            custo_total,
            mark_up,
            alerta_prejuizo,
            alerta_acima_mercado,
            data_calculo,
            id_produto,
            id_regiao,
            id_parametro
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO precificacao
            (preco_sugerido, margem_real, custo_total, mark_up,
             alerta_prejuizo, alerta_acima_mercado, data_calculo,
             id_produto, id_regiao, id_parametro)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                preco_sugerido,
                margem_real,
                custo_total,
                mark_up,
                alerta_prejuizo,
                alerta_acima_mercado,
                data_calculo,
                id_produto,
                id_regiao,
                id_parametro
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Precificação cadastrada com sucesso.',
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
async editarPrecificacao(request, response) {
    try {
        const {
            id_precificacao,
            preco_sugerido,
            margem_real,
            custo_total,
            mark_up,
            alerta_prejuizo,
            alerta_acima_mercado,
            data_calculo,
            id_produto,
            id_regiao,
            id_parametro
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE precificacao
             SET preco_sugerido = ?,
                 margem_real = ?,
                 custo_total = ?,
                 mark_up = ?,
                 alerta_prejuizo = ?,
                 alerta_acima_mercado = ?,
                 data_calculo = ?,
                 id_produto = ?,
                 id_regiao = ?,
                 id_parametro = ?
             WHERE id_precificacao = ?`,
            [
                preco_sugerido,
                margem_real,
                custo_total,
                mark_up,
                alerta_prejuizo,
                alerta_acima_mercado,
                data_calculo,
                id_produto,
                id_regiao,
                id_parametro,
                id_precificacao
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Precificação editada com sucesso.',
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
async apagarPrecificacao(request, response) {
    try {
        const { id_precificacao } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM precificacao
             WHERE id_precificacao = ?`,
            [id_precificacao]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Precificação apagada com sucesso.',
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