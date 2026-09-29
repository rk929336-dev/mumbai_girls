import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await db.profile.findFirst({
    where: { slug, active: true },
    select: { name: true, age: true, city: true, hub: true, categories: true, hourlyRate: true, dailyRate: true, whatsappNumber: true, galleryUrls: true, verified: true, available: true },
  });
  if (!profile) notFound();

  const whatsapp = profile.whatsappNumber?.replace(/\D/g, "");
  return <main className="min-h-screen bg-[var(--color-surface-raised)] px-4 py-6 sm:px-6 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <Link href="/#profiles" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[13px] font-semibold text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-raised)]">← Back to profiles</Link>
      <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <section className="min-w-0" aria-label={`${profile.name}'s photo gallery`}>
          {profile.galleryUrls.length ? <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">{profile.galleryUrls.map((url, index) => <div key={`${url}-${index}`} className={`flex min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${index === 0 ? "col-span-2" : ""}`}><img src={url} alt={`${profile.name}, photo ${index + 1}`} className={index === 0 ? "max-h-[78vh] h-auto w-auto max-w-full object-contain" : "aspect-square h-full w-full object-cover"} loading={index === 0 ? "eager" : "lazy"} /></div>)}</div> : <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[13px] text-[var(--color-ink-muted)]">No photos available</div>}
        </section>
        <aside className="h-fit min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:p-7">
          <div className="flex flex-wrap items-center gap-2">{profile.verified && <span className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-[11.5px] font-bold text-[var(--color-brand)]">✓ Verified</span>}<span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${profile.available ? "bg-emerald-50 text-emerald-800" : "bg-[var(--color-surface-raised)] text-[var(--color-ink-muted)]"}`}>{profile.available ? "Available" : "Unavailable"}</span></div>
          <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-ink)]">{profile.name}, {profile.age}</h1>
          <p className="mt-2 text-[13px] text-[var(--color-ink-muted)]">{profile.hub}, {profile.city}</p>
          <div className="mt-6 space-y-3 border-y border-[var(--color-border)] py-5 text-[13px]">
            <div className="flex justify-between gap-4"><span className="text-[var(--color-ink-muted)]">Hourly rate</span><strong className="text-[var(--color-ink)]">₹{profile.hourlyRate.toLocaleString("en-IN")}</strong></div>
            {profile.dailyRate !== null && <div className="flex justify-between gap-4"><span className="text-[var(--color-ink-muted)]">Daily rate</span><strong className="text-[var(--color-ink)]">₹{profile.dailyRate.toLocaleString("en-IN")}</strong></div>}
            <div className="flex justify-between gap-4"><span className="text-[var(--color-ink-muted)]">Location</span><strong className="text-right text-[var(--color-ink)]">{profile.hub}, {profile.city}</strong></div>
          </div>
          {profile.categories.length > 0 && <div className="mt-5"><h2 className="text-[12px] font-bold text-[var(--color-ink)]">Categories</h2><div className="mt-2 flex flex-wrap gap-2">{profile.categories.map((category) => <span key={category} className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-[11.5px] text-[var(--color-ink-muted)]">{category}</span>)}</div></div>}
          {whatsapp && profile.available ? <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-7 flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-success)] px-4 text-[13px] font-bold text-white shadow-[var(--shadow-whatsapp)] hover:brightness-95">Message on WhatsApp</a> : <p className="mt-7 rounded-xl bg-[var(--color-surface-raised)] p-3 text-center text-[12px] text-[var(--color-ink-muted)]">{profile.available ? "WhatsApp contact is not available for this profile." : "This profile is currently unavailable."}</p>}
          <p className="mt-3 text-center text-[11px] text-[var(--color-ink-muted)]">Please confirm availability and details directly before making arrangements.</p>
        </aside>
      </div>
    </div>
  </main>;
}
