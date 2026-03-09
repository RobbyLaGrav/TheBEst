import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { ideaSchema } from "@/lib/validations";

export async function GET() {
  return withAuth(async (userId) => {
    const ideas = await prisma.idea.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json(ideas);
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = ideaSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const idea = await prisma.idea.create({ data: { ...parsed.data, userId } });
    return NextResponse.json(idea, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const idea = await prisma.idea.update({ where: { id, userId }, data: updates });
    return NextResponse.json(idea);
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.idea.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
