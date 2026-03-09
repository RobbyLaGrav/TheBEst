import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { habitSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const habits = await prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(habits.map((h: any) => ({ ...h, completedDates: JSON.parse(h.completedDates) })));
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = habitSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const habit = await prisma.habit.create({ data: { ...parsed.data, userId } });
    return NextResponse.json({ ...habit, completedDates: JSON.parse(habit.completedDates) }, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (updates.completedDates) updates.completedDates = JSON.stringify(updates.completedDates);
    const habit = await prisma.habit.update({ where: { id, userId }, data: updates });
    return NextResponse.json({ ...habit, completedDates: JSON.parse(habit.completedDates) });
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.habit.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
