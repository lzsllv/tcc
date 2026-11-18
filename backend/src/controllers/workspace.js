const db = require('../dataBase/connection');

const FIXED_KEYS = ['aluguel', 'energia', 'internet', 'salarios', 'outros'];

module.exports = {
  async listarCustosFixos(request, response) {
    try {
      const { id_empresa } = request.params;
      const [rows] = await db.query(
        `SELECT id_frontend, descricao, valor, categoria FROM custo_fixo
         WHERE id_empresa=? AND categoria LIKE 'front:%' ORDER BY id_custo_fixo`, [id_empresa]);
      const dados = { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
      for (const row of rows) {
        const key = row.categoria.slice(6);
        if (FIXED_KEYS.includes(key)) dados[key] = Number(row.valor);
        else if (key === 'extra') dados.extras.push({ id: row.id_frontend || `extra-${row.descricao}`, descricao: row.descricao, valor: Number(row.valor) });
      }
      return response.status(200).json({ sucesso: true, dados });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao listar custos fixos.', dados: error.message }); }
  },
  async salvarCustosFixos(request, response) {
    const connection = await db.getConnection();
    try {
      const { id_empresa } = request.params;
      const costs = request.body;
      if (!costs || !Array.isArray(costs.extras)) return response.status(400).json({ sucesso: false, mensagem: 'Estrutura de custos fixos inválida.' });
      for (const key of FIXED_KEYS) if (!Number.isFinite(Number(costs[key] ?? 0)) || Number(costs[key] ?? 0) < 0)
        return response.status(400).json({ sucesso: false, mensagem: `Valor inválido para ${key}.` });
      await connection.beginTransaction();
      await connection.query("DELETE FROM custo_fixo WHERE id_empresa=? AND categoria LIKE 'front:%'", [id_empresa]);
      for (const key of FIXED_KEYS) {
        await connection.query(
          'INSERT INTO custo_fixo (id_empresa,id_frontend,descricao,valor,categoria) VALUES (?,?,?,?,?)',
          [id_empresa,`fixed-${key}`,key,Number(costs[key] ?? 0),`front:${key}`]);
      }
      for (const extra of costs.extras) {
        if (!String(extra.descricao || '').trim() || !Number.isFinite(Number(extra.valor)) || Number(extra.valor) < 0) throw new Error('Existe um gasto extra inválido.');
        await connection.query(
          'INSERT INTO custo_fixo (id_empresa,id_frontend,descricao,valor,categoria) VALUES (?,?,?,?,?)',
          [id_empresa,String(extra.id || `extra-${Date.now()}`).slice(0,36),String(extra.descricao).trim(),Number(extra.valor),'front:extra']);
      }
      await connection.commit();
      return response.status(200).json({ sucesso: true, mensagem: 'Custos fixos salvos.' });
    } catch (error) { await connection.rollback(); return response.status(400).json({ sucesso: false, mensagem: 'Erro ao salvar custos fixos.', dados: error.message }); }
    finally { connection.release(); }
  }
};
