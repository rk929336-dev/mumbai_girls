# Project Context: Mumbai Directory

This file is a handoff for future developers or AI agents. Read it before changing the project.

## Product

This is a Next.js profile directory for Mumbai. The current product direction is:

- Verified profiles grouped by Mumbai neighborhood.
- Profile cards with rates, availability, verification status, gallery images, and optional direct WhatsApp contact.
- Public filtering by neighborhood, category, hourly price, and sort order.
- A protected admin panel for profile CRUD.
- Inquiry/booking API with validation, same-origin protection, honeypot handling, and rate limiting.

The client supplied a visual reference and design guidance for a pink, purple, white, black, and blue marketing site. The homepage now follows that direction with a hero, profile directory, WhatsApp explanation, three-step process, neighborhood section, FAQ, and footer.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4 via `@tailwindcss/postcss`
- PostgreSQL 16
- Prisma 6
- Redis/Upstash-compatible rate limiting
- Docker Compose for local PostgreSQL and Redis

## Important files

- `app/page.tsx`: Main marketing homepage and database-backed profile listing.
- `app/layout.tsx`: Metadata and root layout.
- `app/globals.css`: Design tokens, typography defaults, focus-visible styles, and global styles.
- `components/ProfileCard.tsx`: Responsive profile card with optional WhatsApp CTA.
- `components/FilterBar.tsx`: Client-side neighborhood/category/price filter controls.
- `app/admin/page.tsx`: Protected browser admin UI for adding, editing, publishing, and deleting profiles.
- `app/api/profiles/route.ts`: Public filtered profile API.
- `app/api/bookings/route.ts`: Public inquiry submission API.
- `app/api/admin/login/route.ts`: Admin login.
- `app/api/admin/logout/route.ts`: Admin logout.
- `app/api/admin/profiles/route.ts`: Authenticated admin list/create API.
- `app/api/admin/profiles/[id]/route.ts`: Authenticated admin update/delete API.
- `lib/admin-auth.ts`: Signed HTTP-only admin session cookie helpers.
- `lib/profile-validation.ts`: Shared Zod validation for admin profile writes.
- `lib/rate-limit.ts`: Redis-backed inquiry and admin-login throttling. In development, placeholder Redis values are ignored; production fails closed if Redis is not configured.
- `lib/db.ts`: Prisma singleton.
- `prisma/schema.prisma`: PostgreSQL schema.
- `prisma/migrations/`: Applied database migrations.
- `docker-compose.yml`: Local PostgreSQL 16 and Redis 7 services.
- `next.config.ts`: CSP and browser security headers.
- `deploy/nginx.conf`: Example TLS reverse proxy and basic request limiting.
- `.env.example`: Required environment variable names and local defaults.
- `README.md`: Setup and deployment instructions.

## Database models

`Profile` includes:

- `slug`, `name`, `age`, `city`, `hub`
- `categories` string array
- `hourlyRate`, optional `dailyRate`
- optional `whatsappNumber`
- `galleryUrls` string array
- `verified`, `available`, `active`
- timestamps

`Inquiry` includes client contact information, selected profile, preferred time, location, optional message, status, and timestamps.

The profile schema is currently empty in the local database. Do not add invented production profiles. Use the admin panel or a controlled seed/import workflow.

## Local development

From the repository directory:

```powershell
docker compose up -d
npm install
npx prisma migrate dev --name init
npm run dev
```

Open the URL printed by Next.js. Port `3000` is standard; if occupied, Next.js uses `3001`.

To stop local services:

```powershell
docker compose down
```

The local `.env` is intentionally ignored by Git. It contains the local PostgreSQL connection and admin credentials. Never copy those secrets into this file or commit them.

## Admin panel

Open `/admin` on the running app. Set these values in `.env`:

```text
ADMIN_PASSWORD=<long random password>
ADMIN_SESSION_SECRET=<long random secret>
```

The panel supports profile creation, edits, gallery URL lists, rates, WhatsApp numbers, verification, availability, draft/published state, and deletion. Image handling is URL-based; direct uploads are not implemented. If uploads are added later, use controlled object storage, content-type/size validation, malware scanning, and signed upload URLs.

Admin API behavior:

- Login returns an HTTP-only, `SameSite=Strict` cookie.
- Admin profile routes return `401` without that cookie.
- Login attempts are rate limited when real Upstash Redis credentials are configured.
- Public profiles only expose `active=true` rows.

## Security notes

- Keep `.env` private and rotate admin secrets if exposed.
- Configure real Upstash Redis values in production. The development placeholder bypass must not be relied on for production.
- Configure Nginx or the ingress to overwrite `X-Real-IP`; the booking and login limiters use that value.
- The public API is same-origin by default. `APP_ORIGIN` adds an exact origin check to booking submissions.
- CSP, HSTS, frame protection, MIME sniffing protection, referrer policy, and permissions policy are configured in `next.config.ts`.
- Nginx request limits are only basic burst protection. Use a CDN/WAF for volumetric DDoS protection.
- Validate and constrain all externally hosted gallery URLs before publishing profiles.

## Verification completed

The following checks have passed:

- `npx tsc --noEmit`
- Production Next.js build (`npx next build`)
- Prisma migrations applied to local PostgreSQL
- `GET /` returns `200`
- `GET /api/profiles` returns `200`
- Unauthenticated admin API returns `401`
- Admin login returns `200`
- Authenticated admin profile list returns `200`

## Known follow-up work

- Add an authenticated staff/user model if more than one admin is needed.
- Add an audit log for profile changes and deletions.
- Add image upload/object-storage integration if URL entry is not sufficient.
- Add profile detail pages at `/profiles/[slug]`; the card link is reserved for that route.
- Add a controlled seed/import tool for real profile data.
- Replace the local admin password and session secret before any deployment.
- Configure production PostgreSQL, Redis, TLS, DNS, backups, monitoring, and a WAF.
