import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { businessIdeaSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const ideas = await prisma.businessIdea.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json(ideas.map((b: any) => ({ ...b, nextSteps: JSON.parse(b.nextSteps) })));
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = businessIdeaSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const idea = await prisma.businessIdea.create({
      data: { ...parsed.data, nextSteps: JSON.stringify(parsed.data.nextSteps), userId },
    });
    return NextResponse.json({ ...idea, nextSteps: JSON.parse(idea.nextSteps) }, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (updates.nextSteps) updates.nextSteps = JSON.stringify(updates.nextSteps);
    const idea = await prisma.businessIdea.update({ where: { id, userId }, data: updates });
    return NextResponse.json({ ...idea, nextSteps: JSON.parse(idea.nextSteps) });
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.businessIdea.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
