import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { noteSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(notes.map((n: any) => ({ ...n, tags: JSON.parse(n.tags) })));
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const note = await prisma.note.create({
      data: { ...parsed.data, tags: JSON.stringify(parsed.data.tags), userId },
    });
    return NextResponse.json({ ...note, tags: JSON.parse(note.tags) }, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (updates.tags) updates.tags = JSON.stringify(updates.tags);
    const note = await prisma.note.update({ where: { id, userId }, data: updates });
    return NextResponse.json({ ...note, tags: JSON.parse(note.tags) });
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.note.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
