import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/authService';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && window.location.pathname !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </main>
  );
}

function getAuthErrorMessage(error) {
  const message = error?.message?.toLowerCase() ?? '';
  if (message.includes('invalid login credentials')) return 'E-mail ou senha inválidos.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  return 'Não foi possível entrar. Tente novamente.';
}
