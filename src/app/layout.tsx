import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "MINDVAULT — Your Personal Command Center",
  description: "The productivity platform that rivals Asana. Task management, goal tracking, habit building, idea capture, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
