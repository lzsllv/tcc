-- =========================================================
-- 005 - INSERT-REGISTROS.sql
-- Inserção de registros de teste em todas as tabelas
-- Obs.: a ordem respeita as dependências de chave estrangeira
-- Pré-requisito: executar 004-INSERT-CIDADES.sql antes deste
-- =========================================================

USE db_precificacao;

-- ---------------------------------------------------------
-- USUARIO
-- ---------------------------------------------------------
INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, dt_cadastro, status_usuario) VALUES
('Ana Beatriz Souza',  'ana.souza@email.com',   '$2a$10$hashsenha1', NOW(), 'ATIVO'),
('Carlos Eduardo Lima','carlos.lima@email.com', '$2a$10$hashsenha2', NOW(), 'ATIVO'),
('Fernanda Alves',     'fernanda.alves@email.com', '$2a$10$hashsenha3', NOW(), 'INATIVO');

-- ---------------------------------------------------------
-- EMPRESA (id_usuario é PK e FK -> usuario.id_usuario)
-- ---------------------------------------------------------
INSERT INTO empresa (id_usuario, nome_empresa, cnpj_empresa, seguimento_empresa) VALUES
(1, 'Doce Sabor Confeitaria', '12345678000101', 'Alimentação'),
(2, 'Estilo Urbano Moda',     '23456789000102', 'Vestuário');

-- ---------------------------------------------------------
-- CATEGORIA
-- ---------------------------------------------------------
INSERT INTO categoria (nome_categoria) VALUES
('Aluguel'),
('Salários'),
('Energia Elétrica'),
('Internet e Telefonia');

-- ---------------------------------------------------------
-- CUSTO_FIXO
-- ---------------------------------------------------------
INSERT INTO custo_fixo (id_empresa, descricao_custo_fixo, valor_custo_fixo, categoria_custo_fixo) VALUES
(1, 'Aluguel da loja',        1500.00, 1),
(1, 'Conta de energia',       450.00,  3),
(2, 'Salário da equipe',      3200.00, 2),
(2, 'Internet e telefone',    180.00,  4);

-- ---------------------------------------------------------
-- PARAMETRO
-- ---------------------------------------------------------
INSERT INTO parametro (id_empresa, valor_hora_trabalhada_parametro, pro_labore_parametro, impostos_percentual_parametro, margem_desejada_parametro) VALUES
(1, 25.00, 2500.00, 8.00,  30.00),
(2, 30.00, 3000.00, 10.00, 40.00);

-- ---------------------------------------------------------
-- PRODUTO
-- ---------------------------------------------------------
INSERT INTO produto (id_empresa, nome_prod, descricao_prod, tipo_prod, custo_direto_prod, tempo_prod, preco_prod) VALUES
(1, 'Bolo de Chocolate',   'Bolo confeitado com cobertura de brigadeiro', 'Confeitaria', 35.00, 2.50, NULL),
(1, 'Torta de Morango',    'Torta com recheio de creme e morangos frescos', 'Confeitaria', 42.00, 3.00, NULL),
(2, 'Camiseta Estampada',  'Camiseta 100% algodão com estampa exclusiva', 'Vestuário', 18.00, 0.50, NULL);

-- ---------------------------------------------------------
-- CUSTO_VARIAVEL
-- ---------------------------------------------------------
INSERT INTO custo_variavel (id_prod, descricao_custo_variavel, valor_custo_variavel) VALUES
(1, 'Embalagem para entrega', 3.50),
(1, 'Taxa do cartão de crédito', 2.20),
(2, 'Embalagem para entrega', 4.00),
(3, 'Embalagem individual',  1.50);

-- Obs.: os registros de REGIAO já foram inseridos em
-- 004-INSERT-CIDADES.sql (executar aquele arquivo antes deste).

-- ---------------------------------------------------------
-- PRECIFICACAO
-- ---------------------------------------------------------
INSERT INTO precificacao (id_prod, id_regiao, id_parametro, margem_real_precificacao, preco_sugerido_precificacao, custo_total_precificacao, mark_up_precificacao, alerta_acima_mercado_precificacao, alerta_prejuizo_precificacao, dt_calculo_precificacao) VALUES
(1, 1, 1, 30.00, 55.00, 42.30, 1.30, FALSE, FALSE, NOW()),
(2, 2, 1, 28.50, 68.00, 52.90, 1.28, TRUE,  FALSE, NOW()),
(3, 3, 2, 40.00, 27.50, 19.50, 1.41, FALSE, FALSE, NOW());

-- ---------------------------------------------------------
-- SIMULACAO
-- ---------------------------------------------------------
INSERT INTO simulacao (id_precificacao, qnt_vendida_simulacao, faturamento_simulacao, lucro_previsto_simulacao) VALUES
(1, 50,  2750.00, 635.00),
(2, 30,  2040.00, 453.00),
(3, 100, 2750.00, 800.00);

-- ---------------------------------------------------------
-- HISTORICO
-- ---------------------------------------------------------
INSERT INTO historico (id_precificacao, preco_anterior_historico, margem_anterior_historico, dt_alteracao_historico) VALUES
(1, 52.00, 27.00, NOW()),
(2, 65.00, 26.00, NOW());