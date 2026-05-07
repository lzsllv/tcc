import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const {
    usuarioLogado,
    produtos,
    totalCustosFixos,
    calcularCustoTotal,
    calcularPrecoSugerido,
    configuracoes,
  } = useApp();

  // Calcula totais para os cards de resumo
  const totalProdutos = produtos.length;
  const totalCustos = totalCustosFixos();
  const precoMedio = produtos.length > 0
    ? produtos.reduce((acc, p) => acc + calcularPrecoSugerido(p), 0) / produtos.length
    : 0;

  // Formata valor em reais
  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div>
      <Navbar />
      <main className="dashboard-container">
        {/* Saudação */}
        <div className="dashboard-cabecalho">
          <h1 className="dashboard-titulo">
            Olá, {usuarioLogado?.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="dashboard-subtitulo">
            Aqui está o resumo do seu negócio hoje.
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="dashboard-cards">
          <div className="resumo-card">
            <span className="resumo-icone">📦</span>
            <div>
              <p className="resumo-label">Produtos cadastrados</p>
              <p className="resumo-valor">{totalProdutos}</p>
            </div>
          </div>

          <div className="resumo-card">
            <span className="resumo-icone">💸</span>
            <div>
              <p className="resumo-label">Total de custos fixos</p>
              <p className="resumo-valor">{formatarMoeda(totalCustos)}</p>
            </div>
          </div>

          <div className="resumo-card">
            <span className="resumo-icone">🏷️</span>
            <div>
              <p className="resumo-label">Preço médio sugerido</p>
              <p className="resumo-valor">{formatarMoeda(precoMedio)}</p>
            </div>
          </div>

          <div className="resumo-card">
            <span className="resumo-icone">📈</span>
            <div>
              <p className="resumo-label">Margem de lucro definida</p>
              <p className="resumo-valor">{configuracoes.margemLucro}%</p>
            </div>
          </div>
        </div>

        {/* Lista rápida de produtos */}
        <div className="dashboard-secao">
          <h2 className="secao-titulo">Seus produtos</h2>
          {produtos.length === 0 ? (
            <div className="estado-vazio">
              <span>📦</span>
              <p>Nenhum produto cadastrado ainda.</p>
              <a href="/produtos" className="btn-primary" style={{display:'inline-block', width:'auto', padding:'0.6rem 1.5rem', marginTop:'1rem'}}>
                Cadastrar produto
              </a>
            </div>
          ) : (
            <div className="dashboard-tabela-wrapper">
              <table className="dashboard-tabela">
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
                      <td>{p.nome}</td>
                      <td><span className="badge">{p.categoria}</span></td>
                      <td>{formatarMoeda(calcularCustoTotal(p))}</td>
                      <td className="preco-sugerido">{formatarMoeda(calcularPrecoSugerido(p))}</td>
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
