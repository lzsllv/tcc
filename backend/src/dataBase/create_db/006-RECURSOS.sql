
-- =========================================================
-- 006 - RECURSOS.sql
-- Recursos extras do banco de dados: índices, view e trigger
-- =========================================================

USE bd_tcc_etim_124_precificacao;

-- ---------------------------------------------------------
-- ÍNDICE
-- ---------------------------------------------------------
CREATE INDEX idx_custofixo_categoria
ON custo_fixo (categoria);

-- ---------------------------------------------------------
-- VIEW
-- Reúne informações de precificação, produto, região e empresa.
-- ---------------------------------------------------------
CREATE OR REPLACE VIEW vw_precificacao_completa AS
SELECT
    pr.id_precificacao,
    e.nome_fantasia,
    p.nome,
    p.tipo,
    r.cidade,
    r.estado,
    pr.custo_total,
    pr.preco_sugerido,
    pr.margem_real,
    pr.mark_up,
    pr.alerta_acima_mercado,
    pr.alerta_prejuizo,
    pr.data_calculo
FROM precificacao pr
INNER JOIN produto p
    ON p.id_produto = pr.id_produto
INNER JOIN regiao r
    ON r.id_regiao = pr.id_regiao
INNER JOIN empresa e
    ON e.id_empresa = p.id_empresa;

-- ---------------------------------------------------------
-- TRIGGER
-- Registra o preço e a margem anteriores no histórico
-- antes da atualização de uma precificação.
-- ---------------------------------------------------------
DELIMITER $$

DROP TRIGGER IF EXISTS trg_precificacao_historico$$

CREATE TRIGGER trg_precificacao_historico
BEFORE UPDATE ON precificacao
FOR EACH ROW
BEGIN
    IF OLD.preco_sugerido <> NEW.preco_sugerido
       OR OLD.margem_real <> NEW.margem_real THEN

        INSERT INTO historico_precificacao (
            id_precificacao,
            preco_anterior,
            margem_anterior,
            data_alteracao
        ) VALUES (
            OLD.id_precificacao,
            OLD.preco_sugerido,
            OLD.margem_real,
            NOW()
        );

    END IF;
END$$

DELIMITER ;

-- apagar tabelas e reiniciar o banco de dados

USE bd_tcc_etim_124_precificacao;

DROP TABLE IF EXISTS historico_precificacao;
DROP TABLE IF EXISTS simulacao_lucro;
DROP TABLE IF EXISTS precificacao;
DROP TABLE IF EXISTS ficha_tecnica_componente;
DROP TABLE IF EXISTS taxa_canal;
DROP TABLE IF EXISTS custo_variavel;
DROP TABLE IF EXISTS custo_fixo;
DROP TABLE IF EXISTS parametro_precificacao;
DROP TABLE IF EXISTS produto;
DROP TABLE IF EXISTS oferta;
DROP TABLE IF EXISTS insumo;
DROP TABLE IF EXISTS canal_venda;
DROP TABLE IF EXISTS regiao;
DROP TABLE IF EXISTS empresa;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS usuario;


-- resetar id - usar somente se necessário, pois pode causar problemas de integridade referencial
ALTER TABLE usuario AUTO_INCREMENT = 1;
