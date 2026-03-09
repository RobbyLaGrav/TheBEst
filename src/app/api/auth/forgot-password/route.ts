import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateVerifyToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a reset email has been sent" });
    }

    const resetToken = generateVerifyToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires },
    });

    sendPasswordResetEmail(email, resetToken).catch(console.error);

    return NextResponse.json({ success: true, message: "If an account exists, a reset email has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
