import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Nav() {
  const session = await auth();

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between py-4">
      <Link href="/" className="text-2xl font-black tracking-tight">
        wee<span className="text-cyan">.</span>bio
      </Link>
      <nav className="flex items-center gap-3 text-sm text-slate-300">
        <Link href="/demo" className="hidden hover:text-white sm:block">Demo</Link>
        {session?.user ? (
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
        ) : (
          <Link href="/login" className="btn btn-primary">Connect Discord</Link>
        )}
      </nav>
    </header>
  );
}
