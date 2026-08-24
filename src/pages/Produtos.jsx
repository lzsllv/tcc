import { useState } from 'react';
import { Package, PencilSimple, Trash } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/Produtos.css';

const CATEGORIAS = ['Alimento','Bebida','Artesanato','Moda','Higiene','Presente','Serviço','Outro'];

export default function Produtos() {
  const {
    produtos, adicionarProduto, editarProduto, excluirProduto,
    calcularCustoTotal, calcularPrecoSugerido,
    totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade,
  } = useApp();

  const [form, setForm] = useState({
    nome: '', categoria: 'Outro', custo: '', tempoProducao: '', quantidadeMes: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [erro,    setErro]    = useState('');
  const [sucesso, setSucesso] = useState('');

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!form.nome.trim())               { setErro('Informe o nome do produto.'); return; }
    if (form.custo === '')               { setErro('Informe o custo direto do produto.'); return; }
    if (Number(form.custo) < 0)          { setErro('O custo direto não pode ser negativo.'); return; }
    if (Number(form.tempoProducao) < 0)  { setErro('O tempo de produção não pode ser negativo.'); return; }
    if (Number(form.quantidadeMes) < 0)  { setErro('A quantidade mensal não pode ser negativa.'); return; }

    if (editandoId !== null) {
      editarProduto(editandoId, form);
      setSucesso('Produto atualizado com sucesso!');
      setEditandoId(null);
    } else {
      adicionarProduto(form);
      setSucesso('Produto cadastrado com sucesso!');
    }
    setForm({ nome: '', categoria: 'Outro', custo: '', tempoProducao: '', quantidadeMes: '' });
    setTimeout(() => setSucesso(''), 3000);
  }

  function handleEditar(p) {
    setForm({ nome: p.nome, categoria: p.categoria, custo: p.custo,
              tempoProducao: p.tempoProducao, quantidadeMes: p.quantidadeMes });
    setEditandoId(p.id);
    setErro(''); setSucesso('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelar() {
    setForm({ nome: '', categoria: 'Outro', custo: '', tempoProducao: '', quantidadeMes: '' });
    setEditandoId(null);
    setErro('');
  }

  function confirmarExclusao(p) {
    if (window.confirm(`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`)) {
      excluirProduto(p.id);
    }
  }

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCF = totalCustosFixos();
  const totalUn = totalUnidadesMes();
  const fixo    = custoFixoPorUnidade();

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">Produtos</h1>
            <p className="pagina-subtitulo">Gerencie os produtos do seu negócio</p>
          </div>
        </div>

        <div className="pagina-grid">
          {/* Formulário */}
          <div className="card">
            <h2 className="secao-titulo">{editandoId !== null ? 'Editar produto' : 'Novo produto'}</h2>
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
                <label className="input-label">Custo direto (R$)</label>
                <input className="input-field" type="number" min="0" step="0.01"
                  value={form.custo}
                  onChange={e => handleChange('custo', e.target.value)}
                  placeholder="Soma de materiais, embalagem..." required />
                <small className="input-hint">Soma de todos os materiais e insumos para produzir 1 unidade.</small>
              </div>

              <div className="campo-grupo">
                <label className="input-label">Tempo de produção (horas)</label>
                <input className="input-field" type="number" min="0" step="0.25"
                  value={form.tempoProducao}
                  onChange={e => handleChange('tempoProducao', e.target.value)}
                  placeholder="Ex: 1.5" />
                <small className="input-hint">Horas gastas para produzir 1 unidade. Multiplicado pelo seu custo/hora.</small>
              </div>

              <div className="campo-grupo">
                <label className="input-label">Quantidade produzida por mês</label>
                <input className="input-field" type="number" min="1"
                  value={form.quantidadeMes}
                  onChange={e => handleChange('quantidadeMes', e.target.value)}
                  placeholder="Ex: 50" />
                <small className="input-hint">Usado para rateio dos custos fixos entre todos os produtos.</small>
              </div>

              <div className="produtos-form-acoes">
                <button type="submit" className="btn-primary produtos-btn-flex">
                  {editandoId !== null ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>
                {editandoId !== null && (
                  <button type="button" onClick={handleCancelar}
                    className="btn-secondary produtos-btn-flex">Cancelar</button>
                )}
              </div>
            </form>
          </div>

          {/* Lista */}
          <div>
            {produtos.length > 0 && totalCF > 0 && (
              <div className="alerta-info produtos-rateio-info">
                <strong>Custo fixo rateado:</strong>{' '}
                {fmt(totalCF)} ÷ {totalUn} un = <strong>{fmt(fixo)}/unidade</strong>
              </div>
            )}

            {produtos.length === 0 ? (
              <div className="card">
                <div className="estado-vazio">
                  <span><Package size={30} /></span>
                  <p>Nenhum produto cadastrado ainda.<br />Use o formulário ao lado para começar.</p>
                </div>
              </div>
            ) : (
              produtos.map(p => {
                const custo = calcularCustoTotal(p);
                const preco = calcularPrecoSugerido(p);
                const semQtd = !p.quantidadeMes || Number(p.quantidadeMes) === 0;
                return (
                  <div key={p.id} className="card produto-card">
                    <div className="produto-card-header">
                      <div>
                        <h3 className="produto-nome">{p.nome}</h3>
                        <span className="badge">{p.categoria}</span>
                      </div>
                      <div className="acoes">
                        <button className="btn-editar" onClick={() => handleEditar(p)}><PencilSimple size={15} /> Editar</button>
                        <button className="btn-excluir" onClick={() => confirmarExclusao(p)} aria-label={`Excluir ${p.nome}`}><Trash size={15} /></button>
                      </div>
                    </div>

                    <div className="produto-detalhes">
                      <div className="resumo-linha produto-detalhe-linha">
                        <span>Custo direto:</span>
                        <strong>{fmt(p.custo || 0)}</strong>
                      </div>
                      <div className="resumo-linha produto-detalhe-linha">
                        <span>Fixo/unidade:</span>
                        <strong>{fmt(fixo)}</strong>
                      </div>
                      <div className="resumo-linha produto-detalhe-linha">
                        <span>Tempo produção:</span>
                        <strong>{p.tempoProducao || 0}h</strong>
                      </div>
                      <div className="resumo-linha produto-detalhe-linha">
                        <span>Qtd/mês:</span>
                        {semQtd
                          ? <span className="texto-aviso">Não informado</span>
                          : <strong>{p.quantidadeMes} un.</strong>
                        }
                      </div>
                      <div className="resumo-linha produto-total produto-detalhe-linha">
                        <span>Custo total unitário:</span>
                        <strong>{fmt(custo)}</strong>
                      </div>
                      <div className="resumo-linha produto-preco produto-detalhe-linha">
                        <span>Preço sugerido:</span>
                        <strong className="valor-verde produto-preco-valor">{fmt(preco)}</strong>
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
