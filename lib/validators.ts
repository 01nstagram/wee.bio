import { z } from "zod";
import { isReservedUsername, toUsernameSlug } from "@/lib/slug";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const optionalUrl = z.string().url().max(1024).optional().or(z.literal(""));

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .transform(toUsernameSlug)
    .refine((value) => value.length >= 3, "Username must be at least 3 characters")
    .refine((value) => !isReservedUsername(value), "Username is reserved"),
  displayName: z.string().min(1).max(80),
  bio: z.string().max(600).optional().or(z.literal("")),
  avatarUrl: optionalUrl,
  bannerUrl: optionalUrl,
  backgroundUrl: optionalUrl,
  primaryColor: hexColor,
  secondaryColor: hexColor,
  textColor: hexColor,
  accentStyle: z.enum(["glass", "solid", "outline", "minimal"]),
  musicUrl: optionalUrl,
  embedTitle: z.string().max(120).optional().or(z.literal("")),
  embedDescription: z.string().max(240).optional().or(z.literal("")),
  isPublic: z.boolean(),
  showDiscord: z.boolean()
});

export const linkCreateSchema = z.object({
  title: z.string().min(1).max(80),
  url: z.string().url().max(1024),
  type: z
    .enum(["WEBSITE", "DISCORD", "GITHUB", "INSTAGRAM", "TWITTER", "YOUTUBE", "TWITCH", "TIKTOK", "SPOTIFY", "EMAIL", "CUSTOM"])
    .default("CUSTOM"),
  icon: z.string().max(80).optional().or(z.literal("")),
  position: z.number().int().min(0).max(1000).default(0),
  enabled: z.boolean().default(true)
});

export const linkUpdateSchema = linkCreateSchema.partial();

export const viewCreateSchema = z.object({
  username: z.string().min(3).max(32).transform(toUsernameSlug),
  referrer: z.string().max(512).optional().or(z.literal("")),
  device: z.string().max(80).optional().or(z.literal(""))
});

export const apiKeyCreateSchema = z.object({
  label: z.string().min(1).max(80),
  scopes: z.array(z.enum(["profile:read", "profile:write", "links:read", "links:write", "analytics:read"])).min(1).max(5)
});
