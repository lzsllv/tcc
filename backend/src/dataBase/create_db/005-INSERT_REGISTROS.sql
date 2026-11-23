USE bd_tcc_etim_124_precificacao;

-- ---------------------------------------------------------
-- USUARIO
-- ---------------------------------------------------------
INSERT INTO usuario (
    nome_usuario,
    email_usuario,
    senha_usuario,
    dt_cadastro,
    status_usuario
) VALUES
('Ana Beatriz Souza', 'ana.souza@email.com', '$2b$10$2TSrMuN4TvZqCk9/RkLPF.koHnLnRPpPwGVpfemv7lDR55taPqqrW', NOW(), 'Ativo'),
('Carlos Eduardo Lima', 'carlos.lima@email.com', '$2b$10$2TSrMuN4TvZqCk9/RkLPF.koHnLnRPpPwGVpfemv7lDR55taPqqrW', NOW(), 'Ativo'),
('Fernanda Alves', 'fernanda.alves@email.com', '$2b$10$2TSrMuN4TvZqCk9/RkLPF.koHnLnRPpPwGVpfemv7lDR55taPqqrW', NOW(), 'Ativo');

-- ---------------------------------------------------------
-- EMPRESA
-- ---------------------------------------------------------
INSERT INTO empresa (
    id_usuario,
    nome_fantasia,
    cnpj,
    segmento
) VALUES
(1, 'Doce Sabor Confeitaria', '12345678000101', 'Alimentação'),
(2, 'Estilo Urbano Moda', '23456789000102', 'Vestuário');

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
INSERT INTO custo_fixo (
    id_empresa,
    descricao,
    valor,
    categoria
) VALUES
(1, 'Aluguel da loja', 1500.00, 'Aluguel'),
(1, 'Conta de energia', 450.00, 'Energia Elétrica'),
(2, 'Salário da equipe', 3200.00, 'Salários'),
(2, 'Internet e telefone', 180.00, 'Internet e Telefonia');

-- ---------------------------------------------------------
-- PARAMETRO_PRECIFICACAO
-- ---------------------------------------------------------
INSERT INTO parametro_precificacao (
    id_empresa,
    horas_trabalhadas_mes,
    pro_labore,
    impostos_percentual,
    margem_desejada
) VALUES
(1, 25.00, 2500.00, 8.00, 30.00),
(2, 30.00, 3000.00, 10.00, 40.00);

-- ---------------------------------------------------------
-- PRODUTO
-- ---------------------------------------------------------
INSERT INTO produto (
    id_empresa,
    nome,
    descricao,
    tipo,
    custo_direto,
    tempo_producao,
    preco_minimo
) VALUES
(1, 'Bolo de Chocolate', 'Bolo confeitado com cobertura de brigadeiro', 'Confeitaria', 35.00, 2.50, NULL),
(1, 'Torta de Morango', 'Torta com recheio de creme e morangos frescos', 'Confeitaria', 42.00, 3.00, NULL),
(2, 'Camiseta Estampada', 'Camiseta 100% algodão com estampa exclusiva', 'Vestuário', 18.00, 0.50, NULL);

-- ---------------------------------------------------------
-- CUSTO_VARIAVEL
-- ---------------------------------------------------------
INSERT INTO custo_variavel (
    id_produto,
    descricao,
    valor
) VALUES
(1, 'Embalagem para entrega', 3.50),
(1, 'Taxa do cartão de crédito', 2.20),
(2, 'Embalagem para entrega', 4.00),
(3, 'Embalagem individual', 1.50);

-- ---------------------------------------------------------
-- PRECIFICACAO
-- ---------------------------------------------------------
-- Obs.: os registros de REGIAO devem existir previamente.

INSERT INTO precificacao (
    id_produto,
    id_regiao,
    id_parametro,
    margem_real,
    preco_sugerido,
    custo_total,
    mark_up,
    alerta_acima_mercado,
    alerta_prejuizo,
    data_calculo
) VALUES
(1, 1, 1, 30.00, 55.00, 42.30, 1.30, FALSE, FALSE, NOW()),
(2, 2, 1, 28.50, 68.00, 52.90, 1.28, TRUE, FALSE, NOW()),
(3, 3, 2, 40.00, 27.50, 19.50, 1.41, FALSE, FALSE, NOW());

-- ---------------------------------------------------------
-- SIMULACAO_LUCRO
-- ---------------------------------------------------------
INSERT INTO simulacao_lucro (
    id_precificacao,
    quantidade_vendida,
    faturamento_previsto,
    lucro_previsto,
    ponto_equilibrio
) VALUES
(1, 50, 2750.00, 635.00, 35.00),
(2, 30, 2040.00, 453.00, 28.00),
(3, 100, 2750.00, 800.00, 45.00);

-- ---------------------------------------------------------
-- HISTORICO_PRECIFICACAO
-- ---------------------------------------------------------
INSERT INTO historico_precificacao (
    id_precificacao,
    preco_anterior,
    margem_anterior,
    data_alteracao
) VALUES
(1, 52.00, 27.00, NOW()),
(2, 65.00, 26.00, NOW());