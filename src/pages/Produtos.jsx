import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function Produtos() {
  const { produtos, adicionarProduto, editarProduto, excluirProduto, calcularCustoTotal, calcularPrecoSugerido } = useApp();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    custo: '',
    tempoProducao: '',
    quantidadeMes: '',
    categoria: 'Produto',
  });
  const [erro, setErro] = useState('');

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function abrirFormNovo() {
    setForm({ nome: '', custo: '', tempoProducao: '', quantidadeMes: '', categoria: 'Produto' });
    setEditando(null);
    setErro('');
    setMostrarForm(true);
  }

  function abrirFormEditar(produto) {
    setForm({
      nome: produto.nome,
      custo: produto.custo,
      tempoProducao: produto.tempoProducao,
      quantidadeMes: produto.quantidadeMes || '',
      categoria: produto.categoria,
    });
    setEditando(produto.id);
    setErro('');
    setMostrarForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!form.nome || form.custo === '') {
      setErro('Nome e custo são obrigatórios.');
      return;
    }
    if (Number(form.custo) < 0) {
      setErro('O custo não pode ser negativo.');
      return;
    }
    if (form.tempoProducao !== '' && Number(form.tempoProducao) < 0) {
      setErro('O tempo de produção não pode ser negativo.');
      return;
    }
    if (form.quantidadeMes !== '' && Number(form.quantidadeMes) < 1) {
      setErro('A quantidade mensal deve ser no mínimo 1.');
      return;
    }

    if (editando) {
      editarProduto(editando, form);
    } else {
      adicionarProduto(form);
    }
    setMostrarForm(false);
    setEditando(null);
  }

  function handleExcluir(produto) {
    const confirmar = window.confirm(`Tem certeza que deseja excluir "${produto.nome}"? Esta ação não pode ser desfeita.`);
    if (confirmar) excluirProduto(produto.id);
  }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📦 Produtos e Serviços</h1>
            <p className="pagina-subtitulo">Gerencie os itens do seu negócio</p>
          </div>
          <button className="btn-primary" style={{width:'auto'}} onClick={abrirFormNovo}>
            + Novo produto
          </button>
        </div>

        {mostrarForm && (
          <div className="card" style={{marginBottom:'1.5rem'}}>
            <h2 className="secao-titulo">{editando ? 'Editar produto' : 'Novo produto'}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              {erro && <div className="alerta-erro" style={{gridColumn:'1/-1'}}>{erro}</div>}

              <div className="campo-grupo">
                <label className="input-label">Nome do produto/serviço</label>
                <input
                  className="input-field"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  placeholder="Ex: Pavê de Amendoim"
                />
              </div>

              <div className="campo-grupo">
                <label className="input-label">Custo do produto (R$)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.custo}
                  onChange={e => setForm({...form, custo: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div className="campo-grupo">
                <label className="input-label">Tempo de produção (horas)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.tempoProducao}
                  onChange={e => setForm({...form, tempoProducao: e.target.value})}
                  placeholder="Ex: 2"
                />
              </div>

              <div className="campo-grupo">
                <label className="input-label">Quantidade produzida por mês</label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantidadeMes}
                  onChange={e => setForm({...form, quantidadeMes: e.target.value})}
                  placeholder="Ex: 30"
                />
                <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                  Usado para ratear os custos fixos mensais por unidade produzida.
                </small>
              </div>

              <div className="campo-grupo">
                <label className="input-label">Categoria</label>
                <select
                  className="input-field"
                  value={form.categoria}
                  onChange={e => setForm({...form, categoria: e.target.value})}
                >
                  <option>Produto</option>
                  <option>Serviço</option>
                </select>
              </div>

              <div className="form-acoes">
                <button type="submit" className="btn-primary" style={{width:'auto'}}>Salvar</button>
                <button type="button" className="btn-secondary" style={{width:'auto'}} onClick={() => setMostrarForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {produtos.length === 0 ? (
          <div className="estado-vazio card">
            <span>📦</span>
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="card">
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Custo direto</th>
                    <th>Qtd/mês</th>
                    <th>Custo total/un.</th>
                    <th>Preço sugerido</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td><span className="badge">{p.categoria}</span></td>
                      <td>{formatarMoeda(p.custo)}</td>
                      <td>{p.quantidadeMes ? `${p.quantidadeMes} un.` : <span style={{color:'var(--alerta)'}}>Não informado</span>}</td>
                      <td>{formatarMoeda(calcularCustoTotal(p))}</td>
                      <td className="preco-sugerido">{formatarMoeda(calcularPrecoSugerido(p))}</td>
                      <td className="acoes">
                        <button className="btn-editar" onClick={() => abrirFormEditar(p)}>✏️ Editar</button>
                        <button className="btn-excluir" onClick={() => handleExcluir(p)}>🗑️ Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Aviso se algum produto nao tem quantidade informada */}
            {produtos.some(p => !p.quantidadeMes) && (
              <p className="texto-aviso" style={{padding:'0.75rem 0 0'}}>
                ⚠️ Produtos sem quantidade mensal informada usam 1 un. como base para o rateio dos custos fixos. Para cálculos precisos, edite e preencha a quantidade.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
