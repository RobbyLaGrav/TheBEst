import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession, generateVerifyToken } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = generateVerifyToken();

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        verifyToken,
        settings: { create: {} },
        emailPrefs: { create: {} },
      },
    });

    await createSession(user.id);

    // Send verification email (non-blocking)
    sendVerificationEmail(email, verifyToken).catch(console.error);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, emailVerified: false },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
