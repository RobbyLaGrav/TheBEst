import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = process.env.EMAIL_FROM || "noreply@mindvault.app";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"MindVault" <${FROM}>`,
    to: email,
    subject: "Verify your MindVault account",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);">
          <h1 style="color: #22c55e; font-size: 28px; margin: 0;">MINDVAULT</h1>
          <p style="color: #888; font-size: 14px; margin-top: 4px;">Your personal command center</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #f0f0f0; font-size: 22px; margin-top: 0;">Verify your email</h2>
          <p style="color: #888; line-height: 1.6;">Click the button below to verify your email address and activate your MindVault account.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #22c55e; color: #000; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; margin: 24px 0; font-size: 16px;">
            Verify Email
          </a>
          <p style="color: #555; font-size: 13px; margin-top: 32px;">If you didn't create a MindVault account, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"MindVault" <${FROM}>`,
    to: email,
    subject: "Reset your MindVault password",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);">
          <h1 style="color: #22c55e; font-size: 28px; margin: 0;">MINDVAULT</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #f0f0f0; font-size: 22px; margin-top: 0;">Reset your password</h2>
          <p style="color: #888; line-height: 1.6;">Click the button below to set a new password for your account. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #22c55e; color: #000; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; margin: 24px 0; font-size: 16px;">
            Reset Password
          </a>
          <p style="color: #555; font-size: 13px; margin-top: 32px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendDailyDigestEmail(
  email: string,
  userName: string,
  data: {
    overdueTasks: { title: string; priority: string; dueDate: string }[];
    todayTasks: { title: string; priority: string }[];
    upcomingTasks: { title: string; priority: string; dueDate: string }[];
    habitsToday: { name: string; completed: boolean }[];
    goalProgress: { title: string; progress: number }[];
  }
) {
  const priorityColor = (p: string) =>
    p === "URGENT" ? "#ef4444" : p === "Important" ? "#eab308" : "#22c55e";

  const taskRow = (t: { title: string; priority: string; dueDate?: string }) => `
    <tr>
      <td style="padding: 8px 12px; color: #f0f0f0; font-size: 14px; border-bottom: 1px solid #222;">${t.title}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #222;">
        <span style="color: ${priorityColor(t.priority)}; font-size: 12px; font-weight: 600;">${t.priority}</span>
      </td>
      ${t.dueDate ? `<td style="padding: 8px 12px; color: #888; font-size: 13px; border-bottom: 1px solid #222;">${t.dueDate}</td>` : ""}
    </tr>
  `;

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  await transporter.sendMail({
    from: `"MindVault" <${FROM}>`,
    to: email,
    subject: `${greeting}, ${userName || "there"} — Your MindVault Daily Digest`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="padding: 32px 40px; background: linear-gradient(135deg, #111 0%, #1a1a1a 100%); border-bottom: 1px solid #222;">
          <h1 style="color: #22c55e; font-size: 24px; margin: 0;">MINDVAULT</h1>
          <p style="color: #888; font-size: 13px; margin-top: 4px;">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        <div style="padding: 32px 40px;">
          <h2 style="color: #f0f0f0; font-size: 20px; margin-top: 0;">${greeting}, ${userName || "there"}</h2>
          <p style="color: #888; font-size: 14px; line-height: 1.5;">Here's your daily overview to keep you on track.</p>

          ${data.overdueTasks.length > 0 ? `
            <div style="margin: 24px 0; padding: 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;">
              <h3 style="color: #ef4444; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Overdue (${data.overdueTasks.length})</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.overdueTasks.map(taskRow).join("")}
              </table>
            </div>
          ` : ""}

          ${data.todayTasks.length > 0 ? `
            <div style="margin: 24px 0; padding: 16px; background: #161616; border: 1px solid #222; border-radius: 12px;">
              <h3 style="color: #22c55e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Due Today (${data.todayTasks.length})</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.todayTasks.map(taskRow).join("")}
              </table>
            </div>
          ` : ""}

          ${data.upcomingTasks.length > 0 ? `
            <div style="margin: 24px 0; padding: 16px; background: #161616; border: 1px solid #222; border-radius: 12px;">
              <h3 style="color: #3b82f6; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Upcoming This Week (${data.upcomingTasks.length})</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${data.upcomingTasks.map(taskRow).join("")}
              </table>
            </div>
          ` : ""}

          ${data.habitsToday.length > 0 ? `
            <div style="margin: 24px 0; padding: 16px; background: #161616; border: 1px solid #222; border-radius: 12px;">
              <h3 style="color: #a855f7; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Today's Habits</h3>
              ${data.habitsToday.map((h) => `
                <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; color: ${h.completed ? "#22c55e" : "#888"}; font-size: 14px;">
                  ${h.completed ? "✅" : "⬜"} ${h.name}
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.goalProgress.length > 0 ? `
            <div style="margin: 24px 0; padding: 16px; background: #161616; border: 1px solid #222; border-radius: 12px;">
              <h3 style="color: #eab308; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Goal Progress</h3>
              ${data.goalProgress.map((g) => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #f0f0f0; font-size: 14px;">${g.title}</span>
                    <span style="color: #888; font-size: 13px;">${g.progress}%</span>
                  </div>
                  <div style="background: #222; border-radius: 4px; height: 6px; overflow: hidden;">
                    <div style="background: #22c55e; height: 100%; width: ${g.progress}%; border-radius: 4px;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          <div style="text-align: center; margin-top: 32px;">
            <a href="${APP_URL}" style="display: inline-block; background: #22c55e; color: #000; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px;">
              Open MindVault
            </a>
          </div>

          <p style="color: #444; font-size: 12px; text-align: center; margin-top: 32px;">
            You're receiving this because you have daily digest enabled.
            <a href="${APP_URL}/settings" style="color: #888;">Manage preferences</a>
          </p>
        </div>
      </div>
    `,
  });
}
