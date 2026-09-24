import { useEffect, useState } from 'react';
import { sessionUser } from '../auth/session.js';

export function useLocalSession({ authServiceFactory, onIdentityChanged }) {
  const [authService] = useState(() => authServiceFactory());
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    const accept = session => {
      const user = sessionUser(session);
      onIdentityChanged(user);
      setUsuarioLogado(previous => previous?.id === user?.id ? previous : user);
    };

    authService.getSession()
      .then(session => { if (active && !receivedAuthEvent) accept(session); })
      .catch(() => { if (active && !receivedAuthEvent) accept(null); })
      .finally(() => { if (active) setAuthStatus('ready'); });
    const unsubscribe = authService.subscribe(session => {
      if (active) {
        receivedAuthEvent = true;
        accept(session);
        setAuthStatus('ready');
      }
    });

    return () => { active = false; unsubscribe(); };
  }, [authService, onIdentityChanged]);

  return {
    usuarioLogado,
    authStatus,
    login: async (email, senha) => { await authService.signIn(email, senha); return true; },
    cadastrar: (nome, email, senha) => authService.signUp(nome, email, senha),
    logout: () => authService.signOut(),
  };
}
