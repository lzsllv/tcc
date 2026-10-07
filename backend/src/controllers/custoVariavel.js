const db = require('../database/connection');

const {
    campoObrigatorio,
    valorNaoNegativo,
    existeRegistro
} = require('../utils');

module.exports = {
    async listarCustoVariavel(request, response) {
    try {
        const [custosVariaveis] = await db.query(
            'SELECT * FROM custo_variavel'
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de custos variáveis.',
            dados: custosVariaveis
        });

    } catch(error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
   async cadastrarcustoVariavel(request, response) {
    try {
        const {
            descricao,
            valor,
            id_produto
        } = request.body;
if (
    !campoObrigatorio(descricao) ||
    !campoObrigatorio(valor) ||
    !campoObrigatorio(id_produto)
) {
    return response.status(400).json({
        sucesso: false,
        mensagem: 'Preencha todos os campos obrigatórios.',
        dados: null
    });
}
if (!valorNaoNegativo(valor)) {
    return response.status(400).json({
        sucesso: false,
        mensagem: 'O valor não pode ser negativo.',
        dados: null
    });
}
const [produto] = await db.query(
    `SELECT id_produto
     FROM produto
     WHERE id_produto = ?`,
    [id_produto]
);

if (!existeRegistro(produto)) {
    return response.status(400).json({
        sucesso: false,
        mensagem: 'O produto informado não existe.',
        dados: null
    });
}
        const [resultado] = await db.query(
            `INSERT INTO custo_variavel
            (descricao, valor, id_produto)
            VALUES (?, ?, ?)`,
            [
                descricao,
                valor,
                id_produto
            ]
        );

        return response.status(201).json({
            sucesso: true,
            mensagem: 'Custo variável cadastrado com sucesso.',
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
   async editarcustoVariavel(request, response) {
    try {
        const {
            id_custo_variavel,
            descricao,
            valor,
            id_produto
        } = request.body;

        let campos = [];
        let valores = [];

        if (descricao !== undefined) {
            campos.push('descricao = ?');
            valores.push(descricao);
        }

        if (valor !== undefined) {
            campos.push('valor = ?');
            valores.push(valor);
        }

        if (id_produto !== undefined) {
            campos.push('id_produto = ?');
            valores.push(id_produto);
        }

        if (campos.length === 0) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Informe pelo menos um campo para alterar.',
                dados: null
            });
        }

        valores.push(id_custo_variavel);

        const [resultado] = await db.query(
            `UPDATE custo_variavel
             SET ${campos.join(', ')}
             WHERE id_custo_variavel = ?`,
            valores
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Custo variável editado com sucesso.',
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
   async apagarcustoVariavel(request, response) {
    try {
        const { id_custo_variavel } = request.body;

        const [resultado] = await db.query(
            `DELETE FROM custo_variavel
             WHERE id_custo_variavel = ?`,
            [id_custo_variavel]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Custo variável apagado com sucesso.',
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