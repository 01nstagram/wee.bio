import Link from "next/link";
import { redirect } from "next/navigation";
import { LinksManager } from "@/components/links-manager";
import { Card, Container, Shell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function LinksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { links: { orderBy: { position: "asc" } } }
  });

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <Shell>
      <Container className="py-8">
        <Link href="/dashboard" className="text-sm text-cyan">← Dashboard</Link>
        <Card className="mt-6">
          <h1 className="text-3xl font-black">Links and socials</h1>
          <p className="mt-2 text-slate-300">Add your socials, websites, music and custom buttons.</p>
          <div className="mt-6"><LinksManager initialLinks={profile.links} /></div>
        </Card>
      </Container>
    </Shell>
  );
}
