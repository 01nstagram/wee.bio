import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          username: true,
          displayName: true,
          isPublic: true,
          _count: { select: { links: true, views: true } }
        }
      },
      _count: { select: { apiKeys: true } }
    }
  });

  return NextResponse.json({ users });
}
