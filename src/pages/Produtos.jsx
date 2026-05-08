import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

const CATEGORIAS = ['Alimento','Bebida','Artesanato','Moda','Higiene','Presente','Serviço','Outro'];

export default function Produtos() {
  const {
    produtos,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    calcularCustoTotal,
    calcularPrecoSugerido,
    totalCustosFixos,
    totalUnidadesMes,
    custoFixoPorUnidade,
  } = useApp();

  const [form, setForm] = useState({
    nome:'', categoria:'Outro', custo:'', tempoProducao:'', quantidadeMes:'',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!form.nome.trim()) { setErro('Informe o nome do produto.'); return; }
    if (Number(form.custo) < 0) { setErro('O custo direto não pode ser negativo.'); return; }
    if (Number(form.tempoProducao) < 0) { setErro('O tempo de produção não pode ser negativo.'); return; }
    if (Number(form.quantidadeMes) < 0) { setErro('A quantidade mensal não pode ser negativa.'); return; }

    if (editandoId !== null) {
      editarProduto(editandoId, form);
      setSucesso('Produto atualizado com sucesso!');
      setEditandoId(null);
    } else {
      adicionarProduto(form);
      setSucesso('Produto cadastrado com sucesso!');
    }
    setForm({ nome:'', categoria:'Outro', custo:'', tempoProducao:'', quantidadeMes:'' });
    setTimeout(() => setSucesso(''), 3000);
  }

  function handleEditar(p) {
    setForm({ nome: p.nome, categoria: p.categoria, custo: p.custo,
              tempoProducao: p.tempoProducao, quantidadeMes: p.quantidadeMes });
    setEditandoId(p.id);
    setErro('');
    setSucesso('');
  }

  function handleCancelar() {
    setForm({ nome:'', categoria:'Outro', custo:'', tempoProducao:'', quantidadeMes:'' });
    setEditandoId(null);
    setErro('');
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCF    = totalCustosFixos();
  const totalUn    = totalUnidadesMes();
  const fixo       = custoFixoPorUnidade();

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📦 Produtos</h1>
            <p className="pagina-subtitulo">Gerencie os produtos do seu negócio</p>
          </div>
        </div>

        <div className="pagina-grid">
          {/* Formulário */}
          <div className="card">
            <h2 className="secao-titulo">{editandoId !== null ? '✏️ Editar produto' : '➕ Novo produto'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              {erro    && <div className="alerta-erro">{erro}</div>}
              {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

              <div className="campo-grupo">
                <label className="input-label">Nome do produto</label>
                <input className="input-field" type="text" value={form.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                  placeholder="Ex: Vela aromática" required />
              </div>

              <div className="campo-grupo">
                <label className="input-label">Categoria</label>
                <select className="input-field" value={form.categoria}
                  onChange={e => handleChange('categoria', e.target.value)}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="campo-grupo">
                <label className="input-label">💰 Custo direto (R$)</label>
                <input className="input-field" type="number" min="0" step="0.01"
                  value={form.custo}
                  onChange={e => handleChange('custo', e.target.value)}
                  placeholder="Soma de materiais, embalagem..." required />
                <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                  Soma de todos os materiais e insumos para produzir 1 unidade.
                </small>
              </div>

              <div className="campo-grupo">
                <label className="input-label">⏱️ Tempo de produção (horas)</label>
                <input className="input-field" type="number" min="0" step="0.25"
                  value={form.tempoProducao}
                  onChange={e => handleChange('tempoProducao', e.target.value)}
                  placeholder="Ex: 1.5" />
                <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                  Horas gastas para produzir 1 unidade. Multiplicado pelo seu custo/hora.
                </small>
              </div>

              <div className="campo-grupo">
                <label className="input-label">📦 Quantidade produzida por mês</label>
                <input className="input-field" type="number" min="1"
                  value={form.quantidadeMes}
                  onChange={e => handleChange('quantidadeMes', e.target.value)}
                  placeholder="Ex: 50" />
                <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                  Usado para rateio dos custos fixos entre todos os produtos.
                </small>
              </div>

              <div style={{display:'flex', gap:'0.75rem'}}>
                <button type="submit" className="btn-primary" style={{flex:1}}>
                  {editandoId !== null ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>
                {editandoId !== null && (
                  <button type="button" onClick={handleCancelar}
                    className="btn-secondary" style={{flex:1}}>Cancelar</button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de produtos */}
          <div>
            {/* Nota sobre rateio */}
            {produtos.length > 0 && totalCF > 0 && (
              <div className="alerta-info" style={{marginBottom:'1rem', fontSize:'0.85rem'}}>
                ℹ️ <strong>Custo fixo rateado:</strong>{' '}
                {formatarMoeda(totalCF)} ÷ {totalUn} un totais ={' '}
                <strong>{formatarMoeda(fixo)}/unidade</strong> (igual para todos os produtos).
                O divisor é a soma das quantidades mensais de <em>todos</em> os seus produtos.
              </div>
            )}

            {produtos.length === 0 ? (
              <div className="card">
                <div className="estado-vazio">
                  <span>📦</span>
                  <p>Nenhum produto cadastrado ainda.<br />Use o formulário ao lado para começar.</p>
                </div>
              </div>
            ) : (
              produtos.map(p => {
                const custo = calcularCustoTotal(p);
                const preco = calcularPrecoSugerido(p);
                return (
                  <div key={p.id} className="card" style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                      <div>
                        <h3 style={{fontWeight:700, marginBottom:'0.25rem'}}>{p.nome}</h3>
                        <span className="badge">{p.categoria}</span>
                      </div>
                      <div style={{display:'flex', gap:'0.5rem'}}>
                        <button className="btn-secondary" style={{padding:'0.35rem 0.75rem', fontSize:'0.85rem'}}
                          onClick={() => handleEditar(p)}>✏️ Editar</button>
                        <button
                          style={{padding:'0.35rem 0.75rem', fontSize:'0.85rem', background:'var(--erro)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer'}}
                          onClick={() => {
                            if (window.confirm(`Excluir "${p.nome}"?`)) excluirProduto(p.id);
                          }}>🗑️</button>
                      </div>
                    </div>

                    <div style={{marginTop:'0.75rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem 1.5rem'}}>
                      <div className="resumo-linha" style={{margin:0}}>
                        <span>Custo direto:</span>
                        <strong>{formatarMoeda(p.custo || 0)}</strong>
                      </div>
                      <div className="resumo-linha" style={{margin:0}}>
                        <span>Fixo/unidade:</span>
                        <strong>{formatarMoeda(fixo)}</strong>
                      </div>
                      <div className="resumo-linha" style={{margin:0}}>
                        <span>Tempo produção:</span>
                        <strong>{p.tempoProducao || 0}h</strong>
                      </div>
                      <div className="resumo-linha" style={{margin:0}}>
                        <span>Qtd/mês:</span>
                        <strong>{p.quantidadeMes || <span style={{color:'var(--alerta)'}}>Não informado</span>}</strong>
                      </div>
                      <div className="resumo-linha" style={{margin:0, gridColumn:'1/-1', borderTop:'1px solid var(--borda)', paddingTop:'0.5rem', marginTop:'0.25rem'}}>
                        <span><strong>Custo total unitário:</strong></span>
                        <strong style={{color:'var(--texto-principal)'}}>{formatarMoeda(custo)}</strong>
                      </div>
                      <div className="resumo-linha" style={{margin:0, gridColumn:'1/-1'}}>
                        <span><strong>💚 Preço sugerido:</strong></span>
                        <strong className="valor-verde" style={{fontSize:'1.1rem'}}>{formatarMoeda(preco)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
