import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Container, Shell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [users, profiles, views, apiKeys] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.profileView.count(),
    prisma.apiKey.count()
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { profile: { select: { username: true, displayName: true, isPublic: true } } }
  });

  return (
    <Shell>
      <Container className="py-8">
        <Link href="/dashboard" className="text-sm text-cyan">← Dashboard</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-cyan">Admin</p>
            <h1 className="text-4xl font-black">wee.bio control center</h1>
          </div>
        </div>
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Users', users], ['Profiles', profiles], ['Views', views], ['API keys', apiKeys]].map(([label, value]) => (
            <Card key={label as string}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-4xl font-black">{value}</p></Card>
          ))}
        </section>
        <Card className="mt-6">
          <h2 className="text-2xl font-black">Recent users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="p-3">User</th><th className="p-3">Profile</th><th className="p-3">Role</th><th className="p-3">Joined</th></tr></thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-t border-white/10">
                    <td className="p-3">{user.name || user.email || user.id}</td>
                    <td className="p-3">{user.profile ? <Link className="text-cyan" href={`/${user.profile.username}`}>@{user.profile.username}</Link> : "—"}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </Shell>
  );
}
