"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

const hubs = ["Bandra", "Juhu", "Colaba", "Andheri", "Powai", "Lower Parel"];
const categories = ["Premium", "Companion", "Event"];

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    for (const key of ["hub", "category", "maxPrice"]) {
      const value = String(form.get(key) ?? "");
      if (value) next.set(key, value);
    }
    router.push(`/?${next.toString()}`);
  }
  return <form onSubmit={submit} className="grid gap-3 rounded-[16px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-4">
    <label className="grid gap-1 text-[11.5px] font-semibold text-[var(--color-ink-muted)]">Mumbai neighborhood<select name="hub" defaultValue={params.get("hub") ?? ""} className="rounded-xl border border-[var(--color-border)] bg-white p-3 text-[13px] text-[var(--color-ink)]"><option value="">All neighborhoods</option>{hubs.map((hub) => <option key={hub}>{hub}</option>)}</select></label>
    <label className="grid gap-1 text-[11.5px] font-semibold text-[var(--color-ink-muted)]">Category<select name="category" defaultValue={params.get("category") ?? ""} className="rounded-xl border border-[var(--color-border)] bg-white p-3 text-[13px] text-[var(--color-ink)]"><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="grid gap-1 text-[11.5px] font-semibold text-[var(--color-ink-muted)]">Maximum hourly rate<input name="maxPrice" type="number" min="0" defaultValue={params.get("maxPrice") ?? ""} placeholder="Any price" className="rounded-xl border border-[var(--color-border)] bg-white p-3 text-[13px] text-[var(--color-ink)]" /></label>
    <button className="self-end rounded-xl bg-[var(--color-brand)] p-3 text-[13px] font-bold text-white transition hover:brightness-95">Apply filters</button>
  </form>;
}
