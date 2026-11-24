USE bd_tcc_etim_124_precificacao;

-- Adiciona arquivamento reversível aos produtos cadastrados no servidor.
ALTER TABLE produto
    ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;
