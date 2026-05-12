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
    totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade,
    calcularCustoTotal, calcularPrecoSugerido,
  } = useApp();

  const hoje = new Date();
  const [mesSel, setMesSel] = useState(hoje.getMonth());
  const [anoSel, setAnoSel] = useState(hoje.getFullYear());
  const anos = Array.from({ length: 5 }, (_, i) => hoje.getFullYear() - 2 + i);

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCustos    = totalCustosFixos();
  const totalUnidades  = totalUnidadesMes();
  const fixoPorUnidade = custoFixoPorUnidade();
  const custosZerados  = totalCustos === 0;

  const totalReceita = produtos.reduce((a, p) =>
    a + calcularPrecoSugerido(p) * Number(p.quantidadeMes || 0), 0);
  const totalLucro = produtos.reduce((a, p) => {
    const lucroUn = calcularPrecoSugerido(p) - calcularCustoTotal(p);
    return a + lucroUn * Number(p.quantidadeMes || 0);
  }, 0);

  const nomeNegocio = configuracoes.nomeNegocio || '';
  const logoNegocio = configuracoes.logoNegocio || '';

  return (
    <div>
      <Navbar />
      <main className="pagina-container">

        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📊 Relatório</h1>
            <p className="pagina-subtitulo">Visão completa dos seus custos, preços e margens</p>
          </div>
          <button className="btn-primary btn-imprimir" onClick={() => window.print()}>
            🖨️ Imprimir relatório
          </button>
        </div>

        {/* Filtro de período */}
        <div className="card relatorio-filtro">
          <h2 className="secao-titulo">📅 Período de referência</h2>
          <p className="relatorio-filtro-aviso">
            ℹ️ Este relatório exibe uma <strong>projeção mensal</strong> com base nos dados atuais.
            O mês e ano selecionados aparecem apenas no cabeçalho impresso.
          </p>
          <div className="relatorio-filtro-campos">
            <div className="campo-grupo campo-sem-margem">
              <label className="input-label">Mês</label>
              <select className="input-field" value={mesSel} onChange={e => setMesSel(Number(e.target.value))}>
                {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div className="campo-grupo campo-sem-margem">
              <label className="input-label">Ano</label>
              <select className="input-field" value={anoSel} onChange={e => setAnoSel(Number(e.target.value))}>
                {anos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <p className="relatorio-periodo-label">
              Cabeçalho do impresso: <strong>{MESES[mesSel]} {anoSel}</strong>
            </p>
          </div>
        </div>

        {/* Cabeçalho impresso */}
        <div className="relatorio-cabecalho-impresso card">
          <div className="relatorio-cabecalho-inner">
            {logoNegocio && (
              <img src={logoNegocio} alt="Logo do negócio" className="relatorio-logo" />
            )}
            <div>
              {nomeNegocio && <h2 className="relatorio-nome-negocio">{nomeNegocio}</h2>}
              <p className="relatorio-periodo-desc">
                Projeção mensal — <strong>{MESES[mesSel]} {anoSel}</strong>
              </p>
              {configuracoes.regiaoAtuacao && (
                <p className="relatorio-regiao">📍 {configuracoes.regiaoAtuacao}</p>
              )}
            </div>
          </div>
          {!nomeNegocio && !logoNegocio && (
            <p className="relatorio-sem-identidade">
              💡 Adicione o nome e logo do seu negócio em{' '}
              <Link to="/configuracoes">Configurações</Link>
              {' '}para personalizar este cabeçalho.
            </p>
          )}
        </div>

        {/* Alertas */}
        {custosZerados && (
          <div className="alerta-aviso relatorio-alerta">
            ⚠️ Seus custos fixos estão zerados.{' '}
            <Link to="/custos-fixos">Preencher custos fixos</Link>
          </div>
        )}
        {produtos.some(p => !p.quantidadeMes || Number(p.quantidadeMes) === 0) && (
          <div className="alerta-aviso relatorio-alerta">
            ⚠️ Alguns produtos não têm quantidade mensal informada.{' '}
            <Link to="/produtos">Corrigir produtos</Link>
          </div>
        )}

        {/* Resumo geral */}
        <div className="card relatorio-secao">
          <h2 className="secao-titulo">Resumo da projeção — {MESES[mesSel]} {anoSel}</h2>
          <div className="relatorio-grid-info">
            <div className="info-item">
              <span className="info-label">Receita bruta projetada</span>
              <span className="info-valor valor-verde">{fmt(totalReceita)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lucro total projetado</span>
              <span className="info-valor valor-verde">{fmt(totalLucro)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total de custos fixos</span>
              <span className="info-valor">{fmt(totalCustos)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Markup configurado</span>
              <span className="info-valor">{configuracoes.margemLucro}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Custo/hora de trabalho</span>
              <span className="info-valor">{fmt(configuracoes.custoHora)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Produtos cadastrados</span>
              <span className="info-valor">{produtos.length}</span>
            </div>
          </div>
        </div>

        {/* Custos fixos detalhados */}
        <div className="card relatorio-secao">
          <h2 className="secao-titulo">Custos fixos detalhados</h2>
          {custosZerados ? (
            <div className="estado-vazio">
              <span>💸</span>
              <p>Nenhum custo fixo registrado.</p>
              <Link to="/custos-fixos" className="btn-primary btn-estado-vazio">Cadastrar custos fixos</Link>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead><tr><th>Despesa</th><th>Valor mensal</th></tr></thead>
                <tbody>
                  {Object.entries(custosFixos)
                    .filter(([k, v]) => k !== 'extras' && Number(v) > 0)
                    .map(([k, v]) => (
                      <tr key={k}><td>{NOMES_CUSTOS[k] || k}</td><td>{fmt(v)}</td></tr>
                    ))}
                  {(custosFixos.extras || []).filter(e => Number(e.valor) > 0).map(e => (
                    <tr key={e.id}><td>{e.descricao || 'Extra'}</td><td>{fmt(e.valor)}</td></tr>
                  ))}
                  <tr className="tabela-total">
                    <td>Total</td>
                    <td className="valor-verde">{fmt(totalCustos)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabela de produtos */}
        <div className="card relatorio-secao">
          <h2 className="secao-titulo">Produção e projeção — {MESES[mesSel]} {anoSel}</h2>

          {produtos.length > 0 && !custosZerados && (
            <div className="alerta-info relatorio-rateio-info">
              ℹ️ <strong>Rateio do custo fixo:</strong> {fmt(totalCustos)} ÷ {totalUnidades} un totais
              {' '}= <strong>{fmt(fixoPorUnidade)}/un</strong> para qualquer produto.
            </div>
          )}

          {produtos.length === 0 ? (
            <div className="estado-vazio">
              <span>📦</span>
              <p>Nenhum produto cadastrado.</p>
              <Link to="/produtos" className="btn-primary btn-estado-vazio">Cadastrar produto</Link>
            </div>
          ) : (
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
                    const custo    = calcularCustoTotal(p);
                    const preco    = calcularPrecoSugerido(p);
                    const qtd      = Number(p.quantidadeMes || 0);
                    const lucroUn  = preco - custo;
                    const lucroMes = lucroUn * qtd;
                    return (
                      <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td><span className="badge">{p.categoria}</span></td>
                        <td>{qtd > 0 ? `${qtd} un.` : <span className="texto-aviso-sm">Não informado</span>}</td>
                        <td>{fmt(p.custo)}</td>
                        <td>{fmt(fixoPorUnidade)}</td>
                        <td>{fmt(custo)}</td>
                        <td className="preco-sugerido">{fmt(preco)}</td>
                        <td className="valor-verde">{fmt(lucroUn)}</td>
                        <td className="valor-verde">{fmt(lucroMes)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={8}>Total</td>
                    <td className="valor-verde">{fmt(totalLucro)}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="tabela-nota">
                * Fixo/un = {fmt(totalCustos)} ÷ {totalUnidades} un = {fmt(fixoPorUnidade)}/un
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
