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
async listarProdutosComEmpresa(request, response) {
    try {
        const [produtos] = await db.query(
            `SELECT
                produto.nome,
                empresa.nome_fantasia
             FROM produto
             INNER JOIN empresa
                ON produto.id_empresa = empresa.id_empresa`
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de produtos com empresa.',
            dados: produtos
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async buscarProdutos(request, response) {
    try {
        const { nome, preco } = request.query;

        const [produtos] = await db.query(
            `SELECT *
             FROM produto
             WHERE nome LIKE ?
             AND custo_direto <= ?`,
            [
                `%${nome}%`,
                preco
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Busca de produtos.',
            dados: produtos
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async listarProdutosPaginados(request, response) {
    try {
        const { pagina = 1, limite = 10 } = request.query;

        const offset = (pagina - 1) * limite;

        const [produtos] = await db.query(
            `SELECT *
             FROM produto
             LIMIT ? OFFSET ?`,
            [
                Number(limite),
                Number(offset)
            ]
        );

        const [total] = await db.query(
            `SELECT COUNT(*) AS total
             FROM produto`
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de produtos paginada.',
            dados: produtos,
            total: total[0].total,
            pagina: Number(pagina),
            limite: Number(limite)
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async listarProdutoAleatorio(request, response) {
    try {
        const [produtos] = await db.query(
            `SELECT *
             FROM produto
             ORDER BY RAND()
             LIMIT 1`
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Produto aleatório.',
            dados: produtos
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