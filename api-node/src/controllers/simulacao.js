const db = require('../database/connection');

module.exports = {
    async listarSimulacao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de simulações.',
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
    async cadastrarSimulacao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de simulações.',
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
    async editarSimulacao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar simulações.',
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
    async apagarSimulacao(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar simulações.',
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