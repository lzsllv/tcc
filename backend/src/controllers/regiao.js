const db = require('../database/connection');

module.exports = {
 async listarRegiao(request, response) {
    try {
        const [regioes] = await db.query(
            'SELECT * FROM regiao'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de regiões.',
            dados: regioes
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async cadastrarRegiao(request, response) {
    try {
        const {
            cidade,
            estado,
            indice_custo_regional,
            ticket_medio_regional
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO regiao
            (cidade, estado, indice_custo_regional, ticket_medio_regional)
            VALUES (?, ?, ?, ?)`,
            [
                cidade,
                estado,
                indice_custo_regional,
                ticket_medio_regional
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Região cadastrada com sucesso.',
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
async editarRegiao(request, response) {
    try {
        const {
            id_regiao,
            cidade,
            estado,
            indice_custo_regional,
            ticket_medio_regional
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE regiao
             SET cidade = ?,
                 estado = ?,
                 indice_custo_regional = ?,
                 ticket_medio_regional = ?
             WHERE id_regiao = ?`,
            [
                cidade,
                estado,
                indice_custo_regional,
                ticket_medio_regional,
                id_regiao
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Região editada com sucesso.',
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
    async apagarRegiao(request, response) {
    try {
        const { id_regiao } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM regiao
             WHERE id_regiao = ?`,
            [id_regiao]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Região apagada com sucesso.',
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
async listarEstados(request, response) {
    try {
        const [estados] = await db.query(
            'SELECT estado FROM regiao'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de estados.',
            dados: estados
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async listarEstadosTratados(request, response) {
    try {
        const [estados] = await db.query(
            `SELECT estado AS nome_estado
             FROM regiao`
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de estados tratados.',
            dados: estados
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async buscarRegiaoPorEstado(request, response) {
    try {
        const { estado } = request.query;

        const [regioes] = await db.query(
            `SELECT *
             FROM regiao
             WHERE estado LIKE ?`,
            [`%${estado}%`]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Busca de regiões por estado.',
            dados: regioes
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async buscarRegiaoPorEstado(request, response) {
    try {
        const { estado } = request.query;

        const [regioes] = await db.query(
            `SELECT *
             FROM regiao
             WHERE estado LIKE ?`,
            [`%${estado}%`]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Busca de regiões por estado.',
            dados: regioes
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