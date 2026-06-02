import { ExternalLink } from "lucide-react";
import { BadgePill } from "@/components/ui";

type PublicProfile = {
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  backgroundUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentStyle: string;
  showDiscord: boolean;
  links: Array<{ id: string; title: string; url: string; type: string }>;
  badges: Array<{ badge: { label: string; color: string } }>;
};

export function ProfileCard({ profile }: { profile: PublicProfile }) {
  return (
    <div
      className="relative mx-auto min-h-[680px] w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/15 p-6 shadow-glow"
      style={{
        color: profile.textColor,
        background: profile.backgroundUrl
          ? `linear-gradient(rgba(5,5,17,0.72), rgba(5,5,17,0.84)), url(${profile.backgroundUrl}) center/cover`
          : `radial-gradient(circle at top, ${profile.primaryColor}55, transparent 20rem), linear-gradient(145deg, #080816, #111129)`
      }}
    >
      <div className="absolute inset-x-0 top-0 h-36 opacity-80" style={{ background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})` }} />
      <div className="relative pt-20 text-center">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white/25 bg-white/10">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-black">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-black">{profile.displayName}</h1>
        <p className="mt-1 text-sm text-white/65">@{profile.username}</p>
        {profile.bio ? <p className="mx-auto mt-4 max-w-sm text-white/80">{profile.bio}</p> : null}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {profile.badges.map(({ badge }) => <BadgePill key={badge.label} color={badge.color}>{badge.label}</BadgePill>)}
          {profile.showDiscord ? <BadgePill color="#5865f2">Discord</BadgePill> : null}
        </div>
      </div>
      <div className="relative mt-8 space-y-3">
        {profile.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/10 px-5 py-4 font-bold transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <span>{link.title}</span>
            <ExternalLink size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}
