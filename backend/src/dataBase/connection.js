require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.BD_SERVIDOR,
    port: process.env.BD_PORTA || 3306,
    user: process.env.BD_USUARIO,
    password: process.env.BD_SENHA,
    database: process.env.BD_BANCO,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(config);

pool.getConnection()
    .then((connection) => {
        console.log('Conexão MySQL estabelecida com sucesso!');
        connection.release();
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco de dados:', error.message);
    });

module.exports = pool;