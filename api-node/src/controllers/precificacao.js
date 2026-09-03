const db = require('../database/connection');

module.exports = {
    async listarPrecificacao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de precificações.',
                dados: null
            });
        }catch(error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }

    },
    async cadastrarPrecificacao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de precificações.',
                dados: null
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
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar precificações.',
                dados: null
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
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar precificações.',
            dados: null
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