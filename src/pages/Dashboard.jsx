import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const {
    usuarioLogado, produtos,
    totalCustosFixos, calcularCustoTotal, calcularPrecoSugerido,
    configuracoes,
  } = useApp();

  const totalCustos = totalCustosFixos();

  const lucroMensalTotal = produtos.reduce((acc, p) => {
    const lucroUn = calcularPrecoSugerido(p) - calcularCustoTotal(p);
    return acc + lucroUn * Number(p.quantidadeMes || 0);
  }, 0);

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const nome = usuarioLogado?.nome?.split(' ')[0];

  return (
    <div>
      <Navbar />
      <main className="dashboard-container">

        <div className="dashboard-welcome">
          <h1>Olá, {nome}! 👋</h1>
          <p>Aqui está o resumo do seu negócio hoje.</p>
        </div>

        <div className="dashboard-kpis">
          <div className="kpi-card">
            <span className="kpi-icone">📦</span>
            <p className="kpi-label">Produtos cadastrados</p>
            <p className="kpi-valor">{produtos.length}</p>
          </div>
          <div className="kpi-card">
            <span className="kpi-icone">💸</span>
            <p className="kpi-label">Total de custos fixos</p>
            <p className="kpi-valor verde">{fmt(totalCustos)}</p>
          </div>
          <div className="kpi-card kpi-card-destaque">
            <span className="kpi-icone">💰</span>
            <p className="kpi-label">Lucro mensal projetado</p>
            <p className="kpi-valor verde">
              {produtos.length > 0 ? fmt(lucroMensalTotal) : '—'}
            </p>
          </div>
          <div className="kpi-card">
            <span className="kpi-icone">📈</span>
            <p className="kpi-label">Margem de lucro</p>
            <p className="kpi-valor">{configuracoes.margemLucro}%</p>
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
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => (
                    <tr key={p.id}>
                      <td className="tabela-nome-produto">{p.nome}</td>
                      <td><span className="badge">{p.categoria}</span></td>
                      <td>{fmt(calcularCustoTotal(p))}</td>
                      <td className="preco-sugerido">{fmt(calcularPrecoSugerido(p))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
