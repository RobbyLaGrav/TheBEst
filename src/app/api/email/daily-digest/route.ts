import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDailyDigestEmail } from "@/lib/email";

// This endpoint can be called by a cron job (e.g., Vercel Cron)
export async function POST(req: Request) {
  try {
    // Simple API key check for cron security
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        emailVerified: true,
        emailPrefs: { dailyDigest: true },
      },
      include: {
        emailPrefs: true,
        tasks: true,
        habits: true,
        goals: true,
      },
    });

    const today = new Date().toISOString().split("T")[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    let sent = 0;

    for (const user of users) {
      const overdueTasks = user.tasks
        .filter((t) => !t.completed && t.dueDate && t.dueDate < today)
        .map((t) => ({ title: t.title, priority: t.priority, dueDate: t.dueDate! }));

      const todayTasks = user.tasks
        .filter((t) => !t.completed && t.dueDate === today)
        .map((t) => ({ title: t.title, priority: t.priority }));

      const upcomingTasks = user.tasks
        .filter((t) => !t.completed && t.dueDate && t.dueDate > today && t.dueDate <= weekFromNow)
        .map((t) => ({ title: t.title, priority: t.priority, dueDate: t.dueDate! }));

      const habitsToday = user.habits.map((h) => {
        const completedDates: string[] = JSON.parse(h.completedDates);
        return { name: h.name, completed: completedDates.includes(today) };
      });

      const goalProgress = user.goals.map((g) => ({
        title: g.title,
        progress: g.progress,
      }));

      // Only send if there's something to report
      if (overdueTasks.length || todayTasks.length || upcomingTasks.length || habitsToday.length || goalProgress.length) {
        try {
          await sendDailyDigestEmail(user.email, user.name, {
            overdueTasks,
            todayTasks,
            upcomingTasks,
            habitsToday,
            goalProgress,
          });
          sent++;
        } catch (err) {
          console.error(`Failed to send digest to ${user.email}:`, err);
        }
      }
    }

    return NextResponse.json({ success: true, sent, total: users.length });
  } catch (error) {
    console.error("Daily digest error:", error);
    return NextResponse.json({ error: "Failed to send digests" }, { status: 500 });
  }
}
