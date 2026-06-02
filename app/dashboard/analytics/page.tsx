import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Container, Shell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });

  if (!profile) {
    redirect("/dashboard");
  }

  const [totalViews, recentViews, topLinks] = await Promise.all([
    prisma.profileView.count({ where: { profileId: profile.id } }),
    prisma.profileView.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.link.findMany({ where: { profileId: profile.id }, orderBy: { clicks: "desc" }, take: 5 })
  ]);

  return (
    <Shell>
      <Container className="py-8">
        <Link href="/dashboard" className="text-sm text-cyan">← Dashboard</Link>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card><p className="text-sm text-slate-400">Total views</p><p className="mt-2 text-4xl font-black">{totalViews}</p></Card>
          <Card><p className="text-sm text-slate-400">Links</p><p className="mt-2 text-4xl font-black">{topLinks.length}</p></Card>
          <Card><p className="text-sm text-slate-400">Public URL</p><p className="mt-2 break-all text-xl font-black">/{profile.username}</p></Card>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-black">Recent views</h2>
            <div className="mt-4 space-y-3">
              {recentViews.map((view) => <div key={view.id} className="rounded-2xl bg-white/10 p-3 text-sm text-slate-300">{view.createdAt.toLocaleString()} • {view.device || "unknown"} • {view.referrer || "direct"}</div>)}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Top links</h2>
            <div className="mt-4 space-y-3">
              {topLinks.map((link) => <div key={link.id} className="flex justify-between rounded-2xl bg-white/10 p-3"><span>{link.title}</span><span>{link.clicks} clicks</span></div>)}
            </div>
          </Card>
        </div>
      </Container>
    </Shell>
  );
}
