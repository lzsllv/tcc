import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  return (
    <div className="lp-wrapper">

      {/* ===== HEADER ===== */}
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-logo">
            <span className="lp-logo-icone">&#x1F4B0;</span>
            <span className="lp-logo-nome">Precifique</span>
          </div>
          <nav className="lp-nav">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-header-acoes">
            <Link to="/login" className="lp-btn-ghost">Entrar</Link>
            <Link to="/cadastro" className="lp-btn-verde">Criar conta gratis</Link>
          </div>
          <button className="lp-menu-toggle" onClick={() => {
            const nav = document.querySelector('.lp-nav');
            nav.classList.toggle('aberto');
          }}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">100% gratuito - sem cartao de credito</div>
          <h1 className="lp-hero-titulo">
            Pare de cobrar <span className="lp-destaque">no achismo.</span><br />
            Precifique com inteligencia.
          </h1>
          <p className="lp-hero-subtitulo">
            O Precifique calcula automaticamente o custo real dos seus produtos e servicos,
            sugere precos com margem de lucro e mostra seu ganho mensal estimado.
            Feito para autonomos que querem crescer de verdade.
          </p>
          <div className="lp-hero-acoes">
            <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Comecar agora - e gratis</Link>
            <a href="#como-funciona" className="lp-btn-outline lp-btn-lg">Ver como funciona</a>
          </div>
          <p className="lp-hero-nota">Sem instalacao &nbsp;&nbsp; Dados salvos automaticamente &nbsp;&nbsp; Funciona no celular</p>
        </div>

        <div className="lp-hero-mockup">
          <div className="lp-mockup-card">
            <div className="lp-mockup-header">
              <div className="lp-mockup-dot" style={{background:'#ff5f57'}}></div>
              <div className="lp-mockup-dot" style={{background:'#febc2e'}}></div>
              <div className="lp-mockup-dot" style={{background:'#28c840'}}></div>
              <span style={{marginLeft:'auto', fontSize:'0.75rem', color:'#999'}}>Precifique - Dashboard</span>
            </div>
            <div className="lp-mockup-body">
              <div className="lp-mockup-greeting">Ola, Maria!</div>
              <div className="lp-mockup-cards">
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Produtos</span>
                  <span className="lp-mockup-stat-val">12</span>
                </div>
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Custos fixos</span>
                  <span className="lp-mockup-stat-val">R$ 1.800</span>
                </div>
                <div className="lp-mockup-stat verde">
                  <span className="lp-mockup-stat-label">Preco medio</span>
                  <span className="lp-mockup-stat-val">R$ 62,50</span>
                </div>
                <div className="lp-mockup-stat">
                  <span className="lp-mockup-stat-label">Margem</span>
                  <span className="lp-mockup-stat-val">30%</span>
                </div>
              </div>
              <div className="lp-mockup-table">
                <div className="lp-mockup-row header">
                  <span>Produto</span><span>Custo total</span><span>Preco sugerido</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Bolo de chocolate</span><span>R$ 35,00</span><span className="verde">R$ 45,50</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Brigadeiro (caixa)</span><span>R$ 18,00</span><span className="verde">R$ 23,40</span>
                </div>
                <div className="lp-mockup-row">
                  <span>Torta de limao</span><span>R$ 28,00</span><span className="verde">R$ 36,40</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="lp-social-proof">
        <p className="lp-social-label">Feito para autonomos como</p>
        <div className="lp-social-tags">
          {['Confeiteiros','Cabeleireiros','Artesaos','Costureiras','Designers','Marceneiros','Fotografos','Diaristas'].map(tag => (
            <span key={tag} className="lp-tag">{tag}</span>
          ))}
        </div>
      </section>

      {/* ===== FUNCIONALIDADES ===== */}
      <section className="lp-section" id="funcionalidades">
        <div className="lp-section-inner">
          <div className="lp-section-label">Funcionalidades</div>
          <h2 className="lp-section-titulo">Tudo que voce precisa para precificar certo</h2>
          <p className="lp-section-sub">Uma ferramenta completa, simples de usar, desenvolvida pensando em quem trabalha por conta propria.</p>

          <div className="lp-features-grid">
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F4E6;</div>
              <h3>Cadastro de produtos</h3>
              <p>Registre todos os seus produtos e servicos com custo, tempo de producao e categoria.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F4CA;</div>
              <h3>Calculo automatico</h3>
              <p>O sistema calcula o custo total real incluindo custos fixos e mao de obra automaticamente.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F3AF;</div>
              <h3>Preco sugerido</h3>
              <p>Receba uma sugestao de preco com base na sua margem de lucro desejada, sem chute.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F4C8;</div>
              <h3>Simulacao de lucro</h3>
              <p>Simule quanto vai ganhar por mes com diferentes precos e quantidades antes de decidir.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F4B8;</div>
              <h3>Custos fixos</h3>
              <p>Registre aluguel, energia, internet e salarios para um calculo mais preciso e real.</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icone">&#x1F4DD;</div>
              <h3>Relatorio completo</h3>
              <p>Visualize e imprima um relatorio detalhado com todos os seus custos, precos e margens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="lp-section lp-section-verde" id="como-funciona">
        <div className="lp-section-inner">
          <div className="lp-section-label claro">Como funciona</div>
          <h2 className="lp-section-titulo claro">Tres passos para precificar do jeito certo</h2>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <h3>Crie sua conta</h3>
              <p>Cadastro rapido com nome, e-mail e senha. Sem cartao, sem burocracia.</p>
            </div>
            <div className="lp-step-seta">&#x2192;</div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <h3>Configure seu negocio</h3>
              <p>Informe seus custos fixos, margem de lucro desejada e custo da sua hora.</p>
            </div>
            <div className="lp-step-seta">&#x2192;</div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h3>Cadastre e precifique</h3>
              <p>Adicione seus produtos e receba automaticamente o preco ideal para cada um.</p>
            </div>
          </div>

          <div style={{textAlign:'center', marginTop:'3rem'}}>
            <Link to="/cadastro" className="lp-btn-branco lp-btn-lg">Quero comecar agora</Link>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="lp-section" id="depoimentos">
        <div className="lp-section-inner">
          <div className="lp-section-label">Depoimentos</div>
          <h2 className="lp-section-titulo">Autonomos que pararam de perder dinheiro</h2>

          <div className="lp-testimonials">
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
              <p>"Eu vendia bolo ha anos sem saber se tinha lucro. Com o Precifique descobri que cobrava abaixo do custo. Hoje meu faturamento dobrou."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">M</div>
                <div>
                  <strong>Maria Silva</strong>
                  <span>Confeiteira, Sao Paulo</span>
                </div>
              </div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
              <p>"Simples e direto. Em 10 minutos ja tinha todos os meus servicos precificados corretamente. Nao preciso de planilha mais."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">R</div>
                <div>
                  <strong>Roberto Souza</strong>
                  <span>Marceneiro, Curitiba</span>
                </div>
              </div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-estrelas">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
              <p>"Finalmente entendi quanto custa minha hora de trabalho. O sistema me mostrou que eu precisava cobrar 40% a mais. Clientes entenderam."</p>
              <div className="lp-testimonial-autor">
                <div className="lp-testimonial-avatar">A</div>
                <div>
                  <strong>Ana Paula</strong>
                  <span>Designer Grafica, Belo Horizonte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="lp-section lp-section-cinza" id="faq">
        <div className="lp-section-inner lp-section-narrow">
          <div className="lp-section-label">Duvidas frequentes</div>
          <h2 className="lp-section-titulo">Perguntas e respostas</h2>

          <div className="lp-faq">
            {[
              { p: 'O Precifique e mesmo gratuito?', r: 'Sim, 100% gratuito. Sem planos pagos, sem cartao de credito, sem surpresas.' },
              { p: 'Meus dados ficam salvos?', r: 'Sim. Todos os dados sao salvos automaticamente no seu navegador e persistem entre sessoes.' },
              { p: 'Funciona no celular?', r: 'Sim, o sistema e totalmente responsivo e funciona bem em qualquer dispositivo.' },
              { p: 'Preciso instalar alguma coisa?', r: 'Nao. O Precifique roda direto no navegador, sem download ou instalacao.' },
              { p: 'Posso usar para servicos tambem?', r: 'Sim. Alem de produtos fisicos, voce pode cadastrar servicos e calcular o preco com base no seu tempo de trabalho.' },
            ].map((item, i) => (
              <details key={i} className="lp-faq-item">
                <summary className="lp-faq-pergunta">{item.p}<span className="lp-faq-seta">&#x25BE;</span></summary>
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
          <p className="lp-cta-sub">Crie sua conta agora e comece a precificar com inteligencia. E gratuito.</p>
          <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Criar conta gratis</Link>
          <p style={{marginTop:'1rem', opacity:0.7, fontSize:'0.9rem'}}>Ja tem conta? <Link to="/login" style={{color:'#fff', fontWeight:600}}>Entrar</Link></p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">
            <span className="lp-logo-icone">&#x1F4B0;</span>
            <span className="lp-logo-nome">Precifique</span>
          </div>
          <p className="lp-footer-copy">2025 Precifique. Feito com amor para autonomos brasileiros.</p>
          <div className="lp-footer-links">
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
