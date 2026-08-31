-- =========================================================
-- 006 - RECURSOS.sql
-- Recursos extras do banco de dados: índices, view e trigger
-- =========================================================

USE db_precificacao;

-- ---------------------------------------------------------
-- ÍNDICES
-- Melhoram a performance de buscas pelas chaves estrangeiras
-- mais usadas nas consultas do sistema.
-- ---------------------------------------------------------
CREATE INDEX idx_produto_empresa       ON produto (id_empresa);
CREATE INDEX idx_custofixo_empresa     ON custo_fixo (id_empresa);
CREATE INDEX idx_custofixo_categoria   ON custo_fixo (categoria_custo_fixo);
CREATE INDEX idx_parametro_empresa     ON parametro (id_empresa);
CREATE INDEX idx_custovariavel_produto ON custo_variavel (id_prod);
CREATE INDEX idx_precificacao_produto  ON precificacao (id_prod);
CREATE INDEX idx_precificacao_regiao   ON precificacao (id_regiao);
CREATE INDEX idx_precificacao_parametro ON precificacao (id_parametro);
CREATE INDEX idx_simulacao_precificacao ON simulacao (id_precificacao);
CREATE INDEX idx_historico_precificacao ON historico (id_precificacao);

-- ---------------------------------------------------------
-- VIEW
-- Reúne as informações de precificação com os dados do
-- produto, da região e da empresa em uma única consulta,
-- facilitando a geração de relatórios.
-- ---------------------------------------------------------
CREATE OR REPLACE VIEW vw_precificacao_completa AS
SELECT
    pr.id_precificacao,
    e.nome_empresa,
    p.nome_prod,
    p.tipo_prod,
    r.cidade_regiao,
    r.estado_regiao,
    pr.custo_total_precificacao,
    pr.preco_sugerido_precificacao,
    pr.margem_real_precificacao,
    pr.mark_up_precificacao,
    pr.alerta_acima_mercado_precificacao,
    pr.alerta_prejuizo_precificacao,
    pr.dt_calculo_precificacao
FROM precificacao pr
INNER JOIN produto  p ON p.id_prod   = pr.id_prod
INNER JOIN regiao   r ON r.id_regiao = pr.id_regiao
INNER JOIN empresa  e ON e.id_usuario = p.id_empresa;

-- ---------------------------------------------------------
-- TRIGGER
-- Sempre que o preço sugerido ou a margem de uma precificação
-- forem alterados, o valor anterior é registrado
-- automaticamente em HISTORICO antes da atualização.
-- ---------------------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_precificacao_historico
BEFORE UPDATE ON precificacao
FOR EACH ROW
BEGIN
    IF OLD.preco_sugerido_precificacao <> NEW.preco_sugerido_precificacao
       OR OLD.margem_real_precificacao <> NEW.margem_real_precificacao THEN
        INSERT INTO historico (
            id_precificacao,
            preco_anterior_historico,
            margem_anterior_historico,
            dt_alteracao_historico
        ) VALUES (
            OLD.id_precificacao,
            OLD.preco_sugerido_precificacao,
            OLD.margem_real_precificacao,
            NOW()
        );
    END IF;
END$$

DELIMITER ;
