import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";

export async function GET() {
  return withAuth(async (userId) => {
    const items = await prisma.inboxItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  });
}

export async function POST(req: Request) {
  return withAuth(async (userId) => {
    const { content, type } = await req.json();
    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
    const item = await prisma.inboxItem.create({ data: { content, type: type || "text", userId } });
    return NextResponse.json(item, { status: 201 });
  });
}

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const item = await prisma.inboxItem.update({ where: { id, userId }, data: updates });
    return NextResponse.json(item);
  });
}

export async function DELETE(req: Request) {
  return withAuth(async (userId) => {
    const { id } = await req.json();
    await prisma.inboxItem.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  });
}
