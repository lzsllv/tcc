const db = require('../dataBase/connection');

module.exports = {
  async listar(request, response) {
    try {
      const { id_empresa } = request.query;
      if (!id_empresa) return response.status(400).json({ sucesso: false, mensagem: 'Informe id_empresa.' });
      const [offers] = await db.query(
        `SELECT id_oferta, id_frontend, tipo, nome, categoria, rendimento, tempo_lote_minutos,
                vendas_mensais, margem_desejada_bps, ativo FROM oferta WHERE id_empresa=? ORDER BY nome`, [id_empresa]);
      const dados = [];
      for (const o of offers) {
        const [components] = await db.query(
          `SELECT c.id_frontend, i.id_frontend AS ingredient_frontend, c.id_insumo,
                  c.quantidade, c.unidade, c.perda_bps
           FROM ficha_tecnica_componente c JOIN insumo i ON i.id_insumo=c.id_insumo WHERE c.id_oferta=?`, [o.id_oferta]);
        dados.push({ id: o.id_frontend || String(o.id_oferta), kind: o.tipo, name: o.nome, category: o.categoria,
          batchYield: Number(o.rendimento), batchTimeMinutes: Number(o.tempo_lote_minutos),
          expectedMonthlySales: Number(o.vendas_mensais),
          desiredMarginBps: o.margem_desejada_bps === null ? null : Number(o.margem_desejada_bps), active: !!o.ativo,
          components: components.map(c => ({ id: c.id_frontend, ingredientId: c.ingredient_frontend || String(c.id_insumo),
            quantity: Number(c.quantidade), unit: c.unidade, wasteBps: Number(c.perda_bps) })) });
      }
      return response.status(200).json({ sucesso: true, dados });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao listar ofertas.', dados: error.message }); }
  },
  async cadastrar(request, response) {
    const connection = await db.getConnection();
    try {
      const { id_empresa, id, kind, name, category, batchYield, batchTimeMinutes, expectedMonthlySales, desiredMarginBps, components = [] } = request.body;
      if (!id_empresa || !['product','service'].includes(kind) || !name || !Number.isFinite(batchYield) || batchYield <= 0 || !Number.isFinite(batchTimeMinutes) || batchTimeMinutes < 0 || !Array.isArray(components))
        return response.status(400).json({ sucesso: false, mensagem: 'Dados da ficha técnica inválidos.' });
      await connection.beginTransaction();
      const [result] = await connection.query(
        `INSERT INTO oferta (id_empresa,id_frontend,tipo,nome,categoria,rendimento,tempo_lote_minutos,vendas_mensais,margem_desejada_bps)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [id_empresa,id || null,kind,name.trim(),category || 'Outro',kind === 'service' ? 1 : batchYield,batchTimeMinutes,expectedMonthlySales || 0,desiredMarginBps ?? null]);
      for (const c of components) {
        const [ingredient] = await connection.query('SELECT id_insumo FROM insumo WHERE id_empresa=? AND id_frontend=?', [id_empresa,c.ingredientId]);
        if (!ingredient.length) throw new Error(`Insumo não encontrado: ${c.ingredientId}`);
        await connection.query(
          `INSERT INTO ficha_tecnica_componente (id_frontend,id_oferta,id_insumo,quantidade,unidade,perda_bps) VALUES (?,?,?,?,?,?)`,
          [c.id || null,result.insertId,ingredient[0].id_insumo,c.quantity,c.unit,c.wasteBps || 0]);
      }
      await connection.commit();
      return response.status(201).json({ sucesso: true, dados: { id: id || String(result.insertId) } });
    } catch (error) { await connection.rollback(); return response.status(400).json({ sucesso: false, mensagem: 'Erro ao cadastrar ficha técnica.', dados: error.message }); }
    finally { connection.release(); }
  },
  async editar(request, response) {
    const connection = await db.getConnection();
    try {
      const { id_empresa, id, kind, name, category, batchYield, batchTimeMinutes, expectedMonthlySales, desiredMarginBps, components = [], active } = request.body;
      if (!id_empresa || !id || !['product','service'].includes(kind) || !name || !Array.isArray(components))
        return response.status(400).json({ sucesso: false, mensagem: 'Dados da ficha técnica inválidos.' });
      const [found] = await connection.query('SELECT id_oferta FROM oferta WHERE id_empresa=? AND (id_frontend=? OR CAST(id_oferta AS CHAR)=?)', [id_empresa,id,id]);
      if (!found.length) return response.status(404).json({ sucesso: false, mensagem: 'Oferta não encontrada.' });
      await connection.beginTransaction();
      const offerId = found[0].id_oferta;
      await connection.query(
        `UPDATE oferta SET tipo=?,nome=?,categoria=?,rendimento=?,tempo_lote_minutos=?,vendas_mensais=?,margem_desejada_bps=?,ativo=? WHERE id_oferta=?`,
        [kind,name.trim(),category || 'Outro',kind === 'service' ? 1 : batchYield,batchTimeMinutes,expectedMonthlySales || 0,desiredMarginBps ?? null,active === false ? 0 : 1,offerId]);
      await connection.query('DELETE FROM ficha_tecnica_componente WHERE id_oferta=?', [offerId]);
      for (const c of components) {
        const [ingredient] = await connection.query('SELECT id_insumo FROM insumo WHERE id_empresa=? AND id_frontend=?', [id_empresa,c.ingredientId]);
        if (!ingredient.length) throw new Error(`Insumo não encontrado: ${c.ingredientId}`);
        await connection.query(
          `INSERT INTO ficha_tecnica_componente (id_frontend,id_oferta,id_insumo,quantidade,unidade,perda_bps) VALUES (?,?,?,?,?,?)`,
          [c.id || null,offerId,ingredient[0].id_insumo,c.quantity,c.unit,c.wasteBps || 0]);
      }
      await connection.commit();
      return response.status(200).json({ sucesso: true, mensagem: 'Ficha técnica atualizada.' });
    } catch (error) { await connection.rollback(); return response.status(400).json({ sucesso: false, mensagem: 'Erro ao editar ficha técnica.', dados: error.message }); }
    finally { connection.release(); }
  },
  async excluir(request, response) {
    try {
      const { id_empresa, id } = request.body;
      const [result] = await db.query('DELETE FROM oferta WHERE id_empresa=? AND (id_frontend=? OR CAST(id_oferta AS CHAR)=?)', [id_empresa,id,id]);
      return response.status(200).json({ sucesso: true, dados: result });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir oferta.', dados: error.message }); }
  }
};
