import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { settingsSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const settings = await prisma.userSettings.findUnique({ where: { userId } });
    return NextResponse.json(settings);
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: parsed.data,
      create: { userId, ...parsed.data },
    });
    return NextResponse.json(settings);
  });
}
