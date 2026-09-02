import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { LogoStorage, UploadedLogo } from '../../application/logo-service.js';
import { AppError } from '../../errors/app-error.js';

interface BucketClient {
  upload(path: string, data: Buffer, options: { contentType: string; upsert: false }): Promise<{ error: unknown }>;
  remove(paths: string[]): Promise<{ error: unknown }>;
  createSignedUrl(path: string, expiresIn: number): Promise<{ data: { signedUrl: string } | null; error: unknown }>;
}

interface StorageClient {
  storage: { from(bucket: string): BucketClient };
}

const extensions: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export class SupabaseLogoStorage implements LogoStorage {
  constructor(
    private readonly client: StorageClient,
    private readonly createId: () => string = randomUUID,
  ) {}

  private bucket() { return this.client.storage.from('business-logos'); }

  async upload(ownerId: string, file: UploadedLogo): Promise<string> {
    const extension = extensions[file.mimeType];
    if (!extension) throw new AppError(415, 'UNSUPPORTED_LOGO_TYPE', 'Formato de logo não suportado.');
    const path = `${ownerId}/${this.createId()}.${extension}`;
    const { error } = await this.bucket().upload(path, file.buffer, { contentType: file.mimeType, upsert: false });
    if (error) throw new AppError(500, 'STORAGE_UPLOAD_FAILED', 'Não foi possível armazenar o logo.');
    return path;
  }

  async remove(path: string): Promise<void> {
    const { error } = await this.bucket().remove([path]);
    if (error) throw new AppError(500, 'STORAGE_DELETE_FAILED', 'Não foi possível remover o logo.');
  }

  async signedUrl(path: string): Promise<string> {
    const { data, error } = await this.bucket().createSignedUrl(path, 300);
    if (error || !data?.signedUrl) throw new AppError(500, 'STORAGE_SIGN_FAILED', 'Não foi possível acessar o logo.');
    return data.signedUrl;
  }
}

export function createSupabaseLogoStorage(url: string, secretKey: string) {
  const client = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return new SupabaseLogoStorage(client);
}
