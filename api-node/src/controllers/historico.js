const db = require('../database/connection');

module.exports = {
    async listarHistorico(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de histórico.',
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
    async cadastrarHistorico(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de histórico.',
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
    async editarHistorico(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar histórico.',
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
    async apagarHistorico(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar histórico.',
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