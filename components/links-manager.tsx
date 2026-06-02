"use client";

import { useState, useTransition } from "react";
import type { Link } from "@prisma/client";

export function LinksManager({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [form, setForm] = useState({ title: "", url: "", type: "CUSTOM", position: initialLinks.length, enabled: true });
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function createLink() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const body = await response.json();
      if (response.ok) {
        setLinks((current) => [...current, body.link]);
        setForm({ title: "", url: "", type: "CUSTOM", position: links.length + 1, enabled: true });
      }
      setMessage(response.ok ? "Link created." : body.error || "Could not create link.");
    });
  }

  function deleteLink(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLinks((current) => current.filter((link) => link.id !== id));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_1.3fr_0.8fr_auto]">
        <input className="input" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <input className="input" placeholder="https://..." value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
        <select className="input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
          {['CUSTOM','WEBSITE','DISCORD','GITHUB','INSTAGRAM','TWITTER','YOUTUBE','TWITCH','TIKTOK','SPOTIFY','EMAIL'].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <button className="btn btn-primary" disabled={pending} onClick={createLink}>Add</button>
      </div>
      {message ? <p className="text-sm text-cyan">{message}</p> : null}
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div>
              <p className="font-black">{link.title}</p>
              <p className="text-sm text-slate-400">{link.url}</p>
            </div>
            <button className="btn btn-secondary" disabled={pending} onClick={() => deleteLink(link.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
