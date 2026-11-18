const db = require('../dataBase/connection');

module.exports = {
  async listar(request, response) {
    try {
      const { id_empresa } = request.query;
      if (!id_empresa) return response.status(400).json({ sucesso: false, mensagem: 'Informe id_empresa.' });
      const [rows] = await db.query(
        `SELECT id_insumo, id_frontend, nome, categoria, preco_compra_centavos,
                quantidade_compra, unidade_compra, ativo
         FROM insumo WHERE id_empresa = ? ORDER BY nome`, [id_empresa]);
      const dados = rows.map(r => ({ id: r.id_frontend || String(r.id_insumo), name: r.nome,
        category: r.categoria, purchasePriceCents: Number(r.preco_compra_centavos),
        purchaseQuantity: Number(r.quantidade_compra), purchaseUnit: r.unidade_compra, active: !!r.ativo }));
      return response.status(200).json({ sucesso: true, dados });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao listar insumos.', dados: error.message }); }
  },
  async cadastrar(request, response) {
    try {
      const { id_empresa, id, name, category, purchasePriceCents, purchaseQuantity, purchaseUnit } = request.body;
      if (!id_empresa || !name || !category || !purchaseUnit || !Number.isInteger(purchasePriceCents) || purchasePriceCents < 0 || !Number.isFinite(purchaseQuantity) || purchaseQuantity <= 0)
        return response.status(400).json({ sucesso: false, mensagem: 'Dados do insumo inválidos.' });
      const [result] = await db.query(
        `INSERT INTO insumo (id_empresa, id_frontend, nome, categoria, preco_compra_centavos, quantidade_compra, unidade_compra)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_empresa, id || null, name.trim(), category, purchasePriceCents, purchaseQuantity, purchaseUnit]);
      return response.status(201).json({ sucesso: true, dados: { id: id || String(result.insertId) } });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar insumo.', dados: error.message }); }
  },
  async editar(request, response) {
    try {
      const { id_empresa, id, name, category, purchasePriceCents, purchaseQuantity, purchaseUnit, active } = request.body;
      if (!id_empresa || !id || !name || !category || !purchaseUnit || !Number.isInteger(purchasePriceCents) || purchasePriceCents < 0 || !Number.isFinite(purchaseQuantity) || purchaseQuantity <= 0)
        return response.status(400).json({ sucesso: false, mensagem: 'Dados do insumo inválidos.' });
      const [result] = await db.query(
        `UPDATE insumo SET nome=?, categoria=?, preco_compra_centavos=?, quantidade_compra=?, unidade_compra=?, ativo=?
         WHERE id_empresa=? AND (id_frontend=? OR CAST(id_insumo AS CHAR)=?)`,
        [name.trim(), category, purchasePriceCents, purchaseQuantity, purchaseUnit, active === false ? 0 : 1, id_empresa, id, id]);
      return response.status(200).json({ sucesso: true, dados: result });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao editar insumo.', dados: error.message }); }
  },
  async excluir(request, response) {
    try {
      const { id_empresa, id } = request.body;
      const [rows] = await db.query(
        `SELECT i.id_insumo FROM insumo i
         LEFT JOIN ficha_tecnica_componente c ON c.id_insumo=i.id_insumo
         WHERE i.id_empresa=? AND (i.id_frontend=? OR CAST(i.id_insumo AS CHAR)=?) AND c.id_componente IS NULL`, [id_empresa, id, id]);
      if (!rows.length) return response.status(409).json({ sucesso: false, mensagem: 'Insumo não encontrado ou utilizado em uma ficha técnica. Arquive-o para preservar o histórico.' });
      await db.query('DELETE FROM insumo WHERE id_insumo=?', [rows[0].id_insumo]);
      return response.status(200).json({ sucesso: true, mensagem: 'Insumo excluído.' });
    } catch (error) { return response.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir insumo.', dados: error.message }); }
  }
};
