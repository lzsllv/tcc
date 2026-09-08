import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
export function createPrismaClient(databaseUrl) {
    const adapter = new PrismaPg({ connectionString: databaseUrl, max: 10 });
    return new PrismaClient({ adapter });
}
//# sourceMappingURL=client.js.map