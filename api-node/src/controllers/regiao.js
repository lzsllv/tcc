const db = require('../database/connection');

module.exports = {
    async listarRegiao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de regiões.',
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
    async cadastrarRegiao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de regiões.',
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
    async editarRegiao(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar regiões.',
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
    async apagarRegiao(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar regiões.',
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