const db = require('../dataBase/connection');

module.exports = {
  async listar(request, response) {
    try {
      const { id_empresa } = request.params;
      const [rows] = await db.query(
        `SELECT nome_fantasia, logo_negocio, regiao_atuacao, custo_hora_centavos, margem_padrao_bps
         FROM empresa WHERE id_empresa=?`, [id_empresa]);
      if (!rows.length) return response.status(404).json({ sucesso: false, mensagem: 'Empresa não encontrada.' });
      const row = rows[0];
      return response.status(200).json({ sucesso: true, dados: {
        nomeNegocio: row.nome_fantasia, logoNegocio: row.logo_negocio || '', regiaoAtuacao: row.regiao_atuacao || '',
        custoHora: Number(row.custo_hora_centavos) / 100, margemLucro: Number(row.margem_padrao_bps) / 100
      }});
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao consultar configurações.', dados: error.message }); }
  },
  async salvar(request, response) {
    try {
      const { id_empresa } = request.params;
      const { nomeNegocio, logoNegocio = '', regiaoAtuacao = '', custoHora, margemLucro } = request.body;
      if (!nomeNegocio || !Number.isFinite(Number(custoHora)) || Number(custoHora) < 0 || !Number.isFinite(Number(margemLucro)) || Number(margemLucro) <= 0 || Number(margemLucro) >= 100)
        return response.status(400).json({ sucesso: false, mensagem: 'Dados de configuração inválidos.' });
      const [result] = await db.query(
        `UPDATE empresa SET nome_fantasia=?,logo_negocio=?,regiao_atuacao=?,custo_hora_centavos=?,margem_padrao_bps=? WHERE id_empresa=?`,
        [nomeNegocio.trim(),logoNegocio,regiaoAtuacao,Math.round(Number(custoHora)*100),Math.round(Number(margemLucro)*100),id_empresa]);
      if (!result.affectedRows) return response.status(404).json({ sucesso: false, mensagem: 'Empresa não encontrada.' });
      return response.status(200).json({ sucesso: true, mensagem: 'Configurações salvas.' });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao salvar configurações.', dados: error.message }); }
  }
};
