"use client";

import { useState, useTransition } from "react";
import type { Profile } from "@prisma/client";

type EditableProfile = Pick<
  Profile,
  | "username"
  | "displayName"
  | "bio"
  | "avatarUrl"
  | "bannerUrl"
  | "backgroundUrl"
  | "primaryColor"
  | "secondaryColor"
  | "textColor"
  | "accentStyle"
  | "musicUrl"
  | "embedTitle"
  | "embedDescription"
  | "isPublic"
  | "showDiscord"
>;

export function ProfileForm({ profile }: { profile: EditableProfile }) {
  const [form, setForm] = useState({
    ...profile,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    bannerUrl: profile.bannerUrl ?? "",
    backgroundUrl: profile.backgroundUrl ?? "",
    musicUrl: profile.musicUrl ?? "",
    embedTitle: profile.embedTitle ?? "",
    embedDescription: profile.embedDescription ?? ""
  });
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const body = await response.json();
      setMessage(response.ok ? "Profile saved." : body.error || "Could not save profile.");
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">Username<input className="input" value={form.username} onChange={(event) => update("username", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Display name<input className="input" value={form.displayName} onChange={(event) => update("displayName", event.target.value)} /></label>
      </div>
      <label className="space-y-2 text-sm text-slate-300">Bio<textarea className="input min-h-28" value={form.bio} onChange={(event) => update("bio", event.target.value)} /></label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-300">Avatar URL<input className="input" value={form.avatarUrl} onChange={(event) => update("avatarUrl", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Banner URL<input className="input" value={form.bannerUrl} onChange={(event) => update("bannerUrl", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Background URL<input className="input" value={form.backgroundUrl} onChange={(event) => update("backgroundUrl", event.target.value)} /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="space-y-2 text-sm text-slate-300">Primary<input className="input h-12" type="color" value={form.primaryColor} onChange={(event) => update("primaryColor", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Secondary<input className="input h-12" type="color" value={form.secondaryColor} onChange={(event) => update("secondaryColor", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Text<input className="input h-12" type="color" value={form.textColor} onChange={(event) => update("textColor", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Style<select className="input" value={form.accentStyle} onChange={(event) => update("accentStyle", event.target.value)}><option value="glass">Glass</option><option value="solid">Solid</option><option value="outline">Outline</option><option value="minimal">Minimal</option></select></label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-300">Music/embed URL<input className="input" value={form.musicUrl} onChange={(event) => update("musicUrl", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Embed title<input className="input" value={form.embedTitle} onChange={(event) => update("embedTitle", event.target.value)} /></label>
        <label className="space-y-2 text-sm text-slate-300">Embed description<input className="input" value={form.embedDescription} onChange={(event) => update("embedDescription", event.target.value)} /></label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublic} onChange={(event) => update("isPublic", event.target.checked)} /> Public profile</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.showDiscord} onChange={(event) => update("showDiscord", event.target.checked)} /> Show Discord badge</label>
      </div>
      <button className="btn btn-primary" disabled={pending} onClick={save}>{pending ? "Saving..." : "Save profile"}</button>
      {message ? <p className="text-sm text-cyan">{message}</p> : null}
    </div>
  );
}
