import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isProfileUsernameCandidate, toUsernameSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`public:${ip}`, 120, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isProfileUsernameCandidate(params.username)) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const username = toUsernameSlug(params.username);
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      links: { where: { enabled: true }, orderBy: { position: "asc" } },
      badges: { include: { badge: true } },
      user: { select: { name: true, image: true } }
    }
  });

  if (!profile || !profile.isPublic) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}
