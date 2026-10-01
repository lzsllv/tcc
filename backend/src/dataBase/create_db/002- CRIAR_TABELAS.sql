DROP DATABASE IF EXISTS bd_tcc_etim_124_precificacao;

CREATE DATABASE bd_tcc_etim_124_precificacao;


USE bd_tcc_etim_124_precificacao;

-- =========================================================
-- 1. TABELA USUARIO
-- =========================================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT,
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(150) NOT NULL,
    senha_usuario VARCHAR(255) NOT NULL,
    dt_cadastro DATETIME NOT NULL,
    status_usuario VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuario_email (email_usuario)
);

-- =========================================================
-- 2. TABELA CATEGORIA
-- =========================================================

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT,
    nome_categoria VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_categoria)
);

-- =========================================================
-- 3. TABELA EMPRESA
-- =========================================================

CREATE TABLE empresa (
    id_empresa INT AUTO_INCREMENT,
    id_usuario INT,
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj_empresa VARCHAR(100) NOT NULL,
    seguimento_empresa VARCHAR(18) NOT NULL,
    PRIMARY KEY (id_empresa),
    UNIQUE KEY uk_empresa_cnpj (cnpj_empresa),
    CONSTRAINT fk_empresa_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

-- =========================================================
-- 4. TABELA PARAMETRO
-- =========================================================

CREATE TABLE parametro (
    id_parametro INT AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    horas_trabalhadas_parametro DECIMAL(10,2) NOT NULL,
    pro_labore_parametro DECIMAL(10,2) NOT NULL,
    impostos_percentual_parametro DECIMAL(10,2) NOT NULL,
    margem_desejada_parametro DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_parametro),
    CONSTRAINT fk_parametro_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 5. TABELA CUSTO_FIXO
-- =========================================================

CREATE TABLE custo_fixo (
    id_custo_fixo INT AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    descricao_custo_fixo VARCHAR(150) NOT NULL,
    valor_custo_fixo DECIMAL(10,2) NOT NULL,
    categoria_custo_fixo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_custo_fixo),
    CONSTRAINT fk_custo_fixo_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 6. TABELA PRODUTO
-- =========================================================

CREATE TABLE produto (
    id_prod INT AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    nome_prod VARCHAR(120) NOT NULL,
    descricao_prod VARCHAR(255) NULL,
    tipo_prod VARCHAR(50) NOT NULL,
    custo_direto_prod DECIMAL(10,2) NOT NULL,
    tempo_prod DECIMAL(10,2) NOT NULL,
    preco_prod DECIMAL(10,2) NULL,
    PRIMARY KEY (id_prod),
    CONSTRAINT fk_produto_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 7. TABELA CUSTO_VARIAVEL
-- =========================================================

CREATE TABLE custo_variavel (
    id_custo_variavel INT AUTO_INCREMENT,
    id_prod INT NOT NULL,
    descricao_custo_variavel VARCHAR(150) NOT NULL,
    valor_custo_variavel DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_custo_variavel),
    CONSTRAINT fk_custo_variavel_produto
        FOREIGN KEY (id_prod) REFERENCES produto (id_prod)
);

-- =========================================================
-- 8. TABELA REGIAO
-- =========================================================

CREATE TABLE regiao (
    id_regiao INT AUTO_INCREMENT,
    cidade_regiao VARCHAR(100) NOT NULL,
    estado_regiao VARCHAR(50) NOT NULL,
    indice_regiao DECIMAL(10,2) NOT NULL,
    ticket_medio_regiao DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_regiao)
);

-- =========================================================
-- 9. TABELA PRECIFICACAO
-- =========================================================

CREATE TABLE precificacao (
    id_precificacao INT AUTO_INCREMENT,
    id_prod INT NOT NULL,
    id_regiao INT NOT NULL,
    id_parametro INT NOT NULL,
    margem_real_precificacao DECIMAL(5,2) NOT NULL,
    preco_sugerido_precificacao DECIMAL(10,2) NOT NULL,
    custo_total_precificacao DECIMAL(10,2) NOT NULL,
    mark_up_precificacao DECIMAL(5,2) NOT NULL,
    alerta_acima_mercado_precificacao BOOLEAN NOT NULL,
    alerta_prejuizo_precificacao BOOLEAN NOT NULL,
    dt_calculo_precificacao DATETIME NOT NULL,
    PRIMARY KEY (id_precificacao),
    CONSTRAINT fk_precificacao_produto
        FOREIGN KEY (id_prod) REFERENCES produto (id_prod),
    CONSTRAINT fk_precificacao_regiao
        FOREIGN KEY (id_regiao) REFERENCES regiao (id_regiao),
    CONSTRAINT fk_precificacao_parametro
        FOREIGN KEY (id_parametro) REFERENCES parametro (id_parametro)
);

-- =========================================================
-- 10. TABELA SIMULACAO
-- =========================================================

CREATE TABLE simulacao (
    id_simulacao INT AUTO_INCREMENT,
    id_precificacao INT NOT NULL,
    qnt_vendida_simulacao INT NOT NULL,
    faturamento_simulacao DECIMAL(10,2) NOT NULL,
    lucro_previsto_simulacao DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_simulacao),
    CONSTRAINT fk_simulacao_precificacao
        FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao)
);

-- =========================================================
-- 11. TABELA HISTORICO
-- =========================================================

CREATE TABLE historico (
    id_historico INT AUTO_INCREMENT,
    id_precificacao INT NOT NULL,
    preco_anterior_historico DECIMAL(10,2) NOT NULL,
    margem_anterior_historico DECIMAL(5,2) NOT NULL,
    dt_alteracao_historico DATETIME NOT NULL,
    PRIMARY KEY (id_historico),
    CONSTRAINT fk_historico_precificacao
        FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao)
);