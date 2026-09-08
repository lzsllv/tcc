import { AppError } from '../errors/app-error.js';
const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
export class LogoApplicationService {
    repository;
    storage;
    constructor(repository, storage) {
        this.repository = repository;
        this.storage = storage;
    }
    async present(record) {
        const { logoPath, ...publicRecord } = record;
        if (!logoPath)
            return publicRecord;
        const logo = await this.storage.signedUrl(logoPath);
        return { ...publicRecord, workspace: { ...record.workspace, settings: { ...record.workspace.settings, logo } } };
    }
    async upload(ownerId, file, expectedRevision) {
        if (!allowedTypes.has(file.mimeType)) {
            throw new AppError(415, 'UNSUPPORTED_LOGO_TYPE', 'O logo deve ser PNG, JPEG ou WebP.');
        }
        if (file.size > 409_600) {
            throw new AppError(413, 'LOGO_TOO_LARGE', 'O logo deve possuir no máximo 400 KB.');
        }
        const newPath = await this.storage.upload(ownerId, file);
        let changed;
        try {
            changed = await this.repository.setLogo(ownerId, newPath, expectedRevision);
        }
        catch (error) {
            await this.storage.remove(newPath).catch(() => undefined);
            throw error;
        }
        if (changed.previousPath && changed.previousPath !== newPath) {
            await this.storage.remove(changed.previousPath).catch(() => undefined);
        }
        return this.present(changed.record);
    }
    async remove(ownerId, expectedRevision) {
        const { previousPath, record } = await this.repository.clearLogo(ownerId, expectedRevision);
        if (previousPath)
            await this.storage.remove(previousPath).catch(() => undefined);
        return this.present(record);
    }
}
//# sourceMappingURL=logo-service.js.map