const bcrypt = require('bcrypt');
const db = require('../database/connection');

module.exports = {

    async listarUsuarios(request, response) {
        try {
            const [usuarios] = await db.query(
                'SELECT * FROM usuario'
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: usuarios
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarUsuarios(request, response) {
        try {
            const {
                nome_usuario,
                email_usuario,
                senha_usuario,
                dt_cadastro,
                status_usuario
            } = request.body;
            console.log(request.body);

            const senhaCriptografada = await bcrypt.hash(senha_usuario, 10);
            const [resultado] = await db.query(
                `INSERT INTO usuario
                (nome_usuario, email_usuario, senha_usuario, dt_cadastro, status_usuario)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    nome_usuario,
                    email_usuario,
                    senhaCriptografada,
                    dt_cadastro,
                    status_usuario
                ]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
async login(request, response) {
    try {
        const {
            email_usuario,
            senha_usuario
        } = request.body;

        const [usuarios] = await db.query(
            `SELECT *
             FROM usuario
             WHERE email_usuario = ?`,
            [email_usuario]
        );

        if (usuarios.length === 0) {
            return response.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha inválidos.',
                dados: null
            });
        }

        const usuario = usuarios[0];

        const senhaValida = await bcrypt.compare(
            senha_usuario,
            usuario.senha_usuario
        );

        if (!senhaValida) {
            return response.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha inválidos.',
                dados: null
            });
        }

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso.',
            dados: {
                id_usuario: usuario.id_usuario,
                nome_usuario: usuario.nome_usuario,
                email_usuario: usuario.email_usuario
            }
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
async alterarSenha(request, response) {
    try {
        const {
            id_usuario,
            senha_atual,
            nova_senha
        } = request.body;

        const [usuarios] = await db.query(
            `SELECT senha_usuario
             FROM usuario
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (usuarios.length === 0) {
            return response.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.',
                dados: null
            });
        }

        const senhaValida = await bcrypt.compare(
            senha_atual,
            usuarios[0].senha_usuario
        );

        if (!senhaValida) {
            return response.status(401).json({
                sucesso: false,
                mensagem: 'Senha atual inválida.',
                dados: null
            });
        }

        const novaSenhaCriptografada = await bcrypt.hash(
            nova_senha,
            10
        );

        const [resultado] = await db.query(
            `UPDATE usuario
             SET senha_usuario = ?
             WHERE id_usuario = ?`,
            [
                novaSenhaCriptografada,
                id_usuario
            ]
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Senha alterada com sucesso.',
            dados: resultado
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},
    async editarUsuarios(request, response) {
    try {
        const {
            id_usuario,
            nome_usuario,
            email_usuario,
            senha_usuario
        } = request.body;

        let campos = [];
        let valores = [];

        if (nome_usuario !== undefined) {
            campos.push('nome_usuario = ?');
            valores.push(nome_usuario);
        }

        if (email_usuario !== undefined) {
            campos.push('email_usuario = ?');
            valores.push(email_usuario);
        }

        if (senha_usuario !== undefined) {
            campos.push('senha_usuario = ?');
            valores.push(senha_usuario);
        }

        if (campos.length === 0) {
            return response.status(400).json({
                sucesso: false,
                mensagem: 'Informe pelo menos um campo para alterar.',
                dados: null
            });
        }

        valores.push(id_usuario);

        const [resultado] = await db.query(
            `UPDATE usuario
             SET ${campos.join(', ')}
             WHERE id_usuario = ?`,
            valores
        );

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuário editado com sucesso.',
            dados: resultado
        });

    } catch (error) {
        return response.status(500).json({
            sucesso: false,
            mensagem: 'Erro na requisição.',
            dados: error.message
        });
    }
},

    async apagarUsuarios(request, response) {
        try {
            const { id_usuario } = request.body;

            const [resultado] = await db.query(
                `DELETE FROM usuario
                 WHERE id_usuario = ?`,
                [id_usuario]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuário apagado com sucesso.',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }

};