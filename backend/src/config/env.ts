import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgresql://'),
  DIRECT_URL: z.url().startsWith('postgresql://'),
  SUPABASE_URL: z.url().startsWith('https://'),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  CORS_ORIGIN: z.url().default('http://localhost:5173'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3333),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type AppEnv = ReturnType<typeof parseEnv>;

export function parseEnv(input: Record<string, string | undefined>) {
  const parsed = envSchema.parse(input);
  return {
    databaseUrl: parsed.DATABASE_URL,
    directUrl: parsed.DIRECT_URL,
    supabaseUrl: parsed.SUPABASE_URL,
    supabasePublishableKey: parsed.SUPABASE_PUBLISHABLE_KEY,
    supabaseSecretKey: parsed.SUPABASE_SECRET_KEY,
    corsOrigin: parsed.CORS_ORIGIN,
    port: parsed.PORT,
    logLevel: parsed.LOG_LEVEL,
  };
}
