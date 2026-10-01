const db = require('../database/connection');

module.exports = {

    async listarCategorias(request, response) {
        try {
            const [categorias] = await db.query(
                'SELECT * FROM categoria'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de categorias.',
                dados: categorias
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarCategorias(request, response) {
        try {
            const { nome_categoria } = request.body;

            const [resultado] = await db.query(
                `INSERT INTO categoria
                (nome_categoria)
                VALUES (?)`,
                [nome_categoria]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Categoria cadastrada com sucesso.',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarCategorias(request, response) {
        try {
            const {
                id_categoria,
                nome_categoria
            } = request.body;

            const [resultado] = await db.query(
                `UPDATE categoria
                 SET nome_categoria = ?
                 WHERE id_categoria = ?`,
                [
                    nome_categoria,
                    id_categoria
                ]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Categoria editada com sucesso.',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async apagarCategorias(request, response) {
        try {
            const { id_categoria } = request.body;

            const [resultado] = await db.query(
                `DELETE FROM categoria
                 WHERE id_categoria = ?`,
                [id_categoria]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Categoria apagada com sucesso.',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }

};