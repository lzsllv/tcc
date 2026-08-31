const db = require('../database/connection');

module.exports = {
    async listarcustoVariavel(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de custos variáveis.',
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
    async cadastrarcustoVariavel(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de custos variáveis.',
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
    async editarcustoVariavel(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar custos variáveis.',
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
    async apagarcustoVariavel(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar custos variáveis.',
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