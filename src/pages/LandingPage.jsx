import { Link } from 'react-router-dom';
import {
  ArrowRight, Calculator, ChartLineUp, Check, Coins, FileText,
  Package, ShieldCheck, SlidersHorizontal, Star, Storefront, UserPlus,
} from '@phosphor-icons/react';
import heroEmpreendedora from '../assets/hero-empreendedora.webp';
import '../styles/LandingPage.css';

const funcionalidades = [
  { icon: Package, titulo: 'Cadastro de produtos', texto: 'Registre produtos e serviços com custo, tempo de produção e categoria.' },
  { icon: Calculator, titulo: 'Cálculo automático', texto: 'Veja o custo real com despesas fixas e mão de obra incluídas.' },
  { icon: SlidersHorizontal, titulo: 'Preço sugerido', texto: 'Defina sua margem e receba uma referência de preço sem chute.' },
  { icon: ChartLineUp, titulo: 'Simulação de lucro', texto: 'Compare preços e quantidades antes de tomar uma decisão.' },
  { icon: Coins, titulo: 'Custos fixos', texto: 'Organize aluguel, energia, internet, salários e outros gastos.' },
  { icon: FileText, titulo: 'Relatório completo', texto: 'Visualize e imprima custos, preços e projeções mensais.' },
];

const etapas = [
  { icon: UserPlus, titulo: 'Crie sua conta', texto: 'Cadastro rápido com nome, e-mail e senha.' },
  { icon: Storefront, titulo: 'Configure seu negócio', texto: 'Informe custos fixos, margem e custo da sua hora.' },
  { icon: Check, titulo: 'Cadastre e precifique', texto: 'Adicione seus produtos e consulte o preço sugerido.' },
];

const faq = [
  ['O Precifique é mesmo gratuito?', 'Sim, 100% gratuito. Sem planos pagos, cartão de crédito ou surpresas.'],
  ['Meus dados ficam salvos?', 'Sim. Os dados são salvos automaticamente no seu navegador e persistem entre sessões.'],
  ['Funciona no celular?', 'Sim, o sistema é responsivo e funciona em computadores, tablets e celulares.'],
  ['Preciso instalar alguma coisa?', 'Não. O Precifique funciona diretamente no navegador.'],
  ['Posso usar para serviços também?', 'Sim. Você pode cadastrar serviços e calcular o preço com base no seu tempo de trabalho.'],
];

export default function LandingPage() {
  return (
    <div className="lp-wrapper">
      <header className="lp-header">
        <div className="lp-header-inner">
          <Link to="/" className="lp-logo" aria-label="Precifique, página inicial">
            <span className="lp-logo-icone"><Coins size={21} weight="fill" /></span>
            <span className="lp-logo-nome">Precifique</span>
          </Link>
          <nav className="lp-nav" aria-label="Navegação principal">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-header-acoes">
            <Link to="/login" className="lp-btn-ghost">Entrar</Link>
            <Link to="/cadastro" className="lp-btn-verde">Criar conta grátis</Link>
          </div>
          <button className="lp-menu-toggle" aria-label="Abrir menu" onClick={() => {
            document.querySelector('.lp-nav')?.classList.toggle('aberto');
          }}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div className="lp-hero-copy">
              <p className="lp-hero-badge"><ShieldCheck size={18} /> 100% gratuito, sem cartão</p>
              <h1 className="lp-hero-titulo">Preço certo. <span>Negócio forte.</span></h1>
              <p className="lp-hero-subtitulo">Calcule custos, defina sua margem e descubra quanto cobrar com segurança.</p>
              <div className="lp-hero-acoes">
                <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Começar agora <ArrowRight size={19} /></Link>
                <a href="#como-funciona" className="lp-btn-outline lp-btn-lg">Ver como funciona</a>
              </div>
            </div>

            <div className="lp-hero-visual">
              <img src={heroEmpreendedora} alt="Empreendedora calculando o preço de um produto artesanal" />
              <div className="lp-hero-resumo">
                <span>Preço sugerido</span>
                <strong>R$ 45,50</strong>
                <small>Custo e margem considerados</small>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-social-proof" aria-label="Públicos atendidos">
          <p>Feito para quem transforma habilidade em renda</p>
          <div className="lp-social-tags">
            {['Confeitaria', 'Artesanato', 'Costura', 'Design', 'Marcenaria', 'Fotografia', 'Beleza', 'Serviços'].map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="lp-section" id="funcionalidades">
          <div className="lp-section-inner">
            <div className="lp-section-heading">
              <p className="lp-section-label">Funcionalidades</p>
              <h2 className="lp-section-titulo">Decisões melhores começam com custos claros</h2>
              <p className="lp-section-sub">Uma visão prática do que entra no preço e do lucro que pode ficar no seu negócio.</p>
            </div>
            <div className="lp-features-grid">
              {funcionalidades.map(({ icon: Icon, titulo, texto }, index) => (
                <article className={`lp-feature lp-feature-${index + 1}`} key={titulo}>
                  <span className="lp-feature-icone"><Icon size={24} weight="duotone" /></span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section-verde" id="como-funciona">
          <div className="lp-section-inner">
            <h2 className="lp-section-titulo">Do cadastro ao preço certo</h2>
            <div className="lp-steps">
              {etapas.map(({ icon: Icon, titulo, texto }, index) => (
                <article className="lp-step" key={titulo}>
                  <span className="lp-step-num">0{index + 1}</span>
                  <span className="lp-step-icon"><Icon size={26} /></span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </article>
              ))}
            </div>
            <Link to="/cadastro" className="lp-btn-verde lp-btn-lg lp-step-cta">Criar minha conta <ArrowRight size={19} /></Link>
          </div>
        </section>

        <section className="lp-section" id="depoimentos">
          <div className="lp-section-inner">
            <h2 className="lp-section-titulo">Mais clareza para cobrar sem medo</h2>
            <div className="lp-testimonials">
              {[
                ['Eu vendia bolo há anos sem saber se tinha lucro. Descobri que cobrava abaixo do custo e consegui reorganizar meus preços.', 'Maria Silva', 'Confeiteira, São Paulo'],
                ['Em poucos minutos já tinha meus serviços precificados. Ficou muito mais simples explicar o valor ao cliente.', 'Roberto Souza', 'Marceneiro, Curitiba'],
                ['Finalmente entendi quanto custa minha hora de trabalho e passei a decidir com base nos números.', 'Ana Paula', 'Designer gráfica, Belo Horizonte'],
              ].map(([texto, nome, cargo], index) => (
                <article className={`lp-testimonial lp-testimonial-${index + 1}`} key={nome}>
                  <div className="lp-testimonial-estrelas" aria-label="5 estrelas">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} weight="fill" />)}
                  </div>
                  <blockquote>“{texto}”</blockquote>
                  <div className="lp-testimonial-autor">
                    <span className="lp-testimonial-avatar" aria-hidden="true">{nome[0]}</span>
                    <div><strong>{nome}</strong><span>{cargo}</span></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section-cinza" id="faq">
          <div className="lp-section-inner lp-section-narrow">
            <h2 className="lp-section-titulo">Dúvidas frequentes</h2>
            <div className="lp-faq">
              {faq.map(([pergunta, resposta]) => (
                <details key={pergunta} className="lp-faq-item">
                  <summary className="lp-faq-pergunta">{pergunta}<span>+</span></summary>
                  <p className="lp-faq-resposta">{resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-cta">
          <div className="lp-cta-inner">
            <h2 className="lp-cta-titulo">Comece a cobrar o que o seu trabalho vale</h2>
            <p className="lp-cta-sub">Crie sua conta gratuita e organize seus preços hoje.</p>
            <Link to="/cadastro" className="lp-btn-verde lp-btn-lg">Criar conta grátis <ArrowRight size={19} /></Link>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <Link to="/" className="lp-logo">
            <span className="lp-logo-icone"><Coins size={21} weight="fill" /></span>
            <span className="lp-logo-nome">Precifique</span>
          </Link>
          <p className="lp-footer-copy">© 2025 Precifique. Feito para autônomos brasileiros.</p>
          <div className="lp-footer-links"><Link to="/login">Entrar</Link><Link to="/cadastro">Cadastrar</Link></div>
        </div>
      </footer>
    </div>
  );
}
