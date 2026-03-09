import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
    });

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
