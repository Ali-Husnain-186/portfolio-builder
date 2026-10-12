import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FolioLink — Free Portfolio Builder", template: "%s · FolioLink" },
  description: "Build a beautiful portfolio in minutes. Pick a template, change colors and fonts, and share your link. Free forever.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
