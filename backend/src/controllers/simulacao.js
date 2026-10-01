const db = require('../database/connection');

module.exports = {
   async listarSimulacao(request, response) {
    try {
        const [simulacoes] = await db.query(
            'SELECT * FROM simulacao_lucro'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de simulações.',
            dados: simulacoes
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
    async cadastrarSimulacao(request, response) {
    try {
        const {
            quantidade_vendida,
            faturamento_previsto,
            lucro_previsto,
            ponto_equilibrio,
            id_precificacao
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO simulacao_lucro
            (quantidade_vendida, faturamento_previsto, lucro_previsto, ponto_equilibrio, id_precificacao)
            VALUES (?, ?, ?, ?, ?)`,
            [
                quantidade_vendida,
                faturamento_previsto,
                lucro_previsto,
                ponto_equilibrio,
                id_precificacao
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Simulação cadastrada com sucesso.',
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
async editarSimulacao(request, response) {
    try {
        const {
            id_simulacao,
            quantidade_vendida,
            faturamento_previsto,
            lucro_previsto,
            ponto_equilibrio,
            id_precificacao
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE simulacao_lucro
             SET quantidade_vendida = ?,
                 faturamento_previsto = ?,
                 lucro_previsto = ?,
                 ponto_equilibrio = ?,
                 id_precificacao = ?
             WHERE id_simulacao = ?`,
            [
                quantidade_vendida,
                faturamento_previsto,
                lucro_previsto,
                ponto_equilibrio,
                id_precificacao,
                id_simulacao
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Simulação editada com sucesso.',
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
async apagarSimulacao(request, response) {
    try {
        const { id_simulacao } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM simulacao_lucro
             WHERE id_simulacao = ?`,
            [id_simulacao]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Simulação apagada com sucesso.',
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