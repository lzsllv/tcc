const db = require('../database/connection');

module.exports = {
    async listarCategorias(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de categorias.',
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
    async cadastrarCategorias(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de categorias.',
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
    async editarCategorias(request, response) {
        try {
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Editar categorias.',
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
    async apagarCategorias(request, response) {
    try {
        return response.status(200).json({
            sucesso: true,
            mensagem: 'Apagar categorias.',
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