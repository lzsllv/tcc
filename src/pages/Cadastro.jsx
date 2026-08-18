import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/authService';
import { useApp } from '../context/AppContext';

export default function Cadastro() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (data.session) {
        navigate('/dashboard');
      } else {
        setMessage('Cadastro realizado. Verifique seu e-mail para confirmar a conta.');
      }
    } catch (submitError) {
      setError(getSignUpErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}

function getSignUpErrorMessage(error) {
  const message = error?.message?.toLowerCase() ?? '';

  if (message.includes('already registered')) {
    return 'Este e-mail já está cadastrado.';
  }

  if (message.includes('password')) {
    return 'A senha não atende aos requisitos configurados.';
  }

  return 'Não foi possível criar a conta. Tente novamente.';
}
