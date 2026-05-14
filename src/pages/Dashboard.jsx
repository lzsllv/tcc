import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const {
    usuarioLogado, produtos,
    totalCustosFixos, calcularCustoTotal, calcularPrecoSugerido,
    configuracoes, carregarDemo, limparDados,
  } = useApp();

  const [confirmarLimpar, setConfirmarLimpar] = useState(false);
  const [avisoDemo, setAvisoDemo] = useState('');

  const totalCustos = totalCustosFixos();
  const precoMedio  = produtos.length > 0
    ? produtos.reduce((acc, p) => acc + calcularPrecoSugerido(p), 0) / produtos.length
    : 0;
  const lucroTotalMes = produtos.reduce((acc, p) => {
    const lucroUn = calcularPrecoSugerido(p) - calcularCustoTotal(p);
    return acc + lucroUn * Number(p.quantidadeMes || 0);
  }, 0);

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleCarregarDemo() {
    carregarDemo();
    setAvisoDemo('✅ Dados de demonstração carregados!');
    setTimeout(() => setAvisoDemo(''), 3000);
  }

  function handleLimpar() {
    if (!confirmarLimpar) { setConfirmarLimpar(true); return; }
    limparDados();
    setConfirmarLimpar(false);
    setAvisoDemo('🗑️ Todos os dados foram apagados.');
    setTimeout(() => setAvisoDemo(''), 3000);
  }

  const nome = usuarioLogado?.nome?.split(' ')[0];

  return (
    <div>
      <Navbar />
      <main className="dashboard-container">

        <div className="dashboard-welcome">
          <div>
            <h1>Olá, {nome}! 👋</h1>
            <p>Aqui está o resumo do seu negócio hoje.</p>
          </div>
          <div className="dashboard-demo-acoes">
            {avisoDemo && <span className="demo-aviso">{avisoDemo}</span>}
            <button className="btn-demo" onClick={handleCarregarDemo} title="Preencher com dados de exemplo">
              🧪 Carregar demo
            </button>
            {produtos.length > 0 && (
              <button
                className={`btn-limpar ${confirmarLimpar ? 'btn-limpar-confirm' : ''}`}
                onClick={handleLimpar}
                title={confirmarLimpar ? 'Clique novamente para confirmar' : 'Apagar todos os dados'}
              >
                {confirmarLimpar ? '⚠️ Confirmar limpeza?' : '🗑️ Limpar dados'}
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-kpis">
          <div className="kpi-card">
            <span className="kpi-icone">📦</span>
            <p className="kpi-label">Produtos cadastrados</p>
            <p className="kpi-valor">{produtos.length}</p>
            {produtos.length === 0 && <p className="kpi-hint"><Link to="/produtos">Cadastrar produto →</Link></p>}
          </div>
          <div className="kpi-card">
            <span className="kpi-icone">💸</span>
            <p className="kpi-label">Total de custos fixos</p>
            <p className="kpi-valor verde">{fmt(totalCustos)}</p>
            {totalCustos === 0 && <p className="kpi-hint"><Link to="/custos-fixos">Preencher custos →</Link></p>}
          </div>
          <div className="kpi-card">
            <span className="kpi-icone">🏷️</span>
            <p className="kpi-label">Preço médio sugerido</p>
            <p className="kpi-valor verde">{fmt(precoMedio)}</p>
          </div>
          <div className="kpi-card">
            <span className="kpi-icone">📈</span>
            <p className="kpi-label">Margem configurada</p>
            <p className="kpi-valor">{configuracoes.margemLucro}%</p>
          </div>
          <div className="kpi-card kpi-destaque">
            <span className="kpi-icone">💰</span>
            <p className="kpi-label">Lucro mensal projetado</p>
            <p className={`kpi-valor ${lucroTotalMes > 0 ? 'verde' : ''}`}>{fmt(lucroTotalMes)}</p>
            {produtos.some(p => !p.quantidadeMes || Number(p.quantidadeMes) === 0) && (
              <p className="kpi-hint kpi-hint-aviso">⚠️ Alguns produtos sem qtd/mês</p>
            )}
          </div>
        </div>

        <div className="card dashboard-acoes-card">
          <h2 className="secao-titulo">⚡ Ações rápidas</h2>
          <div className="acoes-rapidas">
            <Link to="/produtos" className="acao-card">
              <span className="acao-card-icone">📦</span>
              <span className="acao-card-titulo">Produtos</span>
              <span className="acao-card-desc">Cadastrar ou editar produtos</span>
            </Link>
            <Link to="/custos-fixos" className="acao-card">
              <span className="acao-card-icone">💰</span>
              <span className="acao-card-titulo">Custos fixos</span>
              <span className="acao-card-desc">Gerenciar despesas mensais</span>
            </Link>
            <Link to="/simulacao" className="acao-card">
              <span className="acao-card-icone">🧮</span>
              <span className="acao-card-titulo">Simulação</span>
              <span className="acao-card-desc">Simular cenários de preço</span>
            </Link>
            <Link to="/relatorio" className="acao-card">
              <span className="acao-card-icone">📊</span>
              <span className="acao-card-titulo">Relatório</span>
              <span className="acao-card-desc">Ver faturamento do mês</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="secao-titulo">Seus produtos</h2>
          {produtos.length === 0 ? (
            <div className="estado-vazio">
              <span>📦</span>
              <p>Nenhum produto cadastrado ainda.</p>
              <Link to="/produtos" className="btn-primary btn-estado-vazio">Cadastrar produto</Link>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Custo total</th>
                    <th>Preço sugerido</th>
                    <th>Lucro/mês</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => {
                    const custo = calcularCustoTotal(p);
                    const preco = calcularPrecoSugerido(p);
                    const lucroMes = (preco - custo) * Number(p.quantidadeMes || 0);
                    return (
                      <tr key={p.id}>
                        <td className="tabela-nome-produto">{p.nome}</td>
                        <td><span className="badge">{p.categoria}</span></td>
                        <td>{fmt(custo)}</td>
                        <td className="preco-sugerido">{fmt(preco)}</td>
                        <td className="valor-verde">{fmt(lucroMes)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
