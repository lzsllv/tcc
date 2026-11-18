USE bd_tcc_etim_124_precificacao;

-- Migracao aditiva para os dados usados pelo front-end Precifique.
-- Nao remove tabelas, colunas ou registros existentes.

ALTER TABLE custo_fixo ADD COLUMN id_frontend VARCHAR(36) NULL;

ALTER TABLE empresa
    ADD COLUMN logo_negocio LONGTEXT NULL,
    ADD COLUMN regiao_atuacao VARCHAR(150) NULL,
    ADD COLUMN custo_hora_centavos BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN margem_padrao_bps INT NOT NULL DEFAULT 2000;

CREATE TABLE IF NOT EXISTS insumo (
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
    CONSTRAINT fk_insumo_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS oferta (
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
    CONSTRAINT fk_oferta_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS ficha_tecnica_componente (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_frontend VARCHAR(36) NULL,
    id_oferta INT NOT NULL,
    id_insumo INT NOT NULL,
    quantidade DECIMAL(12,4) NOT NULL,
    unidade VARCHAR(10) NOT NULL,
    perda_bps INT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_componente_frontend_oferta (id_oferta, id_frontend),
    CONSTRAINT fk_componente_oferta FOREIGN KEY (id_oferta) REFERENCES oferta(id_oferta) ON DELETE CASCADE,
    CONSTRAINT fk_componente_insumo FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo)
);

CREATE TABLE IF NOT EXISTS canal_venda (
    id_canal INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_frontend VARCHAR(36) NULL,
    nome VARCHAR(120) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_canal_frontend_empresa (id_empresa, id_frontend),
    CONSTRAINT fk_canal_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS taxa_canal (
    id_taxa INT AUTO_INCREMENT PRIMARY KEY,
    id_frontend VARCHAR(36) NULL,
    id_canal INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    natureza VARCHAR(20) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    valor BIGINT NOT NULL,
    UNIQUE KEY uk_taxa_frontend_canal (id_canal, id_frontend),
    CONSTRAINT fk_taxa_canal FOREIGN KEY (id_canal) REFERENCES canal_venda(id_canal) ON DELETE CASCADE
);

CREATE INDEX idx_insumo_empresa ON insumo(id_empresa);
CREATE INDEX idx_oferta_empresa ON oferta(id_empresa);
CREATE INDEX idx_canal_empresa ON canal_venda(id_empresa);