const db = require('../database/connection');

module.exports = {
 async listarParametro(request, response) {
    try {
        const [parametros] = await db.query(
            'SELECT * FROM parametro_precificacao'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de parâmetros.',
            dados: parametros
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},

  async cadastrarParametro(request, response) {
    try {
        const {
            margem_desejada,
            horas_trabalhadas_mes,
            pro_labore,
            impostos_percentual,
            id_empresa
        } = request.body;

        const [resultado] = await db.query(
            `INSERT INTO parametro_precificacao
            (margem_desejada, horas_trabalhadas_mes, pro_labore, impostos_percentual, id_empresa)
            VALUES (?, ?, ?, ?, ?)`,
            [
                margem_desejada,
                horas_trabalhadas_mes,
                pro_labore,
                impostos_percentual,
                id_empresa
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Parâmetro cadastrado com sucesso.',
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
async editarParametro(request, response) {
    try {
        const {
            id_parametro,
            margem_desejada,
            horas_trabalhadas_mes,
            pro_labore,
            impostos_percentual,
            id_empresa
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE parametro_precificacao
             SET margem_desejada = ?,
                 horas_trabalhadas_mes = ?,
                 pro_labore = ?,
                 impostos_percentual = ?,
                 id_empresa = ?
             WHERE id_parametro = ?`,
            [
                margem_desejada,
                horas_trabalhadas_mes,
                pro_labore,
                impostos_percentual,
                id_empresa,
                id_parametro
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Parâmetro editado com sucesso.',
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
async apagarParametro(request, response) {
    try {
        const { id_parametro } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM parametro_precificacao
             WHERE id_parametro = ?`,
            [id_parametro]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Parâmetro apagado com sucesso.',
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