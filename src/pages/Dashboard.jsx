import { Link } from 'react-router-dom';
import { ChartBar, ChartLineUp, Coins, Package, Tag } from '@phosphor-icons/react';
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
  const precoMedio = produtos.length > 0
    ? produtos.reduce((acc, p) => acc + calcularPrecoSugerido(p), 0) / produtos.length
    : 0;

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const nome = usuarioLogado?.nome?.split(' ')[0];
  const kpis = [
    { Icon: Package, label: 'Produtos cadastrados', valor: produtos.length },
    { Icon: Coins, label: 'Total de custos fixos', valor: fmt(totalCustos), destaque: true },
    { Icon: Tag, label: 'Preço médio sugerido', valor: fmt(precoMedio), destaque: true },
    { Icon: ChartLineUp, label: 'Margem de lucro', valor: `${configuracoes.margemLucro}%` },
  ];
  const acoes = [
    { to: '/produtos', Icon: Package, titulo: 'Produtos', desc: 'Cadastrar ou editar produtos' },
    { to: '/custos-fixos', Icon: Coins, titulo: 'Custos fixos', desc: 'Gerenciar despesas mensais' },
    { to: '/simulacao', Icon: ChartLineUp, titulo: 'Simulação', desc: 'Comparar cenários de preço' },
    { to: '/relatorio', Icon: ChartBar, titulo: 'Relatório', desc: 'Ver a projeção do mês' },
  ];

  return (
    <div>
      <Navbar />
      <main className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <p className="dashboard-contexto">Visão geral</p>
            <h1>Olá, {nome}</h1>
            <p>Acompanhe os principais números do seu negócio.</p>
          </div>
          <Link to="/produtos" className="dashboard-novo-produto"><Package size={18} /> Novo produto</Link>
        </div>

        <section className="dashboard-kpis" aria-label="Indicadores do negócio">
          {kpis.map(({ Icon, label, valor, destaque }) => (
            <article className="kpi-card" key={label}>
              <span className="kpi-icone"><Icon size={21} weight="duotone" /></span>
              <p className="kpi-label">{label}</p>
              <p className={`kpi-valor ${destaque ? 'verde' : ''}`}>{valor}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-layout">
          <div className="card dashboard-acoes-card">
            <h2 className="secao-titulo">Acessos rápidos</h2>
            <div className="acoes-rapidas">
              {acoes.map(({ to, Icon, titulo, desc }) => (
                <Link to={to} className="acao-card" key={to}>
                  <span className="acao-card-icone"><Icon size={22} /></span>
                  <span><strong className="acao-card-titulo">{titulo}</strong><small className="acao-card-desc">{desc}</small></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card dashboard-produtos">
            <h2 className="secao-titulo">Seus produtos</h2>
            {produtos.length === 0 ? (
              <div className="estado-vazio">
                <span className="estado-vazio-icone"><Package size={32} /></span>
                <p>Nenhum produto cadastrado ainda.</p>
                <Link to="/produtos" className="btn-primary btn-estado-vazio">Cadastrar produto</Link>
              </div>
            ) : (
              <div className="tabela-wrapper">
                <table className="tabela">
                  <thead><tr><th>Produto</th><th>Categoria</th><th>Custo total</th><th>Preço sugerido</th></tr></thead>
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
        </section>
      </main>
    </div>
  );
}
