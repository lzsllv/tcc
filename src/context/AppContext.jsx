import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentSession,
  onAuthStateChange,
  signOut as signOutService,
} from '../services/authService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentSession()
      .then((currentSession) => {
        if (mounted) setSession(currentSession);
      })
      .catch((error) => {
        console.error('Erro ao recuperar sessão:', error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data } = onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isAuthenticated: Boolean(session?.user),
      signOut: signOutService,
    }),
    [session, loading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider.');
  }

  return context;
}
