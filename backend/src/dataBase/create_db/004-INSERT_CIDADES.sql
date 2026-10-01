-- =========================================================
-- 004 - INSERT-CIDADES.sql
-- Inserção das cidades/regiões utilizadas na precificação
-- Deve ser executado ANTES de 005-INSERT-REGISTROS.sql,
-- pois a tabela PRECIFICACAO depende de REGIAO.
-- =========================================================

USE db_precificacao;

INSERT INTO regiao (cidade_regiao, estado_regiao, indice_regiao, ticket_medio_regiao) VALUES
('Tupã',                'SP', 1.00, 45.00),
('São Paulo',           'SP', 1.35, 80.00),
('Marília',             'SP', 1.10, 55.00),
('Bauru',               'SP', 1.15, 58.00),
('Presidente Prudente', 'SP', 1.05, 50.00),
('Campinas',            'SP', 1.25, 70.00),
('Curitiba',            'PR', 1.20, 65.00),
('Belo Horizonte',      'MG', 1.18, 60.00),
('Rio de Janeiro',      'RJ', 1.40, 85.00),
('Porto Alegre',        'RS', 1.15, 62.00);