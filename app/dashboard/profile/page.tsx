import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { ProfileCard } from "@/components/profile-card";
import { Card, Container, Shell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfileEditorPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { where: { enabled: true }, orderBy: { position: "asc" } },
      badges: { include: { badge: true } }
    }
  });

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <Shell>
      <Container className="py-8">
        <Link href="/dashboard" className="text-sm text-cyan">← Dashboard</Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card>
            <h1 className="text-3xl font-black">Profile editor</h1>
            <p className="mt-2 text-slate-300">Configure your public wee.bio identity, theme and embed fields.</p>
            <div className="mt-6"><ProfileForm profile={profile} /></div>
          </Card>
          <ProfileCard profile={profile} />
        </div>
      </Container>
    </Shell>
  );
}
