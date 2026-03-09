// eslint-disable-next-line @typescript-eslint/no-require-imports
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

// @ts-expect-error Prisma 7 typing quirk with constructor
export const prisma: InstanceType<typeof PrismaClient> = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
