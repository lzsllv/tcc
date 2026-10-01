const db = require('../database/connection');

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