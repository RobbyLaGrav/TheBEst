import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

export const prisma: InstanceType<typeof PrismaClient> = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
