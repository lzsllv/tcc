import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('compiled Prisma client', () => {
  it('can be imported by Node after the production TypeScript build', () => {
    execFileSync(
      process.execPath,
      [resolve(backendRoot, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.build.json'],
      { cwd: backendRoot, stdio: 'pipe' },
    );

    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '--eval', "import('./dist/generated/prisma/client.js')"],
      { cwd: backendRoot, encoding: 'utf8' },
    );

    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  }, 15_000);
});
