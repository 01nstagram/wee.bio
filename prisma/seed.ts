import { LinkType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const founder = await prisma.badge.upsert({
    where: { name: "founder" },
    update: {},
    create: {
      name: "founder",
      label: "Founder",
      color: "#8b5cf6",
      description: "Early wee.bio profile"
    }
  });

  const verified = await prisma.badge.upsert({
    where: { name: "verified" },
    update: {},
    create: {
      name: "verified",
      label: "Verified",
      color: "#22d3ee",
      description: "Verified community profile"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@wee.bio" },
    update: {},
    create: {
      email: "demo@wee.bio",
      name: "wee.bio demo",
      role: "ADMIN"
    }
  });

  const profile = await prisma.profile.upsert({
    where: { username: "demo" },
    update: {},
    create: {
      userId: user.id,
      username: "demo",
      displayName: "wee.bio demo",
      bio: "A customizable bio page powered by Discord, APIs and analytics.",
      primaryColor: "#8b5cf6",
      secondaryColor: "#22d3ee",
      textColor: "#ffffff",
      embedTitle: "wee.bio demo",
      embedDescription: "Build your identity page."
    }
  });

  for (const badge of [founder, verified]) {
    await prisma.profileBadge.upsert({
      where: {
        profileId_badgeId: {
          profileId: profile.id,
          badgeId: badge.id
        }
      },
      update: {},
      create: {
        profileId: profile.id,
        badgeId: badge.id
      }
    });
  }

  const links = [
    {
      title: "Discord",
      url: "https://discord.com",
      type: LinkType.DISCORD,
      position: 0
    },
    {
      title: "GitHub",
      url: "https://github.com",
      type: LinkType.GITHUB,
      position: 1
    }
  ];

  for (const link of links) {
    const existing = await prisma.link.findFirst({
      where: {
        profileId: profile.id,
        title: link.title
      }
    });

    if (!existing) {
      await prisma.link.create({
        data: {
          ...link,
          profileId: profile.id
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
