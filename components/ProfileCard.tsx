import Link from "next/link";

export type ProfileCardData = {
  slug: string; name: string; age: number; hub: string; hourlyRate: number;
  galleryUrls: string[]; verified: boolean; available: boolean;
  whatsappNumber?: string | null;
};

export function ProfileCard({ profile }: { profile: ProfileCardData }) {
  const image = profile.galleryUrls[0];
  return (
    <article className="group overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition duration-220 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(45,18,72,.14)]">
      <div className="relative aspect-[4/5] bg-[var(--color-surface-raised)]">
        {image ? <img src={image} alt={`${profile.name}, ${profile.age}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" /> : <div className="grid h-full place-items-center text-sm text-[var(--color-ink-muted)]">Image unavailable</div>}
        {profile.verified && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11.5px] font-bold text-[var(--color-brand)] shadow-sm">✓ Verified</span>}
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11.5px] font-semibold shadow-sm ${profile.available ? "bg-white text-[#147a3d]" : "bg-white text-[var(--color-ink-muted)]"}`}>{profile.available ? "Available" : "Unavailable"}</span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-baseline justify-between gap-2"><h2 className="text-[14.5px] font-bold text-[var(--color-ink)]">{profile.name}, {profile.age}</h2><span className="rounded-full bg-[var(--color-surface-raised)] px-2 py-1 text-[11.5px] font-semibold text-[var(--color-ink-muted)]">{profile.hub}</span></div>
        <p className="text-[12.5px] text-[var(--color-ink-muted)]">From ₹{profile.hourlyRate.toLocaleString("en-IN")} / hour</p>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/profiles/${encodeURIComponent(profile.slug)}`} className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-center text-[12px] font-bold text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-raised)]">View profile</Link>
          {profile.whatsappNumber ? <a href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[var(--color-success)] px-3 py-2 text-center text-[12px] font-bold text-white shadow-[var(--shadow-whatsapp)] transition hover:brightness-95">WhatsApp</a> : <span className="rounded-xl bg-zinc-100 px-3 py-2 text-center text-[12px] font-semibold text-zinc-400" aria-disabled="true">WhatsApp soon</span>}
        </div>
      </div>
    </article>
  );
}
