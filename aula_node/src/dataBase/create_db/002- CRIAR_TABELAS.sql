-- =========================================================
-- 002 - CRIAR_TABELAS.sql
-- Criação das tabelas de acordo com o MER e o dicionário de dados
-- Obs.: os relacionamentos (FOREIGN KEY) são definidos em
-- 003-DEFINIR_RELACIONAMENTOS.sql
-- =========================================================

USE db_precificacao;

-- ---------------------------------------------------------
-- USUARIO
-- ---------------------------------------------------------
CREATE TABLE usuario (
    id_usuario      INT AUTO_INCREMENT,
    nome_usuario    VARCHAR(100)    NOT NULL,
    email_usuario   VARCHAR(150)    NOT NULL,
    senha_usuario   VARCHAR(255)    NOT NULL,
    dt_cadastro     DATETIME        NOT NULL,
    status_usuario  VARCHAR(20)     NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuario_email (email_usuario)
);