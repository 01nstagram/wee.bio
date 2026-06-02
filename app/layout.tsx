import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "wee.bio — your identity in one link",
  description: "Create a customizable Discord-connected bio page with analytics, APIs and advanced profile controls.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
