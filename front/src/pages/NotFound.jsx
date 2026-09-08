import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: 'var(--bg)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem' }}>🔍</div>
      <h1 style={{ fontSize: '1.8rem', color: 'var(--texto)', fontWeight: 700 }}>Página não encontrada</h1>
      <p style={{ color: 'var(--texto-muted)', maxWidth: '36ch' }}>
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="lp-btn-verde"
        style={{ marginTop: '1rem', padding: '0.7rem 2rem', borderRadius: 'var(--radius)', fontWeight: 600 }}
      >
        Voltar para o início
      </Link>
    </div>
  );
}
