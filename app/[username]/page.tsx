import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/profile-card";
import { Shell } from "@/components/ui";
import { prisma } from "@/lib/db";
import { isProfileUsernameCandidate, toUsernameSlug } from "@/lib/slug";

export async function generateMetadata({ params }: { params: { username: string } }) {
  if (!isProfileUsernameCandidate(params.username)) {
    return { title: "Profile not found — wee.bio" };
  }

  const username = toUsernameSlug(params.username);
  const profile = await prisma.profile.findUnique({ where: { username } });

  if (!profile || !profile.isPublic) {
    return { title: "Profile not found — wee.bio" };
  }

  return {
    title: `${profile.displayName} — wee.bio`,
    description: profile.embedDescription || profile.bio || `${profile.displayName}'s wee.bio profile`,
    openGraph: {
      title: profile.embedTitle || `${profile.displayName} — wee.bio`,
      description: profile.embedDescription || profile.bio || "wee.bio profile",
      images: profile.avatarUrl ? [profile.avatarUrl] : []
    }
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  if (!isProfileUsernameCandidate(params.username)) {
    notFound();
  }

  const username = toUsernameSlug(params.username);
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      links: { where: { enabled: true }, orderBy: { position: "asc" } },
      badges: { include: { badge: true } }
    }
  });

  if (!profile || !profile.isPublic) {
    notFound();
  }

  return (
    <Shell className="flex items-center justify-center py-10">
      <ProfileCard profile={profile} />
      <script
        dangerouslySetInnerHTML={{
          __html: `fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: ${JSON.stringify(username)}, referrer: document.referrer, device: navigator.userAgent }) }).catch(() => {});`
        }}
      />
    </Shell>
  );
}
