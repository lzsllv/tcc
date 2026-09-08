import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { AppError } from '../../errors/app-error.js';
const extensions = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};
export class SupabaseLogoStorage {
    client;
    createId;
    constructor(client, createId = randomUUID) {
        this.client = client;
        this.createId = createId;
    }
    bucket() { return this.client.storage.from('business-logos'); }
    async upload(ownerId, file) {
        const extension = extensions[file.mimeType];
        if (!extension)
            throw new AppError(415, 'UNSUPPORTED_LOGO_TYPE', 'Formato de logo não suportado.');
        const path = `${ownerId}/${this.createId()}.${extension}`;
        const { error } = await this.bucket().upload(path, file.buffer, { contentType: file.mimeType, upsert: false });
        if (error)
            throw new AppError(500, 'STORAGE_UPLOAD_FAILED', 'Não foi possível armazenar o logo.');
        return path;
    }
    async remove(path) {
        const { error } = await this.bucket().remove([path]);
        if (error)
            throw new AppError(500, 'STORAGE_DELETE_FAILED', 'Não foi possível remover o logo.');
    }
    async signedUrl(path) {
        const { data, error } = await this.bucket().createSignedUrl(path, 300);
        if (error || !data?.signedUrl)
            throw new AppError(500, 'STORAGE_SIGN_FAILED', 'Não foi possível acessar o logo.');
        return data.signedUrl;
    }
}
export function createSupabaseLogoStorage(url, secretKey) {
    const client = createClient(url, secretKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return new SupabaseLogoStorage(client);
}
//# sourceMappingURL=supabase-logo-storage.js.map