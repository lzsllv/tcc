CREATE DATABASE IF NOT EXISTS bd_tcc_etim_124_precificacao;

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
    id_usuario INT NOT NULL,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj VARCHAR(100) NOT NULL,
    segmento VARCHAR(18) NOT NULL,
    logo_negocio LONGTEXT NULL,
    regiao_atuacao VARCHAR(150) NULL,
    custo_hora_centavos BIGINT NOT NULL DEFAULT 0,
    margem_padrao_bps INT NOT NULL DEFAULT 2000,
    PRIMARY KEY (id_empresa),
    UNIQUE KEY uk_empresa_cnpj (cnpj),
    CONSTRAINT fk_empresa_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);
-- =========================================================
-- 4. TABELA PARAMETRO_PRECIFICACAO
-- =========================================================

CREATE TABLE parametro_precificacao (
    id_parametro INT AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    horas_trabalhadas_mes DECIMAL(10,2) NOT NULL,
    pro_labore DECIMAL(10,2) NOT NULL,
    impostos_percentual DECIMAL(10,2) NOT NULL,
    margem_desejada DECIMAL(10,2) NOT NULL,
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
    descricao VARCHAR(150) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    id_frontend VARCHAR(36) NULL,
    PRIMARY KEY (id_custo_fixo),
    CONSTRAINT fk_custo_fixo_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);
-- =========================================================
-- 6. TABELA PRODUTO
-- =========================================================

CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(255) NULL,
    tipo VARCHAR(50) NOT NULL,
    custo_direto DECIMAL(10,2) NOT NULL,
    tempo_producao DECIMAL(10,2) NOT NULL,
    preco_minimo DECIMAL(10,2) NULL,
    imagem VARCHAR(255) NULL,
    PRIMARY KEY (id_produto),
    CONSTRAINT fk_produto_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 7. TABELA CUSTO_VARIAVEL
-- =========================================================

CREATE TABLE custo_variavel (
    id_custo_variavel INT AUTO_INCREMENT,
    id_produto INT NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_custo_variavel),
    CONSTRAINT fk_custo_variavel_produto
        FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
);

-- =========================================================
-- 8. TABELA REGIAO
-- =========================================================

CREATE TABLE regiao (
    id_regiao INT AUTO_INCREMENT,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    indice_custo_regional DECIMAL(10,2) NOT NULL,
    ticket_medio_regional DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_regiao)
);

-- =========================================================
-- 9. TABELA PRECIFICACAO
-- =========================================================

CREATE TABLE precificacao (
    id_precificacao INT AUTO_INCREMENT,
    id_produto INT NOT NULL,
    id_regiao INT NOT NULL,
    id_parametro INT NOT NULL,
    margem_real DECIMAL(5,2) NOT NULL,
    preco_sugerido DECIMAL(10,2) NOT NULL,
    custo_total DECIMAL(10,2) NOT NULL,
    mark_up DECIMAL(5,2) NOT NULL,
    alerta_acima_mercado BOOLEAN NOT NULL,
    alerta_prejuizo BOOLEAN NOT NULL,
    data_calculo DATETIME NOT NULL,
    PRIMARY KEY (id_precificacao),
    CONSTRAINT fk_precificacao_produto
        FOREIGN KEY (id_produto) REFERENCES produto (id_produto),
    CONSTRAINT fk_precificacao_regiao
        FOREIGN KEY (id_regiao) REFERENCES regiao (id_regiao),
    CONSTRAINT fk_precificacao_parametro
        FOREIGN KEY (id_parametro) REFERENCES parametro_precificacao (id_parametro)
);
-- =========================================================
-- 10. TABELA SIMULACAO_LUCRO
-- =========================================================

CREATE TABLE simulacao_lucro (
    id_simulacao INT AUTO_INCREMENT,
    id_precificacao INT NOT NULL,
    quantidade_vendida INT NOT NULL,
    faturamento_previsto DECIMAL(10,2) NOT NULL,
    lucro_previsto DECIMAL(10,2) NOT NULL,
    ponto_equilibrio DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_simulacao),
    CONSTRAINT fk_simulacao_lucro_precificacao
        FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao)
);

-- =========================================================
-- 11. TABELA HISTORICO_PRECIFICACAO
-- =========================================================

CREATE TABLE historico_precificacao (
    id_historico INT AUTO_INCREMENT,
    id_precificacao INT NOT NULL,
    preco_anterior DECIMAL(10,2) NOT NULL,
    margem_anterior DECIMAL(5,2) NOT NULL,
    data_alteracao DATETIME NOT NULL,
    PRIMARY KEY (id_historico),
    CONSTRAINT fk_historico_precificacao
        FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao)
);

-- =========================================================
-- 12. TABELA INSUMO
-- =========================================================

CREATE TABLE insumo (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_frontend VARCHAR(36) NULL,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    preco_compra_centavos BIGINT NOT NULL,
    quantidade_compra DECIMAL(12,4) NOT NULL,
    unidade_compra VARCHAR(10) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_insumo_frontend_empresa (id_empresa, id_frontend),
    CONSTRAINT fk_insumo_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 13. TABELA OFERTA
-- =========================================================

CREATE TABLE oferta (
    id_oferta INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_frontend VARCHAR(36) NULL,
    tipo VARCHAR(20) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL DEFAULT 'Outro',
    rendimento DECIMAL(12,4) NOT NULL DEFAULT 1,
    tempo_lote_minutos DECIMAL(12,2) NOT NULL DEFAULT 0,
    vendas_mensais DECIMAL(12,2) NOT NULL DEFAULT 0,
    margem_desejada_bps INT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_oferta_frontend_empresa (id_empresa, id_frontend),
    CONSTRAINT fk_oferta_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 14. TABELA FICHA_TECNICA_COMPONENTE
-- =========================================================

CREATE TABLE ficha_tecnica_componente (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_frontend VARCHAR(36) NULL,
    id_oferta INT NOT NULL,
    id_insumo INT NOT NULL,
    quantidade DECIMAL(12,4) NOT NULL,
    unidade VARCHAR(10) NOT NULL,
    perda_bps INT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_componente_frontend_oferta (id_oferta, id_frontend),
    CONSTRAINT fk_componente_oferta
        FOREIGN KEY (id_oferta) REFERENCES oferta (id_oferta) ON DELETE CASCADE,
    CONSTRAINT fk_componente_insumo
        FOREIGN KEY (id_insumo) REFERENCES insumo (id_insumo)
);

-- =========================================================
-- 15. TABELA CANAL_VENDA
-- =========================================================

CREATE TABLE canal_venda (
    id_canal INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_frontend VARCHAR(36) NULL,
    nome VARCHAR(120) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_canal_frontend_empresa (id_empresa, id_frontend),
    CONSTRAINT fk_canal_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

-- =========================================================
-- 16. TABELA TAXA_CANAL
-- =========================================================

CREATE TABLE taxa_canal (
    id_taxa INT AUTO_INCREMENT PRIMARY KEY,
    id_frontend VARCHAR(36) NULL,
    id_canal INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    natureza VARCHAR(20) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    valor BIGINT NOT NULL,
    UNIQUE KEY uk_taxa_frontend_canal (id_canal, id_frontend),
    CONSTRAINT fk_taxa_canal
        FOREIGN KEY (id_canal) REFERENCES canal_venda (id_canal) ON DELETE CASCADE
);

-- =========================================================
-- INDICES ADICIONAIS
-- =========================================================

CREATE INDEX idx_insumo_empresa ON insumo (id_empresa);
CREATE INDEX idx_oferta_empresa ON oferta (id_empresa);
CREATE INDEX idx_canal_empresa ON canal_venda (id_empresa);
