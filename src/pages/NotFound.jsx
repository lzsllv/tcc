import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100dvh', gap: '1rem',
      fontFamily: 'var(--font)', color: 'var(--texto)', textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '4rem' }}>🔍</span>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Página não encontrada</h1>
      <p style={{ color: 'var(--texto-muted)', maxWidth: '36ch' }}>
        A página que você procura não existe ou foi movida.
      </p>
      <Link to="/" style={{
        marginTop: '.5rem', padding: '.65rem 1.5rem',
        background: 'var(--verde)', color: '#fff',
        borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '.9rem',
      }}>
        Voltar para o início
      </Link>
    </div>
  );
}
