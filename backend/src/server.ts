import 'dotenv/config';
import { createApp } from './app.js';
import { LogoApplicationService } from './application/logo-service.js';
import { WorkspaceApplicationService } from './application/workspace-service.js';
import { createSupabaseAuthVerifier } from './auth/supabase-auth-verifier.js';
import { parseEnv } from './config/env.js';
import { createPrismaClient } from './infrastructure/prisma/client.js';
import { PrismaWorkspaceRepository } from './infrastructure/prisma/prisma-workspace-repository.js';
import { createSupabaseLogoStorage } from './infrastructure/storage/supabase-logo-storage.js';

const environment = parseEnv(process.env);
const prisma = createPrismaClient(environment.databaseUrl);
const repository = new PrismaWorkspaceRepository(prisma);
const storage = createSupabaseLogoStorage(environment.supabaseUrl, environment.supabaseSecretKey);
const logoService = new LogoApplicationService(repository, storage);
const workspaceService = new WorkspaceApplicationService(repository, logoService);
const authVerifier = createSupabaseAuthVerifier(environment.supabaseUrl, environment.supabasePublishableKey);

const app = createApp({
  corsOrigin: environment.corsOrigin,
  logLevel: environment.logLevel,
  workspaceService,
  authVerifier,
  logoService,
});

const server = app.listen(environment.port, () => {
  console.info(`Precifique backend disponível em http://localhost:${environment.port}`);
});

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`Encerrando servidor após ${signal}.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exitCode = 0;
  });
}

process.on('SIGINT', () => { void shutdown('SIGINT'); });
process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
