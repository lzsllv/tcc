const db = require('../database/connection');

module.exports = {
    async listarEmpresas(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de empresas.',
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
    async cadastrarEmpresas(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de empresas.',
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
    async editarEmpresas(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar empresas.',
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
    async apagarEmpresas(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar empresas.',
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