import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  return withAuth(async (userId) => {
    const notes = await prisma.vaultNote.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json(notes);
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const { title, content } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
    const note = await prisma.vaultNote.create({ data: { title, content: content || "", userId } });
    return NextResponse.json(note, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const note = await prisma.vaultNote.update({ where: { id, userId }, data: updates });
    return NextResponse.json(note);
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.vaultNote.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
