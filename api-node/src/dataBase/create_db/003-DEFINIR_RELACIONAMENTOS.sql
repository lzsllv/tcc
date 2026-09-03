-- =========================================================
-- 003 - DEFINIR_RELACIONAMENTOS.sql
-- Definição das chaves estrangeiras (FK) de acordo com o MER
-- =========================================================

USE db_precificacao;

-- EMPRESA (1:1) -> USUARIO
ALTER TABLE empresa
    ADD CONSTRAINT fk_empresa_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario);

-- CUSTO_FIXO -> EMPRESA
ALTER TABLE custo_fixo
    ADD CONSTRAINT fk_custofixo_empresa
    FOREIGN KEY (id_empresa) REFERENCES empresa (id_usuario);

-- CUSTO_FIXO -> CATEGORIA
ALTER TABLE custo_fixo
    ADD CONSTRAINT fk_custofixo_categoria
    FOREIGN KEY (categoria_custo_fixo) REFERENCES categoria (id_categoria);

-- PARAMETRO -> EMPRESA
ALTER TABLE parametro
    ADD CONSTRAINT fk_parametro_empresa
    FOREIGN KEY (id_empresa) REFERENCES empresa (id_usuario);

-- PRODUTO -> EMPRESA
ALTER TABLE produto
    ADD CONSTRAINT fk_produto_empresa
    FOREIGN KEY (id_empresa) REFERENCES empresa (id_usuario);

-- CUSTO_VARIAVEL -> PRODUTO
ALTER TABLE custo_variavel
    ADD CONSTRAINT fk_custovariavel_produto
    FOREIGN KEY (id_prod) REFERENCES produto (id_prod);

-- PRECIFICACAO -> PRODUTO
ALTER TABLE precificacao
    ADD CONSTRAINT fk_precificacao_produto
    FOREIGN KEY (id_prod) REFERENCES produto (id_prod);

-- PRECIFICACAO -> REGIAO
ALTER TABLE precificacao
    ADD CONSTRAINT fk_precificacao_regiao
    FOREIGN KEY (id_regiao) REFERENCES regiao (id_regiao);

-- PRECIFICACAO -> PARAMETRO
ALTER TABLE precificacao
    ADD CONSTRAINT fk_precificacao_parametro
    FOREIGN KEY (id_parametro) REFERENCES parametro (id_parametro);

-- SIMULACAO -> PRECIFICACAO
ALTER TABLE simulacao
    ADD CONSTRAINT fk_simulacao_precificacao
    FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao);

-- HISTORICO -> PRECIFICACAO
ALTER TABLE historico
    ADD CONSTRAINT fk_historico_precificacao
    FOREIGN KEY (id_precificacao) REFERENCES precificacao (id_precificacao);