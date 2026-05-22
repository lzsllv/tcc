import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [demoCarregando, setDemoCarregando] = useState(false);
  const { carregarDadosDemo, login, cadastrar } = useApp();
  const navigate = useNavigate();

  function handleDemo() {
    setDemoCarregando(true);
    // Cria/reutiliza conta demo e loga automaticamente
    const emailDemo  = 'demo@precifique.com';
    const senhaDemo  = 'demo1234';
    const nomeDemo   = 'Maria (Demo)';
    const jaExiste   = !cadastrar(nomeDemo, emailDemo, senhaDemo); // retorna false se já existia
    if (!jaExiste) {
      // conta já existia, tenta login normal
    }
    login(emailDemo, senhaDemo);
    carregarDadosDemo();
    setTimeout(() => {
      setDemoCarregando(false);
      navigate('/dashboard');
    }, 600);
  }

  return (
    <div className="lp-wrapper">

      {/* ===== HEADER ===== */}
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-logo">
            <span className="lp-logo-icone">💰</span>
            <span className="lp-logo-nome">Precifique</span>
          </div>
          <nav className={`lp-nav${menuAberto ? ' aberto' : ''}`}>
            <a href="#funcionalidades" onClick={() => setMenuAberto(false)}>Funcionalidades</a>
            <a href="#como-funciona"   onClick={() => setMenuAberto(false)}>Como funciona</a>
            <a href="#depoimentos"     onClick={() => setMenuAberto(false)}>Depoimentos</a>
            <a href="#faq"             onClick={() => setMenuAberto(false)}>FAQ</a>
          </nav>
          <div className="lp-header-acoes">
            <Link to="/login" className="lp-btn-ghost">Entrar</Link>
            <Link to="/cadastro" className="lp-btn-verde">Criar conta grátis</Link>
          </div>
          {/* Menu mobile */}
          <button
            className={`lp-menu-toggle${menuAberto ? ' aberto' : ''}`}
            onClick={() => setMenuAberto(prev => !prev)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">100% gratuito • sem cartão de crédito</div>
          <h1 className="lp-hero-titulo">
            Pare de cobrar <span className="lp-destaque">no achismo.</span><br />
            Precifique com inteligência.
          </h1>
          <p className="lp-hero-subtitulo">
            O Precifique calcula automaticamente o custo real dos seus produtos e serviços,
            sugere preços com margem de lucro e mostra seu ganho mensal estimado.
            Feito para autônomos que querem crescer de verdade.
          </p>
          <div className="lp-hero-acoes">
            <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Começar agora — é grátis</Link>
            <a href="#como-funciona" className="lp-btn-outline lp-btn-lg">Ver como funciona</a>
          </div>
          <p className="lp-hero-nota">✓ Sem instalação    ✓ Dados salvos automaticamente    ✓ Funciona no celular</p>

          {/* Botão de demo para avaliadores */}
          <div className="lp-demo-banner">
            <div className="lp-demo-texto">
              <span className="lp-demo-tag">🎓 Para avaliadores</span>
              <p>Veja o sistema funcionando com dados reais de uma confeiteira — sem precisar cadastrar.</p>
            </div>
            <button
              className="lp-btn-demo"
              onClick={handleDemo}
              disabled={demoCarregando}
            >
              {demoCarregando ? '⏳ Carregando...' : '▶ Entrar na demo'}
            </button>
          </div>
        </div>

        {/* Mockup visual */}
        <div className="lp-hero-mockup">
          <div className="lp-mockup-card">
            <div className="lp-mockup-header">
              <div className="lp-mockup-dot" style={{background:'#ff5f57'}}></div>
              <div className="lp-mockup-dot" style={{background:'#febc2e'}}></div>
              <div className="lp-mockup-dot" style={{background:'#28c840'}}></div>
              <span style={{marginLeft:'auto', fontSize:'0.75rem', color:'#999'}}>Precifique — Dashboard</span>
            </div>
            <div className="lp-mockup-body">
              <div className="lp-mockup-greeting">Olá, Maria! 👋</div>
              <div className="lp-mockup-cards">
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Produtos</span>
                  <span className="lp-mockup-stat-val">5</span>
                </div>
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Custos fixos</span>
                  <span className="lp-mockup-stat-val">R$ 1.350</span>
                </div>
                <div className="lp-mockup-stat verde">
                  <span className="lp-mockup-stat-label">Preço médio</span>
                  <span className="lp-mockup-stat-val">R$ 68,40</span>
                </div>
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Margem</span>
                  <span className="lp-mockup-stat-val">30%</span>
                </div>
              </div>
              <div className="lp-mockup-table">
                <div className="lp-mockup-row header">
                  <span>Produto</span><span>Custo total</span><span>Preço sugerido</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Bolo de chocolate</span><span>R$ 52,60</span><span className="verde">R$ 68,40</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Brigadeiro (caixa)</span><span>R$ 32,10</span><span className="verde">R$ 41,70</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Torta de limão</span><span>R$ 43,50</span><span className="verde">R$ 56,55</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGOS / SOCIAL PROOF ===== */}
      <section className="lp-social-proof">
        <p className="lp-social-label">Feito para autônomos como</p>
        <div className="lp-social-tags">
          {['Confeiteiros','Cabeleireiros','Artesãos','Costureiras','Designers','Marceneiros','Fotógrafos','Diaristas'].map(tag => (
            <span key={tag} className="lp-tag">{tag}</span>
          ))}
        </div>
      </section>

      {/* ===== FUNCIONALIDADES ===== */}
      <section className="lp-section" id="funcionalidades">
        <div className="lp-section-inner">
          <div className="lp-section-label">Funcionalidades</div>
          <h2 className="lp-section-titulo">Tudo que você precisa para precificar certo</h2>
          <p className="lp-section-sub">Uma ferramenta completa, simples de usar, desenvolvida pensando em quem trabalha por conta própria.</p>

          <div className="lp-features-grid">
            <div className="lp-feature">
              <div className="lp-feature-icone">📦</div>
              <h3>Cadastro de produtos</h3>
              <p>Registre todos os seus produtos e serviços com custo, tempo de produção e categoria.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">📊</div>
              <h3>Cálculo automático</h3>
              <p>O sistema calcula o custo total real incluindo custos fixos e mão de obra automaticamente.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">🎯</div>
              <h3>Preço sugerido</h3>
              <p>Receba uma sugestão de preço com base na sua margem de lucro desejada, sem chute.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">📈</div>
              <h3>Simulação de lucro</h3>
              <p>Simule quanto vai ganhar por mês com diferentes preços e quantidades antes de decidir.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">💸</div>
              <h3>Custos fixos</h3>
              <p>Registre aluguel, energia, internet e salários para um cálculo mais preciso e real.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">📝</div>
              <h3>Relatório completo</h3>
              <p>Visualize e imprima um relatório detalhado com todos os seus custos, preços e margens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="lp-section lp-section-verde" id="como-funciona">
        <div className="lp-section-inner">
          <div className="lp-section-label claro">Como funciona</div>
          <h2 className="lp-section-titulo claro">Três passos para precificar do jeito certo</h2>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <h3>Crie sua conta</h3>
              <p>Cadastro rápido com nome, e-mail e senha. Sem cartão, sem burocracia.</p>
            </div>
            <div className="lp-step-seta">→</div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <h3>Configure seu negócio</h3>
              <p>Informe seus custos fixos, margem de lucro desejada e custo da sua hora.</p>
            </div>
            <div className="lp-step-seta">→</div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h3>Cadastre e precifique</h3>
              <p>Adicione seus produtos e receba automaticamente o preço ideal para cada um.</p>
            </div>
          </div>

          <div style={{textAlign:'center', marginTop:'3rem'}}>
            <Link to="/cadastro" className="lp-btn-branco lp-btn-lg">Quero começar agora</Link>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="lp-section" id="depoimentos">
        <div className="lp-section-inner">
          <div className="lp-section-label">Depoimentos</div>
          <h2 className="lp-section-titulo">Autônomos que pararam de perder dinheiro</h2>

          <div className="lp-testimonials">
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">★★★★★</div>
              <p>"Eu vendia bolo há anos sem saber se tinha lucro. Com o Precifique descobri que cobrava abaixo do custo. Hoje meu faturamento dobrou."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">M</div>
                <div>
                  <strong>Maria Silva</strong>
                  <span>Confeiteira, São Paulo</span>
                </div>
              </div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">★★★★★</div>
              <p>"Simples e direto. Em 10 minutos já tinha todos os meus serviços precificados corretamente. Não preciso de planilha mais."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">R</div>
                <div>
                  <strong>Roberto Souza</strong>
                  <span>Marceneiro, Curitiba</span>
                </div>
              </div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">★★★★★</div>
              <p>"Finalmente entendi quanto custa minha hora de trabalho. O sistema me mostrou que eu precisava cobrar 40% a mais. Clientes entenderam."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">A</div>
                <div>
                  <strong>Ana Paula</strong>
                  <span>Designer Gráfica, Belo Horizonte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="lp-section lp-section-cinza" id="faq">
        <div className="lp-section-inner lp-section-narrow">
          <div className="lp-section-label">Dúvidas frequentes</div>
          <h2 className="lp-section-titulo">Perguntas e respostas</h2>

          <div className="lp-faq">
            {[
              {
                p: 'O Precifique é mesmo gratuito?',
                r: 'Sim, 100% gratuito. Sem planos pagos, sem cartão de crédito, sem surpresas.'
              },
              {
                p: 'Meus dados ficam salvos?',
                r: 'Sim. Todos os dados são salvos automaticamente no seu navegador e persistem entre sessões.'
              },
              {
                p: 'Funciona no celular?',
                r: 'Sim, o sistema é totalmente responsivo e funciona bem em qualquer dispositivo.'
              },
              {
                p: 'Preciso instalar alguma coisa?',
                r: 'Não. O Precifique roda direto no navegador, sem download ou instalação.'
              },
              {
                p: 'Posso usar para serviços também?',
                r: 'Sim. Além de produtos físicos, você pode cadastrar serviços e calcular o preço com base no seu tempo de trabalho.'
              },
            ].map((item, i) => (
              <details key={i} className="lp-faq-item">
                <summary className="lp-faq-pergunta">{item.p}<span className="lp-faq-seta">▾</span></summary>
                <p className="lp-faq-resposta">{item.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-titulo">Pronto para cobrar o que o seu trabalho vale?</h2>
          <p className="lp-cta-sub">Crie sua conta agora e comece a precificar com inteligência. É gratuito.</p>
          <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Criar conta grátis</Link>
          <p style={{marginTop:'1rem', opacity:0.7, fontSize:'0.9rem'}}>Já tem conta? <Link to="/login" style={{color:'#fff', fontWeight:600}}>Entrar</Link></p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">
            <span className="lp-logo-icone">💰</span>
            <span className="lp-logo-nome">Precifique</span>
          </div>
          <p className="lp-footer-copy">© 2026 Precifique. Feito com ♥ para autônomos brasileiros.</p>
          <div className="lp-footer-links">
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
