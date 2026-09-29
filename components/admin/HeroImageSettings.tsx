"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = { heroImageUrl: string | null; heroImageAlt: string };
const fallbackAlt = "Mumbai profile directory preview";

export function HeroImageSettings() {
  const [authorized, setAuthorized] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState(fallbackAlt);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetch("/api/admin/site-settings").then(async (response) => {
      if (!response.ok) return;
      const body = await response.json(); const settings = body.settings as Settings;
      setAuthorized(true); setUrl(settings.heroImageUrl ?? ""); setAlt(settings.heroImageAlt ?? fallbackAlt);
    }).catch(() => {});
  }, []);
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const response = await fetch("/api/admin/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heroImageUrl: url, heroImageAlt: alt }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setMessage(result.error ?? "Unable to save image settings"); return; }
    setMessage("Hero image saved.");
  }
  if (!authorized) return null;
  return <section className="mx-auto mt-6 max-w-7xl px-3 sm:px-5" aria-labelledby="hero-image-heading">
    <form onSubmit={save} className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div className="sm:col-span-3"><h2 id="hero-image-heading" className="text-lg font-bold text-[var(--color-ink)]">Homepage hero image</h2><p className="text-[12px] text-[var(--color-ink-muted)]">Set an HTTPS image URL for the large artwork beside the homepage headline. Leave blank to use the gradient artwork.</p></div>
      <label className="grid gap-1 text-[12px] font-semibold text-[var(--color-ink-muted)]">Image URL<input type="url" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://images.example.com/hero.jpg" className="min-h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-[13px]" /></label>
      <label className="grid gap-1 text-[12px] font-semibold text-[var(--color-ink-muted)]">Alternative text<input value={alt} onChange={(event) => setAlt(event.target.value)} maxLength={160} className="min-h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-[13px]" /></label>
      <button disabled={saving} className="min-h-11 rounded-xl bg-[var(--color-brand)] px-5 text-[12px] font-bold text-white disabled:opacity-60">{saving ? "Saving…" : "Save image"}</button>
      {url && <div className="sm:col-span-3"><p className="mb-2 text-[11px] font-semibold text-[var(--color-ink-muted)]">Preview</p><img src={url} alt={alt || fallbackAlt} className="max-h-56 w-full rounded-xl border border-[var(--color-border)] object-cover sm:max-w-md" onError={() => setMessage("Image preview could not load. Check that this is a direct, public HTTPS image URL.")} /></div>}
      {message && <p role="status" className="sm:col-span-3 text-[12px] text-[var(--color-ink-muted)]">{message}</p>}
    </form>
  </section>;
}
