import type { LogoStorage, UploadedLogo } from '../../application/logo-service.js';
interface BucketClient {
    upload(path: string, data: Buffer, options: {
        contentType: string;
        upsert: false;
    }): Promise<{
        error: unknown;
    }>;
    remove(paths: string[]): Promise<{
        error: unknown;
    }>;
    createSignedUrl(path: string, expiresIn: number): Promise<{
        data: {
            signedUrl: string;
        } | null;
        error: unknown;
    }>;
}
interface StorageClient {
    storage: {
        from(bucket: string): BucketClient;
    };
}
export declare class SupabaseLogoStorage implements LogoStorage {
    private readonly client;
    private readonly createId;
    constructor(client: StorageClient, createId?: () => string);
    private bucket;
    upload(ownerId: string, file: UploadedLogo): Promise<string>;
    remove(path: string): Promise<void>;
    signedUrl(path: string): Promise<string>;
}
export declare function createSupabaseLogoStorage(url: string, secretKey: string): SupabaseLogoStorage;
export {};
