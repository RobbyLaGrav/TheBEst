import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/api-helpers";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(req: Request) {
  return withAuth(async (userId) => {
    const { name, email, currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updates: Record<string, unknown> = {};

    if (name !== undefined) updates.name = name;

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      updates.email = email.toLowerCase();
      updates.emailVerified = false;
    }

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: "Current password required" }, { status: 400 });
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      updates.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: updates });
    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      emailVerified: updated.emailVerified,
    });
  });
}
