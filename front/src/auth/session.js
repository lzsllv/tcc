export function sessionUser(session) {
  const user = session?.user;
  if (!user?.id) return null;
  return {
    id: user.id,
    email: user.email ?? '',
    nome: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuário',
  };
}
