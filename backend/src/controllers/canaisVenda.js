const db = require('../dataBase/connection');

module.exports = {
  async listar(request, response) {
    try {
      const { id_empresa } = request.query;
      if (!id_empresa) return response.status(400).json({ sucesso: false, mensagem: 'Informe id_empresa.' });
      const [channels] = await db.query('SELECT * FROM canal_venda WHERE id_empresa=? ORDER BY id_canal', [id_empresa]);
      const dados = [];
      for (const channel of channels) {
        const [fees] = await db.query('SELECT id_frontend,nome,natureza,categoria,valor FROM taxa_canal WHERE id_canal=?', [channel.id_canal]);
        dados.push({ id: channel.id_frontend || String(channel.id_canal), name: channel.nome, active: !!channel.ativo,
          isDefault: !!channel.padrao, fees: fees.map(f => ({ id: f.id_frontend, name: f.nome, kind: f.natureza, category: f.categoria, value: Number(f.valor) })) });
      }
      return response.status(200).json({ sucesso: true, dados });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao listar canais.', dados: error.message }); }
  },
  async cadastrar(request, response) {
    const connection = await db.getConnection();
    try {
      const { id_empresa, id, name, fees = [] } = request.body;
      if (!id_empresa || !name || !Array.isArray(fees)) return response.status(400).json({ sucesso: false, mensagem: 'Dados do canal inválidos.' });
      const percentageTotal = fees.filter(f => f.kind === 'percentage').reduce((sum, f) => sum + Number(f.value || 0), 0);
      if (percentageTotal >= 10000) return response.status(400).json({ sucesso: false, mensagem: 'A soma das taxas percentuais deve ser menor que 100%.' });
      await connection.beginTransaction();
      const [result] = await connection.query('INSERT INTO canal_venda (id_empresa,id_frontend,nome,padrao) VALUES (?,?,?,?)', [id_empresa,id || null,name.trim(),0]);
      for (const fee of fees) {
        if (!fee.name || !['percentage','fixed'].includes(fee.kind) || !['tax','payment','marketplace','other'].includes(fee.category) || !Number.isInteger(fee.value) || fee.value < 0) throw new Error('Dados de uma taxa são inválidos.');
        await connection.query('INSERT INTO taxa_canal (id_frontend,id_canal,nome,natureza,categoria,valor) VALUES (?,?,?,?,?,?)', [fee.id || null,result.insertId,fee.name.trim(),fee.kind,fee.category,fee.value]);
      }
      await connection.commit();
      return response.status(201).json({ sucesso: true, dados: { id: id || String(result.insertId) } });
    } catch (error) { await connection.rollback(); return response.status(400).json({ sucesso: false, mensagem: 'Erro ao cadastrar canal.', dados: error.message }); }
    finally { connection.release(); }
  },
  async editar(request, response) {
    const connection = await db.getConnection();
    try {
      const { id_empresa, id, name, fees = [], active = true, isDefault = false } = request.body;
      const [found] = await connection.query('SELECT id_canal FROM canal_venda WHERE id_empresa=? AND (id_frontend=? OR CAST(id_canal AS CHAR)=?)', [id_empresa,id,id]);
      if (!found.length || !name || !Array.isArray(fees)) return response.status(404).json({ sucesso: false, mensagem: 'Canal não encontrado ou dados inválidos.' });
      const percentageTotal = fees.filter(f => f.kind === 'percentage').reduce((sum, f) => sum + Number(f.value || 0), 0);
      if (percentageTotal >= 10000) return response.status(400).json({ sucesso: false, mensagem: 'A soma das taxas percentuais deve ser menor que 100%.' });
      await connection.beginTransaction();
      const channelId = found[0].id_canal;
      if (isDefault) await connection.query('UPDATE canal_venda SET padrao=0 WHERE id_empresa=?', [id_empresa]);
      await connection.query('UPDATE canal_venda SET nome=?,ativo=?,padrao=? WHERE id_canal=?', [name.trim(),active ? 1 : 0,isDefault ? 1 : 0,channelId]);
      await connection.query('DELETE FROM taxa_canal WHERE id_canal=?', [channelId]);
      for (const fee of fees) {
        if (!fee.name || !['percentage','fixed'].includes(fee.kind) || !['tax','payment','marketplace','other'].includes(fee.category) || !Number.isInteger(fee.value) || fee.value < 0) throw new Error('Dados de uma taxa são inválidos.');
        await connection.query('INSERT INTO taxa_canal (id_frontend,id_canal,nome,natureza,categoria,valor) VALUES (?,?,?,?,?,?)', [fee.id || null,channelId,fee.name.trim(),fee.kind,fee.category,fee.value]);
      }
      await connection.commit();
      return response.status(200).json({ sucesso: true, mensagem: 'Canal atualizado.' });
    } catch (error) { await connection.rollback(); return response.status(400).json({ sucesso: false, mensagem: 'Erro ao editar canal.', dados: error.message }); }
    finally { connection.release(); }
  },
  async excluir(request, response) {
    try {
      const { id_empresa, id } = request.body;
      const [result] = await db.query('DELETE FROM canal_venda WHERE id_empresa=? AND (id_frontend=? OR CAST(id_canal AS CHAR)=?) AND padrao=0', [id_empresa,id,id]);
      if (!result.affectedRows) return response.status(409).json({ sucesso: false, mensagem: 'Canal não encontrado ou é o canal padrão.' });
      return response.status(200).json({ sucesso: true, mensagem: 'Canal excluído.' });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir canal.', dados: error.message }); }
  }
};