import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiKeysManager } from "@/components/api-keys-manager";
import { Card, Container, Shell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ApiKeysPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, label: true, prefix: true, scopes: true, lastUsedAt: true, revokedAt: true, createdAt: true }
  });

  return (
    <Shell>
      <Container className="py-8">
        <Link href="/dashboard" className="text-sm text-cyan">← Dashboard</Link>
        <Card className="mt-6">
          <h1 className="text-3xl font-black">API keys</h1>
          <p className="mt-2 text-slate-300">Create scoped tokens for integrations. Tokens are hashed before storage.</p>
          <div className="mt-6"><ApiKeysManager initialKeys={apiKeys} /></div>
        </Card>
      </Container>
    </Shell>
  );
}
