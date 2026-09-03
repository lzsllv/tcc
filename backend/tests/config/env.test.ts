import { describe, expect, it } from 'vitest';
import { parseEnv } from '../../src/config/env.js';

const validEnv = {
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/precifique',
  DIRECT_URL: 'postgresql://user:pass@localhost:5432/precifique',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
  SUPABASE_SECRET_KEY: 'sb_secret_test',
};

describe('parseEnv', () => {
  it('aplica os padrões seguros do servidor local', () => {
    expect(parseEnv(validEnv)).toMatchObject({
      port: 3333,
      corsOrigin: 'http://localhost:5173',
      logLevel: 'info',
    });
  });

  it('recusa iniciar sem a chave secreta do servidor', () => {
    const incomplete = { ...validEnv, SUPABASE_SECRET_KEY: undefined };
    expect(() => parseEnv(incomplete)).toThrow(/SUPABASE_SECRET_KEY/);
  });
});
