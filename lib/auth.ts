import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/db";
import { toUsernameSlug } from "@/lib/slug";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: "USER" | "ADMIN";
      username?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          select: { username: true }
        });

        session.user.id = user.id;
        session.user.role = user.role;
        session.user.username = profile?.username;
      }

      return session;
    }
  },
  events: {
    async createUser({ user }) {
      const base = toUsernameSlug(user.name || user.email?.split("@")[0] || "user");
      let username = base || `user-${user.id.slice(0, 6)}`;
      let suffix = 1;

      while (await prisma.profile.findUnique({ where: { username } })) {
        username = `${base}-${suffix}`;
        suffix += 1;
      }

      await prisma.profile.create({
        data: {
          userId: user.id,
          username,
          displayName: user.name || username,
          avatarUrl: user.image
        }
      });
    }
  }
};

export function auth() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}
