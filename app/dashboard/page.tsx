import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, KeyRound, Link as LinkIcon, Palette, Shield } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, Container, Shell } from "@/components/ui";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { _count: { select: { links: true, views: true } } }
  });

  const cards = [
    { href: "/dashboard/profile", icon: Palette, title: "Profile editor", text: "Customize username, visuals, embed and public settings." },
    { href: "/dashboard/links", icon: LinkIcon, title: "Links", text: "Manage socials, buttons, ordering and visibility." },
    { href: "/dashboard/analytics", icon: BarChart3, title: "Analytics", text: `${profile?._count.views ?? 0} views tracked.` },
    { href: "/dashboard/api-keys", icon: KeyRound, title: "API keys", text: "Create scoped keys for integrations." }
  ];

  return (
    <Shell>
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-cyan">Dashboard</p>
            <h1 className="text-4xl font-black">Welcome, {session.user.name}</h1>
          </div>
          <div className="flex gap-3">
            {profile ? <Link href={`/${profile.username}`} className="btn btn-secondary">View public page</Link> : null}
            {session.user.role === "ADMIN" ? <Link href="/admin" className="btn btn-secondary"><Shield size={18} /> Admin</Link> : null}
          </div>
        </div>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition hover:-translate-y-1 hover:border-cyan/40">
                <item.icon className="text-cyan" />
                <h2 className="mt-4 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </Card>
            </Link>
          ))}
        </section>
        <Card className="mt-8">
          <h2 className="text-2xl font-black">Profile summary</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-400">Username</p><p className="text-xl font-black">@{profile?.username ?? "not-created"}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-400">Links</p><p className="text-xl font-black">{profile?._count.links ?? 0}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><p className="text-sm text-slate-400">Views</p><p className="text-xl font-black">{profile?._count.views ?? 0}</p></div>
          </div>
        </Card>
      </Container>
    </Shell>
  );
}
