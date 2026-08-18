import { supabase } from '../lib/supabase';

export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;

  if (data.user && data.session) {
    await ensureUserProfile({
      id: data.user.id,
      name,
      email: data.user.email,
    });
  }

  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function ensureUserProfile({ id, name, email }) {
  const { error } = await supabase.from('users').upsert(
    {
      id,
      name: name || email?.split('@')[0] || 'Usuário',
      email,
    },
    { onConflict: 'id' },
  );

  if (error) throw error;
}
