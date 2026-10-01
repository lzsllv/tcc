const db = require('../database/connection');

module.exports = {
   async listarProdutos(request, response) {
    try {
        const [produtos] = await db.query(
            'SELECT * FROM produto'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de produtos.',
            dados: produtos
        });
        }catch(error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }

    },
    async cadastrarProdutos(request, response) {
        try {
            const {
                nome,
                descricao,
                tipo,
                custo_direto,
                tempo_producao,
                id_empresa,
                preco_minimo
            } = request.body;

            const [resultado] = await db.query(
                `INSERT INTO produto
                 (nome, descricao, tipo, custo_direto, tempo_producao,id_empresa,preco_minimo)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
            
                    nome,
                    descricao,
                    tipo,
                    custo_direto,
                    tempo_producao,
                    id_empresa,
                    preco_minimo

                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Produto cadastrado com sucesso.',
                dados: resultado
            });
        } catch(error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    
    },
    async editarProdutos(request, response) {
    try {
        const {
            id_produto,
            nome,
            descricao,
            tipo,
            custo_direto,
            tempo_producao,
            id_empresa,
            preco_minimo
        } = request.body;

        const [resultado] = await db.query(
            `UPDATE produto
             SET nome = ?,
                 descricao = ?,
                 tipo = ?,
                 custo_direto = ?,
                 tempo_producao = ?,
                 id_empresa = ?,
                 preco_minimo = ?
             WHERE id_produto = ?`,
            [
                nome,
                descricao,
                tipo,
                custo_direto,
                tempo_producao,
                id_empresa,
                preco_minimo,
                id_produto
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Produto editado com sucesso.',
            dados: resultado
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async apagarProdutos(request, response) {
    try {
        const { id_produto } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM produto
             WHERE id_produto = ?`,
            [id_produto]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Produto apagado com sucesso.',
            dados: resultado
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