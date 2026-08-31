const db = require('../database/connection');

module.exports = {
    async listarcustoFixo(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de custos fixos.',
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
    async cadastrarcustoFixo(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de custos fixos.',
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
    async editarcustoFixo(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar custos fixos.',
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
    async apagarcustoFixo(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar custos fixos.',
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