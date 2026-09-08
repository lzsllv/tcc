const db = require('../database/connection');

module.exports = {

    async listarUsuarios(request, response) {
        try {
            const [usuarios] = await db.query(
                'SELECT * FROM usuario'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: usuarios
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarUsuarios(request, response) {
        try {
            const {
                nome_usuario,
                email_usuario,
                senha_usuario,
                dt_cadastro,
                status_usuario
            } = request.body;

            const [resultado] = await db.query(
                `INSERT INTO usuario 
                (nome_usuario, email_usuario, senha_usuario, dt_cadastro, status_usuario)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    nome_usuario,
                    email_usuario,
                    senha_usuario,
                    dt_cadastro,
                    status_usuario
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
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

    async editarUsuarios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar usuários.',
                dados: null
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async apagarUsuarios(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Apagar usuários.',
                dados: null
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