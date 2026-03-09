import { NextResponse } from "next/server";
import { getSessionUser } from "./auth";

export async function withAuth(handler: (userId: string) => Promise<NextResponse>) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(user.id);
}
