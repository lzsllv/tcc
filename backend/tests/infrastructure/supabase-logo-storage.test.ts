import { describe, expect, it } from 'vitest';
import { SupabaseLogoStorage } from '../../src/infrastructure/storage/supabase-logo-storage.js';

class MemoryBucket {
  objects = new Map<string, Buffer>();
  async upload(path: string, data: Buffer) { this.objects.set(path, data); return { data: { path }, error: null }; }
  async remove(paths: string[]) { paths.forEach((path) => this.objects.delete(path)); return { data: paths, error: null }; }
  async createSignedUrl(path: string, expiresIn: number) {
    return { data: { signedUrl: `https://signed.example/${path}?expires=${expiresIn}` }, error: null };
  }
}

describe('SupabaseLogoStorage', () => {
  it('grava objeto imutável no diretório do proprietário', async () => {
    const bucket = new MemoryBucket();
    const storage = new SupabaseLogoStorage({ storage: { from: () => bucket } }, () => 'file-id');

    const path = await storage.upload('owner-1', { buffer: Buffer.from('img'), mimeType: 'image/webp', size: 3 });

    expect(path).toBe('owner-1/file-id.webp');
    expect(bucket.objects.get(path)?.toString()).toBe('img');
    expect(await storage.signedUrl(path)).toBe(`https://signed.example/${path}?expires=300`);
    await storage.remove(path);
    expect(bucket.objects.has(path)).toBe(false);
  });
});
