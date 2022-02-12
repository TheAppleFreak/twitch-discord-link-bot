import { PrismaClient } from "@prisma/client";

/**
 * This utility creates and stores a singleton of PrismaClient so all services used can share the same in-process connection pool.
 */
export default class GlobalPrisma {
    private static instances: {
        [key: string]: PrismaClient;
    };
    public id: string;

    constructor(id: string = "default") {
        this.id = id;

        if (GlobalPrisma.instances === undefined) {
            GlobalPrisma.instances = {};
        }

        try {
            this.instance;
        } catch (err) {
            GlobalPrisma.instances[this.id] = new PrismaClient();
        }
    }

    get instance(): PrismaClient {
        return GlobalPrisma.instances[this.id];
    }
}
