import Link from "next/link";
import { ArrowRight, BarChart3, KeyRound, Palette, Shield, Sparkles, UserRoundCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import { Card, Container, Shell } from "@/components/ui";

const features = [
  { icon: UserRoundCheck, title: "Discord identity", text: "Login and connect your Discord identity to launch a profile fast." },
  { icon: Palette, title: "Custom bios", text: "Tune colors, banners, avatars, backgrounds, badges, links and embeds." },
  { icon: BarChart3, title: "Analytics", text: "Track profile views, referrers, devices and link performance." },
  { icon: KeyRound, title: "Developer API", text: "Generate scoped API keys and automate your profile or links safely." },
  { icon: Shield, title: "Admin ready", text: "Role-based admin surface for moderation and user visibility." },
  { icon: Sparkles, title: "Original style", text: "A polished wee.bio visual system with glass panels and neon accents." }
];

export default function HomePage() {
  return (
    <Shell>
      <Container>
        <Nav />
        <section className="grid min-h-[72vh] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-cyan">
              wee.bio advanced bio pages
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
              Your Discord-powered identity in one unforgettable link.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Create a premium profile page with custom visuals, social links, badges, analytics, API keys and admin-grade controls.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login" className="btn btn-primary">
                Connect Discord <ArrowRight size={18} />
              </Link>
              <Link href="/demo" className="btn btn-secondary">View demo</Link>
            </div>
          </div>
          <Card className="relative overflow-hidden p-4">
            <div className="rounded-[2rem] border border-white/10 bg-ink p-5">
              <div className="h-32 rounded-3xl bg-gradient-to-r from-violet to-cyan" />
              <div className="-mt-12 ml-6 h-24 w-24 rounded-full border-4 border-ink bg-gradient-to-br from-white/40 to-white/10" />
              <div className="mt-5 h-7 w-48 rounded-full bg-white/20" />
              <div className="mt-3 h-4 w-72 rounded-full bg-white/10" />
              <div className="mt-8 space-y-3">
                {["Discord", "Portfolio", "Music"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 font-bold">{item}</div>
                ))}
              </div>
            </div>
          </Card>
        </section>
        <section className="grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="text-cyan" />
              <h2 className="mt-4 text-xl font-black">{feature.title}</h2>
              <p className="mt-2 text-slate-300">{feature.text}</p>
            </Card>
          ))}
        </section>
      </Container>
    </Shell>
  );
}
