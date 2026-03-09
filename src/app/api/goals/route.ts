import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { goalSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(goals.map((g: any) => ({ ...g, milestones: JSON.parse(g.milestones) })));
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = goalSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const goal = await prisma.goal.create({
      data: { ...parsed.data, milestones: JSON.stringify(parsed.data.milestones), userId },
    });
    return NextResponse.json({ ...goal, milestones: JSON.parse(goal.milestones) }, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (updates.milestones) updates.milestones = JSON.stringify(updates.milestones);
    const goal = await prisma.goal.update({ where: { id, userId }, data: updates });
    return NextResponse.json({ ...goal, milestones: JSON.parse(goal.milestones) });
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.goal.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
