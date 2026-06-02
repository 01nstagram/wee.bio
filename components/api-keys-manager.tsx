"use client";

import { useState, useTransition } from "react";

type ApiKeyItem = {
  id: string;
  label: string;
  prefix: string;
  scopes: string;
  lastUsedAt: Date | string | null;
  revokedAt: Date | string | null;
  createdAt: Date | string;
};

export function ApiKeysManager({ initialKeys }: { initialKeys: ApiKeyItem[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [label, setLabel] = useState("Default integration");
  const [token, setToken] = useState("");
  const [pending, startTransition] = useTransition();

  function createKey() {
    startTransition(async () => {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, scopes: ["profile:read", "links:read", "analytics:read"] })
      });
      const body = await response.json();
      if (response.ok) {
        setKeys((current) => [body.apiKey, ...current]);
        setToken(body.token);
      }
    });
  }

  function revokeKey(id: string) {
    startTransition(async () => {
      const response = await fetch("/api/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        setKeys((current) => current.map((key) => key.id === id ? { ...key, revokedAt: new Date().toISOString() } : key));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input className="input max-w-sm" value={label} onChange={(event) => setLabel(event.target.value)} />
        <button className="btn btn-primary" disabled={pending} onClick={createKey}>Create key</button>
      </div>
      {token ? <div className="rounded-2xl border border-cyan/30 bg-cyan/10 p-4 text-sm"><p className="font-bold">Copy this token now. It will only be shown once.</p><code className="mt-2 block break-all text-cyan">{token}</code></div> : null}
      <div className="space-y-3">
        {keys.map((key) => (
          <div key={key.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div><p className="font-black">{key.label}</p><p className="text-sm text-slate-400">{key.prefix} • {key.scopes} {key.revokedAt ? "• revoked" : ""}</p></div>
            {!key.revokedAt ? <button className="btn btn-secondary" onClick={() => revokeKey(key.id)}>Revoke</button> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
