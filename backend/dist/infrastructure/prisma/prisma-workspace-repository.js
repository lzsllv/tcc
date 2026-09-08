import { WorkspaceConflictError, WorkspaceNotFoundError } from '../../errors/app-error.js';
import { fromWorkspaceGraph, toWorkspaceRows } from './workspace-mapper.js';
const aggregateInclude = {
    settings: true,
    fixedCosts: true,
    fixedCostExtras: { orderBy: { position: 'asc' } },
    ingredients: true,
    offers: { include: { components: { orderBy: { position: 'asc' } } } },
    salesChannels: { include: { fees: { orderBy: { position: 'asc' } } } },
};
async function loadGraph(client, ownerId) {
    return client.workspace.findUnique({ where: { ownerId }, include: aggregateInclude });
}
async function writeAggregate(client, workspace, logoPath) {
    const rows = toWorkspaceRows(workspace);
    await client.salesChannel.createMany({ data: rows.channels });
    await client.businessSettings.create({ data: { ...rows.settings, logoPath } });
    await client.fixedCosts.create({ data: rows.fixedCosts });
    if (rows.extras.length)
        await client.fixedCostExtra.createMany({ data: rows.extras });
    if (rows.ingredients.length)
        await client.ingredient.createMany({ data: rows.ingredients });
    if (rows.offers.length)
        await client.offer.createMany({ data: rows.offers });
    if (rows.components.length)
        await client.offerComponent.createMany({ data: rows.components });
    if (rows.fees.length)
        await client.channelFee.createMany({ data: rows.fees });
}
function toRecord(graph) {
    return fromWorkspaceGraph(graph);
}
export class PrismaWorkspaceRepository {
    prisma;
    constructor(client) {
        this.prisma = client;
    }
    async load(ownerId) {
        const graph = await loadGraph(this.prisma, ownerId);
        return graph ? toRecord(graph) : null;
    }
    async bootstrap(ownerId, workspace) {
        const existing = await this.load(ownerId);
        if (existing)
            return { record: existing, created: false };
        try {
            const graph = await this.prisma.$transaction(async (transaction) => {
                await transaction.workspace.create({
                    data: {
                        ownerId,
                        schemaVersion: 2,
                        revision: 1n,
                        updatedAt: new Date(workspace.updatedAt),
                    },
                });
                await writeAggregate(transaction, workspace, null);
                return loadGraph(transaction, ownerId);
            });
            if (!graph)
                throw new WorkspaceNotFoundError();
            return { record: toRecord(graph), created: true };
        }
        catch (error) {
            if (error.code === 'P2002') {
                const record = await this.load(ownerId);
                if (record)
                    return { record, created: false };
            }
            throw error;
        }
    }
    async replace(ownerId, workspace, expectedRevision) {
        const graph = await this.prisma.$transaction(async (transaction) => {
            const update = await transaction.workspace.updateMany({
                where: { ownerId, revision: BigInt(expectedRevision) },
                data: { revision: { increment: 1 }, updatedAt: new Date() },
            });
            if (update.count === 0) {
                const exists = await transaction.workspace.findUnique({ where: { ownerId }, select: { ownerId: true } });
                if (!exists)
                    throw new WorkspaceNotFoundError();
                throw new WorkspaceConflictError();
            }
            const previousSettings = await transaction.businessSettings.findUnique({ where: { workspaceId: ownerId } });
            await transaction.businessSettings.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.offerComponent.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.channelFee.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.fixedCostExtra.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.offer.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.ingredient.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.salesChannel.deleteMany({ where: { workspaceId: ownerId } });
            await transaction.fixedCosts.deleteMany({ where: { workspaceId: ownerId } });
            await writeAggregate(transaction, workspace, previousSettings?.logoPath ?? null);
            return loadGraph(transaction, ownerId);
        });
        if (!graph)
            throw new WorkspaceNotFoundError();
        return toRecord(graph);
    }
    async setLogo(ownerId, path, expectedRevision) {
        return this.updateLogo(ownerId, path, expectedRevision);
    }
    async clearLogo(ownerId, expectedRevision) {
        return this.updateLogo(ownerId, null, expectedRevision);
    }
    async updateLogo(ownerId, path, expectedRevision) {
        return this.prisma.$transaction(async (transaction) => {
            const update = await transaction.workspace.updateMany({
                where: { ownerId, revision: BigInt(expectedRevision) },
                data: { revision: { increment: 1 }, updatedAt: new Date() },
            });
            if (update.count === 0) {
                const exists = await transaction.workspace.findUnique({ where: { ownerId }, select: { ownerId: true } });
                if (!exists)
                    throw new WorkspaceNotFoundError();
                throw new WorkspaceConflictError();
            }
            const settings = await transaction.businessSettings.findUniqueOrThrow({ where: { workspaceId: ownerId } });
            await transaction.businessSettings.update({ where: { workspaceId: ownerId }, data: { logoPath: path } });
            const graph = await loadGraph(transaction, ownerId);
            if (!graph)
                throw new WorkspaceNotFoundError();
            return { previousPath: settings.logoPath, record: toRecord(graph) };
        });
    }
}
//# sourceMappingURL=prisma-workspace-repository.js.map