import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

function getMetadataBase() {
  const configuredUrl = process.env.NEXTAUTH_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const fallbackUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";

  try {
    return new URL(configuredUrl || fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export const metadata: Metadata = {
  title: "wee.bio — your identity in one link",
  description: "Create a customizable Discord-connected bio page with analytics, APIs and advanced profile controls.",
  metadataBase: getMetadataBase()
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
