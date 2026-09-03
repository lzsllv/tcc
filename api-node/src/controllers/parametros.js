const db = require('../database/connection');

module.exports = {
    async listarParametro(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de parâmetros.',
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
    async cadastrarParametro(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de parâmetros.',
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
    async editarParametro(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar parâmetros.',
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
    async apagarParametro(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar parâmetros.',
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