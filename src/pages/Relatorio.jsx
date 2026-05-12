import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/Relatorio.css';

const NOMES_CUSTOS = {
  aluguel: 'Aluguel', energia: 'Energia', internet: 'Internet',
  salarios: 'Salários', outros: 'Outros',
};

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

export default function Relatorio() {
  const {
    produtos, custosFixos, configuracoes,
    totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade, custoFixoPorProduto,
    calcularCustoTotal, calcularPrecoSugerido,
  } = useApp();

  const hoje = new Date();
  const [mesSel, setMesSel]   = useState(hoje.getMonth());       // 0-11
  const [anoSel, setAnoSel]   = useState(hoje.getFullYear());

  const anos = Array.from({ length: 5 }, (_, i) => hoje.getFullYear() - 2 + i);

  function formatarMoeda(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCustos    = totalCustosFixos();
  const totalUnidades  = totalUnidadesMes();
  const fixoPorUnidade = custoFixoPorUnidade();
  const custosZerados  = totalCustos === 0;

  // Totais do relatório
  const totalReceita = produtos.reduce((a, p) => a + calcularPrecoSugerido(p) * Number(p.quantidadeMes || 0), 0);
  const totalLucro   = produtos.reduce((a, p) => {
    const lucroUn = calcularPrecoSugerido(p) - calcularCustoTotal(p);
    return a + lucroUn * Number(p.quantidadeMes || 0);
  }, 0);

  function handleImprimir() { window.print(); }

  const nomeNegocio = configuracoes.nomeNegocio || '';
  const logoNegocio = configuracoes.logoNegocio || '';

  return (
    <div>
      <Navbar />
      <main className="pagina-container">

        {/* Cabeçalho da página */}
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📊 Relatório</h1>
            <p className="pagina-subtitulo">Visão completa dos seus custos, preços e margens</p>
          </div>
          <button className="btn-primary" style={{width:'auto'}} onClick={handleImprimir}>
            🖨️ Imprimir relatório
          </button>
        </div>

        {/* ── Filtro de período ── */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">📅 Período do relatório</h2>
          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-end'}}>
            <div className="campo-grupo" style={{marginBottom:0, minWidth:'160px'}}>
              <label className="input-label">Mês</label>
              <select className="input-field" value={mesSel} onChange={e => setMesSel(Number(e.target.value))}>
                {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div className="campo-grupo" style={{marginBottom:0, minWidth:'100px'}}>
              <label className="input-label">Ano</label>
              <select className="input-field" value={anoSel} onChange={e => setAnoSel(Number(e.target.value))}>
                {anos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{fontSize:'0.85rem', color:'var(--texto-secundario)', paddingBottom:'0.35rem'}}>
              Exibindo projeção para: <strong>{MESES[mesSel]} {anoSel}</strong>
            </div>
          </div>
        </div>

        {/* ── Cabeçalho do relatório (aparece ao imprimir) ── */}
        <div className="relatorio-cabecalho-impresso card" style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex', alignItems:'center', gap:'1.25rem'}}>
            {logoNegocio && (
              <img
                src={logoNegocio}
                alt="Logo do negócio"
                style={{height:'64px', maxWidth:'160px', objectFit:'contain'}}
              />
            )}
            <div>
              {nomeNegocio && <h2 style={{fontSize:'1.3rem', fontWeight:800, marginBottom:'0.2rem'}}>{nomeNegocio}</h2>}
              <p style={{color:'var(--texto-secundario)', fontSize:'0.9rem'}}>
                Relatório de faturamento — <strong>{MESES[mesSel]} {anoSel}</strong>
              </p>
              {configuracoes.regiaoAtuacao && (
                <p style={{fontSize:'0.82rem', color:'var(--neutro-muted)'}}>📍 {configuracoes.regiaoAtuacao}</p>
              )}
            </div>
          </div>
          {!nomeNegocio && !logoNegocio && (
            <p style={{fontSize:'0.82rem', color:'var(--neutro-muted)', marginTop:'0.5rem'}}>
              💡 Adicione o nome e logo do seu negócio em{' '}
              <Link to="/configuracoes" style={{color:'var(--verde-principal)', fontWeight:600}}>Configurações</Link>
              {' '}para personalizar este cabeçalho.
            </p>
          )}
        </div>

        {/* Alertas */}
        {custosZerados && (
          <div className="alerta-aviso" style={{marginBottom:'1.5rem'}}>
            ⚠️ Seus custos fixos estão zerados.{' '}
            <Link to="/custos-fixos" style={{color:'inherit', fontWeight:700, textDecoration:'underline'}}>Preencher custos fixos</Link>
          </div>
        )}
        {produtos.some(p => !p.quantidadeMes || Number(p.quantidadeMes) === 0) && (
          <div className="alerta-aviso" style={{marginBottom:'1.5rem'}}>
            ⚠️ Alguns produtos não têm quantidade mensal informada.{' '}
            <Link to="/produtos" style={{color:'inherit', fontWeight:700, textDecoration:'underline'}}>Corrigir produtos</Link>
          </div>
        )}

        {/* Resumo geral */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">Resumo — {MESES[mesSel]} {anoSel}</h2>
          <div className="relatorio-grid-info">
            <div className="info-item">
              <span className="info-label">Receita bruta projetada</span>
              <span className="info-valor valor-verde">{formatarMoeda(totalReceita)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lucro total projetado</span>
              <span className="info-valor valor-verde">{formatarMoeda(totalLucro)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total de custos fixos</span>
              <span className="info-valor">{formatarMoeda(totalCustos)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Margem de lucro definida</span>
              <span className="info-valor">{configuracoes.margemLucro}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Custo/hora de trabalho</span>
              <span className="info-valor">{formatarMoeda(configuracoes.custoHora)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Produtos cadastrados</span>
              <span className="info-valor">{produtos.length}</span>
            </div>
          </div>
        </div>

        {/* Custos fixos detalhados */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">Custos fixos detalhados</h2>
          {custosZerados ? (
            <div className="estado-vazio">
              <span>💸</span>
              <p>Nenhum custo fixo registrado.</p>
              <Link to="/custos-fixos" className="btn-primary" style={{display:'inline-block',width:'auto',padding:'0.6rem 1.5rem',marginTop:'1rem'}}>Cadastrar custos fixos</Link>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead><tr><th>Despesa</th><th>Valor mensal</th></tr></thead>
                <tbody>
                  {Object.entries(custosFixos)
                    .filter(([k, v]) => k !== 'extras' && Number(v) > 0)
                    .map(([k, v]) => (
                      <tr key={k}><td>{NOMES_CUSTOS[k] || k}</td><td>{formatarMoeda(v)}</td></tr>
                    ))
                  }
                  {(custosFixos.extras || []).filter(e => Number(e.valor) > 0).map(e => (
                    <tr key={e.id}><td>{e.descricao || 'Extra'}</td><td>{formatarMoeda(e.valor)}</td></tr>
                  ))}
                  <tr style={{fontWeight:700, background:'var(--verde-fundo)'}}>
                    <td>Total</td>
                    <td className="valor-verde">{formatarMoeda(totalCustos)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabela de produtos */}
        <div className="card">
          <h2 className="secao-titulo">Produtos e projeção de faturamento — {MESES[mesSel]} {anoSel}</h2>

          {produtos.length > 0 && !custosZerados && (
            <div className="alerta-info" style={{marginBottom:'1rem', fontSize:'0.85rem'}}>
              ℹ️ <strong>Rateio do custo fixo:</strong> {formatarMoeda(totalCustos)} ÷ {totalUnidades} un totais = {formatarMoeda(fixoPorUnidade)}/un para qualquer produto.
            </div>
          )}

          {produtos.length === 0 ? (
            <div className="estado-vazio">
              <span>📦</span>
              <p>Nenhum produto cadastrado.</p>
              <Link to="/produtos" className="btn-primary" style={{display:'inline-block',width:'auto',padding:'0.6rem 1.5rem',marginTop:'1rem'}}>Cadastrar produto</Link>
            </div>
          ) : (
            <>
              <div className="tabela-wrapper">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Qtd/mês</th>
                      <th>Custo direto</th>
                      <th>Fixo/un</th>
                      <th>Custo total</th>
                      <th>Preço sugerido</th>
                      <th>Lucro/un</th>
                      <th>Lucro mês</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map(p => {
                      const custo  = calcularCustoTotal(p);
                      const preco  = calcularPrecoSugerido(p);
                      const qtd    = Number(p.quantidadeMes || 0);
                      const lucroUn  = preco - custo;
                      const lucroMes = lucroUn * qtd;
                      return (
                        <tr key={p.id}>
                          <td>{p.nome}</td>
                          <td><span className="badge">{p.categoria}</span></td>
                          <td>{qtd > 0 ? `${qtd} un.` : <span style={{color:'var(--alerta)',fontSize:'0.8rem'}}>Não informado</span>}</td>
                          <td>{formatarMoeda(p.custo)}</td>
                          <td>{formatarMoeda(fixoPorUnidade)}</td>
                          <td>{formatarMoeda(custo)}</td>
                          <td className="preco-sugerido">{formatarMoeda(preco)}</td>
                          <td className="valor-verde">{formatarMoeda(lucroUn)}</td>
                          <td className="valor-verde">{formatarMoeda(lucroMes)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{fontWeight:700, background:'var(--verde-fundo)'}}>
                      <td colSpan={8}>Total</td>
                      <td className="valor-verde">{formatarMoeda(totalLucro)}</td>
                    </tr>
                  </tfoot>
                </table>
                <p style={{fontSize:'0.78rem',color:'var(--neutro-muted)',marginTop:'0.5rem'}}>
                  * Fixo/un = {formatarMoeda(totalCustos)} ÷ {totalUnidades} un = {formatarMoeda(fixoPorUnidade)}/un
                </p>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
