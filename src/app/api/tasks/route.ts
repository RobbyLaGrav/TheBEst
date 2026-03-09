import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { taskSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const tasks = await prisma.task.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(tasks);
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const task = await prisma.task.create({ data: { ...parsed.data, userId } });
    return NextResponse.json(task, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (updates.completed === true && !updates.completedAt) {
      updates.completedAt = new Date();
    }
    if (updates.completed === false) {
      updates.completedAt = null;
    }
    const task = await prisma.task.update({ where: { id, userId }, data: updates });
    return NextResponse.json(task);
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.task.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
