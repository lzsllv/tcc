const bcrypt = require('bcrypt');
const db = require('../database/connection');

async function migrarSenhas() {
    try {
        const [usuarios] = await db.query(
            `SELECT id_usuario, senha_usuario
             FROM usuario`
        );

        for (const usuario of usuarios) {

            if (usuario.senha_usuario.startsWith('$2b$')) {
                continue;
            }

            const senhaCriptografada = await bcrypt.hash(
                usuario.senha_usuario,
                10
            );

            await db.query(
                `UPDATE usuario
                 SET senha_usuario = ?
                 WHERE id_usuario = ?`,
                [
                    senhaCriptografada,
                    usuario.id_usuario
                ]
            );

            console.log(
                `Senha do usuário ${usuario.id_usuario} atualizada.`
            );
        }

        console.log('Migração de senhas concluída.');

    } catch (error) {
        console.error('Erro ao migrar senhas:', error.message);
    } finally {
        process.exit();
    }
}

migrarSenhas();