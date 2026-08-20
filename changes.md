# Portalize — Change Log

Project: **Portalize** — zero-login client portals for freelancers
(see `prd.md` for the spec).

This file records what has been done so far so future sessions can pick up
context quickly. The last build was verified green with `npx tsc --noEmit` and
`npm run build` (2026-08-20).

---

## What was already in place (baseline)

- Next.js 16.3.1 App Router app, React 19.2, Tailwind v4, shadcn/ui on
  `@base-ui/react`, Supabase, zod.
- **AGENTS.md requirement**: this Next.js version has breaking changes. Read
  `node_modules/next/dist/docs/` before writing code. Key gotchas hit so far:
  - `middleware` is renamed to **`proxy`** (the old name is deprecated).
  - `useFormState` (react-dom) is deprecated → use **`useActionState`** (react).
  - Server actions passed to `<form action>` must return `void`/`Promise<void>`,
    not objects.
  - base-ui uses **`render={<Comp/>}`** instead of `asChild`.
- Baseline schema `supabase/migrations/001_initial_schema.sql`:
  - `freelancers`, `clients`, `projects`, `deliverables`, `feedback_comments`
  - RLS: freelancers manage own rows; anon can read projects/deliverables by
    slug (portal is PIN-gated at the app layer via cookie, not DB RLS).
  - Private `deliverables-bucket` for file uploads.
  - Realtime enabled on projects, deliverables, feedback_comments.

---

## Session 1 (this completion pass) — all changes

### 1. Build-blocking fixes
- `src/components/portal/DeliverablePortalCard.tsx` — **rewritten**. Original had
  a syntax error (missing `export function`) and wrong field names
  (`deliverable_type`, `code_content`, `code_language`). Now:
  - Preview uses `deliverable.preview_url` (a signed URL) for files.
  - Watermark wraps `['file', 'code']` types only.
  - Download button uses base-ui `render={<a …/>}` pattern.
- `src/components/ui/alert.tsx` — **new** (base-nova Alert/AlertTitle/
  AlertDescription + destructive variant). Needed by PaymentBanner, PinAuthForm.
- `src/components/ui/scroll-area.tsx` — **new** lightweight native-scrollbar
  wrapper. Needed by FeedbackDrawer.
- `src/lib/format.ts` — **new** `formatRelativeTime()` replacing date-fns
  `formatDistanceToNow` (date-fns was never a dependency). FeedbackDrawer now
  imports it.

### 2. Next 16 / base-ui migration
- `src/proxy.ts` — **new**, replaces deleted `src/middleware.ts`. Proxy function
  checks the portal cookie is exactly `'verified'`; matcher excludes `/api`,
  static assets, image extensions.
- `src/app/actions/clients.ts` / `deliverables.ts` / `projects.ts` — delete/
  toggle actions now return `Promise<void>` and throw on error (required by
  Next 16 for `<form action={serverAction}>`).
- `src/components/admin/{AddClientDialog,FileUploader,CodeSnippetForm,
  LinkEmbedForm}.tsx` + `NewProjectForm.tsx` — `useFormState` →
  `useActionState`; `DialogTrigger asChild` → `DialogTrigger render={…}`;
  `DropdownMenuTrigger asChild` → `render={…}`.
- `src/lib/utils.ts` — added `asSingle<T>()` to normalize the embedded
  `freelancers` relation (typed as array, actually an object).

### 3. File previews from private storage
- Portal page (`src/app/(portal)/p/[slug]/page.tsx`, **rewritten**) now validates
  the PIN cookie, fetches the project, and enriches file deliverables with
  **view-only signed URLs** (`enrichDeliverablesWithPreviewUrls` in
  `src/lib/supabase/admin.ts`, 15-min expiry) so browsers can preview without
  leaking the private-bucket download. Payment-gated real downloads still go
  through `/api/download` (402 when unpaid).

### 4. Realtime portal re-render
- `src/components/portal/PortalView.tsx` — **new** client component that holds
  live state from `useRealtimeProject` / `useRealtimeDeliverables` and renders
  header, PaymentBanner (when unpaid), status badge, DeliverablePortalCard list,
  and approve-project button. Payment status flips → UI unlocks live.
- Deleted the old `RealtimePortalWrapper.tsx`.

### 5. Security & notifications (PRD §6.2 + email gaps)
- `src/lib/rate-limit.ts` — **new** in-memory sliding-window limiter:
  `isRateLimited(key)`, `recordFailure(key)`, `clearFailures(key)`; max 5
  failures / 60s per IP+slug, with an unref'd cleanup interval.
- `src/app/actions/portal.ts` — `verifyPinAction` now rate-limits by
  `${slug}:${ip}` (headers `x-forwarded-for` / `x-real-ip`). Feedback/approve
  actions now trigger email notifications.
- `src/lib/email.ts` — **new** `sendEmail` via Resend HTTP API, env-gated
  (`RESEND_API_KEY` / `RESEND_FROM_EMAIL`); sends change-request and approval
  emails to the owning freelancer via service-role lookup.

### 6. Payment webhook + Settings page
- `src/app/api/webhooks/payment/route.ts` — **new** `POST` route guarded by
  `x-webhook-secret` === `WEBHOOK_SECRET` (401/503 otherwise). Body
  `{ projectId }` → sets `payment_status='paid'` via admin client.
- `supabase/migrations/002_brand_assets.sql` — **new** public `brand-assets`
  bucket + upload/update/delete policies for the owning freelancer + anon read
  (logos render on client portals without auth).
- `src/app/actions/profile.ts` — **new** `updateProfileAction` (zod-validated
  full_name / business_name / brand_color, optional logo upload to
  `brand-assets`, stores public URL in `logo_url`).
- `src/components/admin/SettingsForm.tsx` — **new** client form (useActionState)
  with name, business name, brand-color picker, logo file input, current-logo
  preview.
- `src/app/(admin)/dashboard/settings/page.tsx` — **new** server page fetching
  the freelancer profile and rendering SettingsForm. Sidebar already had the
  Settings link.

### 7. Client edit/delete, link fixes, polish
- `src/components/admin/ClientActions.tsx` — **new** client component wiring the
  per-client dropdown: Edit (dialog pre-filled, `updateClientAction`) and
  Delete (confirm dialog, `deleteClientAction`, then `router.refresh()`).
- `src/app/(admin)/dashboard/clients/page.tsx` — uses `ClientActions` (the old
  Edit/Delete dropdown items were inert).
- `src/lib/urls.ts` — **new** `portalUrl(slug)` using
  `NEXT_PUBLIC_APP_URL` (defaults to `http://localhost:3000`).
- `src/app/(admin)/dashboard/projects/page.tsx` — CopyButton now copies
  `portalUrl(slug)` instead of the hardcoded `https://example.com/portal/…`.
- `src/lib/email.ts` — now imports `portalUrl` from urls.ts (dedupe).
- `src/app/layout.tsx` — real metadata (Portalize) + `<Toaster />` (sonner).
- `src/app/page.tsx` — **rewritten** into a Portalize landing page (hero +
  features) with links to `/signup` and `/login`.
- `src/app/(auth)/login/page.tsx` — `useSearchParams` wrapped in a
  `<Suspense>` boundary (build was failing prerender with
  "missing-suspense-with-csr-bailout").
- `src/components/previewers/DocViewer.tsx` — fixed react-pdf CSS import paths
  (drop the `esm/` segment for react-pdf 10.4.1).
- `src/app/actions/clients.ts` — `updateClientAction` now returns `fieldErrors`
  on validation failure (was type-checking against `ClientActions.tsx`).
- `.env.local.example` — **new** documenting all env vars.
- `README.md` — **rewritten**: features, setup, env table, webhook usage,
  project structure.

---

## Session 2 — landing + auth polish, download-gate confirmation

Verified `npx tsc --noEmit` + `npm run build` green after this session.

### Download gating (confirmed, no code change)
The intended flow was already fully implemented and verified:
- Client can **always view** deliverables (signed view-only preview URLs;
  files/code show a watermark while unpaid — `DeliverablePortalCard.tsx` +
  `WatermarkOverlay`).
- Download is **locked until paid**: `/api/download` returns **402** unless
  `payment_status === 'paid'`; the portal card shows a disabled "Download
  locked" button (`Lock` icon) when unpaid.
- The freelancer flips it manually via **"Mark as Paid"** in
  `ProjectHeader.tsx` (also "Mark as Unpaid"). Toggle → `togglePaymentStatus`
  in `src/app/actions/projects.ts`. Realtime flips the client portal live.

### Landing page (`src/app/page.tsx`) — full redesign
- Sticky blurred nav (Login + "Get started"), gradient hero with badge,
  three-line headline, CTA pair, trust checklist.
- **HeroMock**: a hand-built static mockup of a client portal — browser chrome,
  deliverable card with watermark preview + a "Download locked" chip — so the
  view-only/paid-gating story is shown visually before signup.
- "How it works" (3 numbered steps) + features grid + dark CTA band + footer.
- Uses existing UI components (`Button`, `Badge`, lucide icons); monochrome
  zinc palette with soft blue/violet glow accents.

### Auth pages (`src/app/(auth)/`)
- `layout.tsx` — **rewritten**: centered branded shell (Portalize logo chip,
  tagline) with decorative background glows, wrapping a white card
  (`rounded-2xl border shadow-xl`).
- `login/page.tsx` — **rewritten**: "Welcome back" heading, prominent
  `h-11` inputs, red `AlertTriangle` alert on error, full-width CTA with
  pending label; keeps the `Suspense` boundary around `useSearchParams`.
- `signup/page.tsx` — **rewritten**: matching structure with full name, email,
  password, optional business name; "Create account" CTA.
- No longer uses the `Card` UI component (layout provides the card shell).

### Motion utilities (`src/app/globals.css`)
- Added `animate-fade-up` utility (opacity + `translateY(16px)`, strong
  `cubic-bezier(0.23,1,0.32,1)` ease-out, sub-500ms) for marketing entrances;
  transform/opacity only per design-skill rules. (Landing currently leans on
  static layout + `transition-shadow`; utility is ready for staggered reveals.)

### Tooling
- Installed Emil Kowalski's design-engineering skills via
  `npx skills add emilkowalski/skill` → `.agents/skills/`
  (`emil-design-eng`, `prototype`, `apple-design`, `animate`, etc.) — loaded
  `emil-design-eng/SKILL.md` for the polish pass above.

---

## Session 3 — impeccable design-context setup

- Installed **impeccable** design skill: `npx impeccable install` → added to
  `.claude/skills/impeccable` (+ hooks), alongside the earlier emilkowalski
  skills. Skill list under `.claude/skills/` and `.agents/skills/`.
- Ran `/impeccable init` equivalent flow (invoked via skill):
  - `node .claude/skills/impeccable/scripts/context.mjs` → confirmed no
    `PRODUCT.md` existed.
  - Interviewed the user (AskUserQuestion): primary users = **mixed / any
    freelancer**; business model = **free + paid tiers** (freemium);
    **"Portalize" name final**.
  - Wrote **`PRODUCT.md`** (impeccable product-schema 1): platform `web`,
    users, purpose, positioning (payment-gated downloads as the hook),
    operating context, capabilities & constraints (incl. Next 16 gotchas,
    undecided items), brand commitments, evidence on hand, and 5 product
    principles.
- No image generation on this machine → code-first is the only build path; no
  `.impeccable/config.json` recorded. `.impeccable/` dir not yet created.
- Next design work should follow impeccable's new-work / scoped command
  references (`reference/new-work.md`, `reference/craft-floor.md` before
  editing UI).

---

## Session 4 — whole-app design pass (taste-skill + impeccable + emilkowalski)

Applied all three installed design systems across every page. Verified green
after this session: `npx tsc --noEmit` + `npm run build` (all 14 routes).

### Design direction
Two-mode read of the product: the **client portal is the Experience surface**
(the branded handoff moment — calm, spacious, brand color as the single
accent), the **admin dashboard is the Operate surface** (crisp, scannable,
neutral). Landing/auth keep Session 2's committed world.

### Foundation (`src/app/globals.css`)
- Added semantic color tokens `success` / `warning` / `info` (+ foregrounds) to
  `@theme inline`, `:root`, and `.dark` (oklch). Enabled utilities like
  `text-success`, `bg-warning/10`, `border-info/40`.
- **Browser surfaces** themed from the palette (impeccable craft-floor):
  `::selection` tint, thin `scrollbar-width`/`scrollbar-color` on `html`, and
  rounded `::-webkit-scrollbar-thumb` using `--border`. The cheapest "built,
  not assembled" signal.

### Client portal (`/p/[slug]`) — Experience surface
- `layout.tsx` — page surface `bg-zinc-50` (was `bg-white`) so white cards read
  as objects; content `max-w-5xl py-10`.
- `PortalHeader` — **rewritten**: rounded white card band with `ring-1` +
  shadow, brand-color as a thin horizontal top accent (not a border-left),
  logo/initial tile, truncating business name, and a muted "Private access"
  pill (`Lock` icon) — a quiet trust cue.
- `PaymentBanner` — `amber-*` raw colors → `border-warning/30 bg-warning/10
  text-warning`; tightened copy.
- `DeliverablePortalCard` — removed raw `border-gray-200`/`bg-gray-50`; header
  `bg-zinc-50/80`, footer `bg-zinc-50/80`; preview fallbacks/link card →
  zinc tokens; "Approve" button `green-*` → `border-success/40 text-success`;
  locked download `text-gray-500` → `text-zinc-500`; added
  `shadow-sm hover:shadow-md` lift.
- `PortalView` — title `text-zinc-900` + new deliverable-count line; empty
  state → `border-dashed bg-zinc-50`; **removed bogus `bg-brand
  text-brand-foreground` classes** (inline `var(--brand-color)` style kept).
- `PinAuthForm` — **removed `border-t-4` + `borderTopColor`** (impeccable
  floor: thick colored borders as decoration); card → `shadow-xl ring-1
  ring-zinc-200/70`; logo `rounded-full` → `rounded-xl`.
- `FeedbackDrawer` — client bubble `bg-blue-600 text-white` →
  `bg-info text-info-foreground`; freelancer bubble `bg-gray-100` →
  `bg-zinc-100`; timestamps/empty state → zinc.
- Previewers: `ImageViewer`/`EmbedViewer` grays → zinc; `WatermarkOverlay`
  font `Arial` → `var(--font-sans, …)` stack + darker neutral fill (craft-floor
  "monospace/Arial as costume"); `DocViewer`/`CodeViewer` grays → zinc +
  `text-destructive` error.

### Admin dashboard — Operate surface
- `ProjectHeader` — **removed `border-l-4 border-l-blue-600`** (craft-floor
  ban); "Mark as Paid" is now the **primary** button when unpaid (the money
  CTA) and outline when paid; portal link `text-blue-600` → `text-info`; PIN
  box → `border-warning/40 bg-warning/10 text-warning`.
- `DeliverableCard` — icon chip `bg-blue-50 text-blue-600` →
  `bg-info/10 text-info`; status badges → success/warning/info tokens; delete
  `text-red-500` → `text-destructive`.
- `dashboard/page.tsx` — stat cards now data-driven: muted label, icon in a
  `bg-muted` chip, `text-3xl tabular-nums` figure (craft-floor "numerals in
  tabular data").
- `Sidebar` — added the "P" logo tile (white square, matches landing/auth
  brand mark) beside the wordmark.
- `projects/page.tsx` — status badges → tokens; card footer `bg-muted/30`;
  `shadow-sm hover:shadow-md` lift.
- `projects/new/page.tsx` — hand-rolled `bg-white rounded-xl border` wrapper →
  real `Card`/`CardContent` (+ imports).
- `projects/[id]/page.tsx` — the "Add Deliverable" panel wrapper →
  real `Card` with `sticky top-6`.
- Forms (`FileUploader`, `CodeSnippetForm`, `LinkEmbedForm`, `NewProjectForm`,
  `AddClientDialog`, `ClientActions`, `SettingsForm`) — all error/success
  surfaces `red-*`/`green-*`/`emerald-*` → `destructive`/`success` tokens;
  field errors `text-red-500` → `text-destructive`.
- `CopyButton` — copied check `text-green-500` → `text-success`.
- `settings/page.tsx` — heading aligned `text-2xl` → `text-3xl`.

### Motion (emilkowalski)
- `button.tsx` — `transition-all` → scoped
  `transition-[transform,background-color,border-color,color,box-shadow,opacity]
  duration-150 ease-out` (transition only what changes); press feedback
  `translate-y-px` → **`scale-[0.97]`** on `:active` (kept
  `not-aria-[haspopup]` so menu triggers don't scale). One authored motion
  moment system-wide, per craft-floor.

### Result
- Zero remaining `border-l-4`/`border-t-4` colored borders, `bg-brand`
  classes, or raw `gray-*` colors outside the deliberately committed
  landing/auth world. One semantic color language (success/warning/info) and
  one neutral (zinc + tokens) across the app.

---

## Session 5 — live Supabase connection (hosted project)

Connected the app to a real hosted Supabase project. `npx tsc --noEmit` was
green before this session; backend verified end-to-end after.

### Project
- Hosted project **ref `ezuorevjqxlxzzitfevt`** ("shayanbasuroy's Project",
  region ap-southeast-2, Postgres 17.6). URL
  `https://ezuorevjqxlxzzitfevt.supabase.co`.
- Credentials live in **`.env.local`** (gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_APP_URL=http://localhost:3000`. The `sb_publishable_…` /
  `sb_secret_…` keys the user shared are the newer-format equivalents of
  anon/service_role; the classic JWTs already in `.env.local` are equivalent.
- Installed **Supabase CLI 2.115.0** (`npm i -g supabase`; brew tap clone
  failed). Authenticated with the user's personal access token
  (`sbp_…`, stored in `~/.supabase/access-token`). Project linked →
  `supabase link --project-ref ezuorevjqxlxzzitfevt`.

### Migration fix
- `001_initial_schema.sql` used `create extension uuid-ossp` +
  `uuid_generate_v4()`. The hosted project rejected it: *function
  uuid_generate_v4() does not exist*. Replaced all 4 id defaults with
  **`gen_random_uuid()`** (core Postgres 13+, no extension) and removed the
  extension block — also future-proofs fresh setups.
- `supabase db push` applied `001_initial_schema.sql` + `002_brand_assets.sql`
  cleanly. Verified via `supabase db query --linked`: all 5 tables
  (clients, deliverables, feedback_comments, freelancers, projects), both
  storage buckets (`brand-assets` public, `deliverables-bucket` private), and
  Realtime enabled on projects/deliverables/feedback_comments.

### Auth verification (live)
- Supabase has **`mailer_autoconfirm: true`** (email confirmation disabled) —
  signup gets a session immediately, no email provider needed yet. This is
  dev-mode; re-enable confirmation when a real email provider (Resend) is wired.
- Tested end-to-end against the live API with throwaway
  `…@portalize.dev` users: signup → session ✓, freelancer profile insert
  (RLS) → HTTP 201 ✓, password login → access_token ✓, profile read-back ✓.
  All test users deleted afterward (auth admin API); freelancer rows cascaded.
- App smoke-test on `npm run dev`: `/`, `/login`, `/signup` → 200;
  `/dashboard` unauthenticated → 307 `/login?redirect_to=/dashboard`
  (`src/proxy.ts`); `/p/<slug>` unknown → 307 `/p/<slug>/auth`;
  `/api/download` without session → 403.

### Tooling notes
- `supabase db query --linked "…"` runs SQL against the linked project via the
  Management API — no DB password needed. Useful for ad-hoc inspection.
- `supabase login` stores the access token at `~/.supabase/access-token`.
- The database password set at project creation is **not** stored anywhere in
  the repo; it is only needed for direct `psql`/pooler connections, not the CLI.

---

## Session 6 — fix RLS error on client-portal logo upload

Reported: submitting the settings form with a logo returned
**"new row violates row-level security policy"**. Isolated and fixed.

### Diagnosis (reproduced against the live API)
- The error text has **no `for table "freelancers"` suffix** → it is the
  **storage INSERT**, not the freelancers UPDATE (PostgREST appends
  `for table "…"`; storage does not). `getUser()` passed, so the session was
  valid; the failing call was the upload itself.
- Reproduced exactly: with a real session cookie, `getUser()` ✓,
  `freelancers.update` ✓, but `storage.from("brand-assets").upload(path, file, { upsert: true })`
  → `StorageApiError 403 AccessDenied "new row violates row-level security
  policy"`.
- Root cause isolated to the **`upsert: true` option** (sends the
  `x-upsert: true` header):
  - Same path, plain POST (no upsert) → **HTTP 200** ✓
  - Same path, `x-upsert: true` → **HTTP 400 / 403 "new row violates RLS"** ✗
- Why: to decide the upsert branch, the storage service must SELECT the
  existing `storage.objects` row as the authenticated user — but the
  `brand-assets` SELECT policy (migration 002, line 41) is `to anon` only.
  The authenticated user's read is denied, so the upsert surfaces as an RLS
  error.

### Fix
- `src/app/actions/profile.ts`: removed `{ upsert: true }` from the
  `brand-assets` upload. The path already contains `Date.now()` + a sanitized
  filename, so it is unique per upload — upsert added no value and was the
  trigger.
- Verified end-to-end via the actual server client + real session cookie:
  upload OK → `logo_url` written to `freelancers` → public URL returns
  **HTTP 200**. `npx tsc --noEmit` green.
- DB left clean: 1 user (real account), 1 freelancer row, 0 stray
  `brand-assets` objects.

### Note for later
- If upsert on `brand-assets` is ever needed, add an `authenticated` SELECT
  policy on `storage.objects` for `bucket_id = 'brand-assets'` (current SELECT
  policy is `to anon` only). Not required while uploads use unique paths.

---

## Session 7 — landing page redesign (dark, glass, mesh-gradient)

User verdict on the old light landing page: "terrible ai slop". Rebuilt it
from scratch as an **always-dark** marketing page, driven by the four design
skills (emil-design-eng, design-taste-frontend, impeccable,
high-end-visual-design) and the user's exact design brief: deep indigo
`#0B0E14`, radial purple `#1E0B36`, electric violet `#7C3AED`,
glassmorphism with `border-white/10` + inner-highlight shadows, Geist display
type (already loaded in `layout.tsx`) + Geist Mono for code, custom
cubic-bezier motion.

### What was built
- **`src/app/page.tsx`** — rewritten. Composes the landing surface: ambient
  mesh-gradient field (`landing-aurora`), fixed film-grain overlay
  (`landing-grain`), floating glass-pill `Header`, split `Hero` (left copy /
  right 3D mockup), `LogoTicker`, `Bento`, `Comparison`, `Pricing`, `Faq`,
  `CtaBanner`, `Footer`. `overflow-x-clip` guards against chip overflow.
- **New `src/components/landing/`** (one component per section, all bespoke,
  no shadcn deps):
  - `logo.tsx` — gradient tile + wordmark (shared by header/footer).
  - `reveal.tsx` — IntersectionObserver scroll-reveal wrapper (opacity +
    translateY only, disconnects on first hit, gated by
    `prefers-reduced-motion`).
  - `header.tsx` — floating glass pill nav (`mt-4`, `rounded-full`,
    `backdrop-blur-xl`, inner highlight). Desktop: Features / Live Demo /
    Pricing / FAQ links + Log In + glowing gradient pill CTA with nested
    icon circle. Mobile: hamburger morphs to an X; menu is a full-screen
    glass overlay with staggered link reveals. **Note:** the overlay is
    mounted only while open, because an always-mounted full-screen
    `backdrop-blur-2xl` layer still blurs the page behind even at
    `opacity-0` (backdrop-filter ignores its own opacity).
  - `portal-mockup.tsx` — the hero's product mockup, built as a real
    mini-portal UI (not a fake div screenshot): browser chrome with
    `acmecorp.portal.app` + Live dot, Figma-style design canvas with layer
    chips and an inline "Acme Corp approved" comment, a code deliverable
    (`src/logo.tsx`, mono, syntax-tinted), and a ZIP with the amber
    "Download locked until payment settles" banner. The card tilts in 3D
    toward the pointer (perspective + rotateX/Y on pointermove, springy via
    `transition-transform 200ms`), carries an ambient glow cursor, and sits
    inside a CSS float shell so the tilt and float transforms don't clash.
    Two floating chips ("Payment settled", "Read receipt") + the "Acme Corp
    viewing now" avatar tag. Stacks to single column on mobile.
  - `logo-ticker.tsx` — the page's single marquee (max-one-per-page rule).
    Real brand marks from Simple Icons CDN (`cdn.simpleicons.org/{slug}/ffffff`),
    edge-masked, logos only (no category labels), pause-free 30s loop.
  - `bento.tsx` — 2x2 feature grid (Payment Lock 2x2, Embedded Viewer,
    Read Receipts, Custom Branding full-width band), each cell a glass card
    with a real mini-UI visual (lock/unlock deliverable, PDF skeleton,
    status chips, brand-preview card).
  - `comparison.tsx` — "The old way, retired": muted crossed-out list vs
    the glowing "Portalize way" with violet checks.
  - `pricing.tsx` — Starter ($0) / Pro Freelancer ($19/mo, highlighted with
    gradient price + "Most popular" chip).
  - `faq.tsx` — accessible accordion (aria-expanded/controls), height
    animation via `grid-rows-[0fr]→[1fr]` (no JS measuring).
  - `cta-banner.tsx` — full-width purple-gradient banner with dotted
    overlay and white pill CTA ("Start 14-Day Free Trial").
  - `footer.tsx` — logo, tagline, two link columns, monospace tagline.
- **`src/app/globals.css`** — landing-specific CSS: `landing-aurora` (layered
  radial mesh), `landing-grain` (inline feTurbulence SVG, fixed +
  pointer-events-none), keyframes for float / marquee / pulse-dot / fade-up
  as plain CSS classes (all transform/opacity, all killed under
  `prefers-reduced-motion`), plus `scroll-behavior: smooth`.
- **`src/app/layout.tsx`** — metadata title switched from an em-dash
  ("Portalize — …") to a pipe separator.

### Design-skill rules honored
- Zero em-dashes/en-dashes anywhere (verified via grep on the rendered
  HTML: 0 of each).
- Page theme lock: one dark theme for the whole landing page; the rest of
  the app (dashboard/portal/auth) is untouched and keeps its own theming.
- Hero stack discipline: badge + 3-line H1 + subheadline + 2 CTAs + one
  social-proof line; CTA visible above the fold on 1440x900 and 390x844.
- Hero top padding capped (`pt-28/32/36`), H1 ≤ 2 lines/line… (3 short
  lines), no decorative scroll cues, no version labels, no section-number
  eyebrows, no locale/weather strips, one marquee, one eyebrow-equivalent
  (the hero Zap badge), logos without category labels.
- Motion: transform/opacity only; scroll reveals via IntersectionObserver
  (no `window.addEventListener('scroll')`); mobile nav overlay mounts only
  when open; `active:scale-[0.97]` press feedback on every CTA.
- Reduced-motion: every animation collapses to static/instant.
- Mobile collapse declared per section: bento → single column, mockup →
  stacked, hero CTAs stack vertically, all `w-full`/`px-4` under `md`.

### Verification
- `npx tsc --noEmit` → clean. `npm run build` → green, `/` prerendered
  static. Dev-server smoke test: HTTP 200, all 20 key copy strings present.
- Headless-Chrome CDP layout audit (1440x900 + 390x844):
  - no horizontal overflow on either size
  - H1 renders as exactly 3 lines (201px/127px block heights match
    3 × line-height), "Zero Client Friction." fits on one line at 390px
  - primary CTA in viewport on both sizes; mockup bottom 584px on desktop
  - all 12 marquee brand images loaded (natural width 150)
  - `main` background = rgb(11,14,20) = `#0B0E14`
  - mockup grid: 2-col on desktop, single 312px col on mobile

### Notes for later
- The logo ticker loads marks from `cdn.simpleicons.org`. In production,
  either keep the CDN or inline the SVG paths (the 6 slugs: framer,
  webflow, figma, github, stripe, supabase) to remove the network dep and
  guarantee offline rendering.
- The two always-visible desktop floating chips on the mockup are
  `hidden sm:flex`, so the mobile layout never overflows.
- `Live Demo` in the nav anchors to `#demo` (the hero mockup) since there
  is no dedicated demo portal route yet. If a real seeded demo portal is
  added later, point the link at it.

---

## Session 7b — installed `gpt-taste` design skill (tooling, no code change)

Ran `npx skills add Leonxlnx/taste-skill` at the user's request. This is the
"taste-skill" bundle (the source that `design-taste-frontend` is derived
from). It installed into `~/.agents/skills/` and symlinked for Claude Code:

- **`gpt-taste`** (new) — Elite UX/UI + GSAP motion engineer. Key rules:
  Python-driven deterministic layout randomization (`<design_plan>` before
  any code), strict AIDA page structure, wide-container H1 with a hard 2-3
  line cap, gapless bento grids via `grid-flow-dense`, real GSAP
  ScrollTriggers (pinning/stacking/scrub), inline typography images, huge
  `py-32 md:py-48` section spacing, and a strict no-emoji / no-meta-label /
  no-stamp-badge policy.
- `stitch-design-taste`, `design-taste-frontend`, `design-taste-frontend-v1`
  — refreshed copies of already-present skills.
- No source code or routes were touched. Available to future sessions as
  `/gpt-taste`.

Note: the landing page was rebuilt before this skill was installed, so the
current page does not reflect gpt-taste's randomization/GSAP workflow. If a
future pass wants gpt-taste applied, re-open the landing components and run
its `<design_plan>` protocol first.

## Session 7c — gpt-taste pass on the landing page

Applied the `/gpt-taste` skill workflow to the existing landing page (the
page already honored the original design brief; this pass layered gpt-taste's
motion/typography/grid rules on top without touching the locked copy, palette
`#0B0E14`/`#1E0B36`/`#7C3AED`, or section structure).

### Changes
- **Dependencies**: installed `gsap@^3.15` + `@gsap/react@^2.1` (gpt-taste
  mandates real GSAP ScrollTriggers — previously the page used only CSS +
  IntersectionObserver reveals).
- **New `src/components/landing/gsap-setup.ts`** (`"use client"`): single
  ScrollTrigger registration point, `ignoreMobileResize`, and a refresh on
  window `load` + `document.fonts.ready` so scrub positions stay accurate.
- **Rewrote `reveal.tsx`** to GSAP (`useGSAP` + `gsap.matchMedia`): opacity +
  translateY + `scale 0.96→1`, `power3.out`, fires once at `top 85%`, reduced-
  motion → instant visibility. Same public API (`className`/`delay`/`y`), so no
  call sites changed.
- **New `scrub-heading.tsx`**: section H2s render word-by-word (`[data-word]`
  spans) and scrub opacity 0.12→1 tied to scroll (`start top 88%`, `end top 45%`,
  `scrub: true`). Applied to the bento, comparison, pricing, and FAQ headings.
- **New `hero-parallax.tsx`**: subtle y-parallax on the portal mockup
  (desktop-only, `min-width: 640px`, disabled under reduced motion).
- **Bento**: `md:grid-flow-dense` added; hover physics on the three inner
  preview panels (`group-hover:scale-105 transition-transform duration-700
  ease-out` inside overflow-hidden); heading header now `ScrubHeading`.
- **Comparison**: portal panel gets hover lift + glow (`hover:-translate-y-1`).
- **Pricing**: both cards get `hover:-translate-y-1` + border/glow state.
- **Spacing**: major sections bumped to `py-24 md:py-48` (cinematic chapters
  per the skill's spacing rule).
- **`page.tsx`**: `<main>` now `w-full max-w-full overflow-x-clip` (skill's
  horizontal-scroll guard); mockup wrapped in `HeroParallax`.

### RNG + brief overrides (documented in the `<design_plan>`)
- Seed = request char count (43): RNG picked Cinematic Center / Outfit, but the
  locked brief mandates a split hero + Geist, so those were overridden (per
  "the brief wins"). Infinite Marquee landed on the existing logo ticker.
- GSAP paradigms picked: Scrubbing Text Reveals + Hover Physics — both
  implemented. No new photos added (page is product-led; the brief's dark glass
  aesthetic wins over generic picsum).

### Verification
- `npx tsc --noEmit` clean; `npm run build` green (`/` static prerendered).
- Headless-Chrome CDP audit (1440x900 + 390x844): zero horizontal overflow;
  H1 exactly **3 lines** both viewports (measured via text-rect line tops);
  primary CTA in viewport on both; 12/12 logo images loaded; `main` bg
  `rgb(11,14,20)`; **zero page errors**; no stuck-invisible content after full
  scroll (all GSAP reveals + scrub settled; FAQ scrub words opacity `[1,1]`).
- Banned-char sweep: 0 emojis, 0 em/en-dashes in rendered copy (a few remain
  only inside code comments, never rendered).

### Notes
- All GSAP work is transform/opacity only and collapses under
  `prefers-reduced-motion` via `gsap.matchMedia`; mobile parallax disabled.
- If you later add GSAP elsewhere, import from `gsap-setup.ts` so ScrollTrigger
  stays registered once.

---

## Session 7d — light, clean redesign (invoice-owl reference)

User called the app UI "trash all throughout" and attached a screenshot of
`invoice-owl.vercel.app` as the design reference. Locked with the user via
questions: **landing first** (review, then roll out), and **"You decide"** on the
look → decided **light + slate neutrals + violet (#7C3AED) primary**, emerald
kept only for payment-success semantics. Mirrors InvoiceOwl's structure while
keeping portalize's brand. The GSAP motion layer, copy, and section structure
were left untouched — this is a restyle. Approved plan in
`.claude/plans/lazy-crunching-quiche.md`.

### Changes (all tokens inline, light system on the landing only)
- **`globals.css`** — `.landing-aurora` re-skinned to soft violet/fuchsia radials
  on white; `.landing-grain` opacity `0.035` → `0.015`. Keyframes, smooth-scroll,
  reduced-motion blocks unchanged.
- **`page.tsx`** — `<main>` `bg-[#0B0E14] text-white` → `bg-white text-slate-900`
  (+ `overflow-x-clip` from 7c kept). Hero: badge `border-violet-200 bg-violet-50/80
  text-violet-700` + `Zap` violet-600; H1 `text-slate-900` with gradient span
  `from-violet-600 via-fuchsia-600 to-violet-500`; subcopy `text-slate-600`;
  secondary CTA `border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
  micro-proof `text-slate-500`. Primary CTA gradient unchanged.
- **`logo.tsx`** — wordmark `text-white` → `text-slate-900` (gradient tile stays).
- **`header.tsx`** — pill → `border-slate-200/80 bg-white/85 backdrop-blur-xl` +
  soft shadow; desktop links `text-slate-600 hover:bg-slate-100
  hover:text-slate-900`; Log In `text-slate-700`; hamburger `text-slate-700`;
  mobile overlay `bg-white/90`, links `text-slate-900 hover:bg-slate-100`, mobile
  Log In `border-slate-300 bg-white text-slate-800`. CTAs unchanged.
- **`logo-ticker.tsx`** — `border-y border-slate-200/80 bg-slate-50/70 py-9`;
  logo color `ffffff` → `0F172A`.
- **`bento.tsx`** — GlassCard → `border-slate-200 bg-white shadow-sm
  hover:shadow-md`; CellHeader icon well `from-violet-500/15 to-fuchsia-500/5
  ring-violet-200`, icon `text-violet-600`, h3 `text-slate-900`, body
  `text-slate-600`; Locked chip `amber-700/amber-50/amber-300`; receipts chips
  violet/emerald/cyan 50-tints. Inner dark product windows (`bg-[#0a0c15]`)
  deliberately kept — the realistic file/IDE panels, like InvoiceOwl's dark
  dashboard mockup. Heading + sub → `text-slate-900`/`text-slate-600`.
- **`comparison.tsx`** — old panel `border-slate-200 bg-slate-50`, header
  `text-slate-500`, X `bg-slate-200 text-slate-500`, items struck-through
  `text-slate-500 decoration-slate-400/40`; portal panel
  `border-violet-200 bg-gradient-to-b from-violet-50 to-white` + violet glow,
  checks `bg-violet-100 ring-violet-200 text-violet-600`, items `text-slate-700`.
- **`pricing.tsx`** — Pro card `border-violet-300 from-violet-50/80 to-white` +
  glow; non-highlight `border-slate-200 bg-white shadow-sm hover:bg-slate-50/60`;
  price `text-slate-900` (highlight gradient kept); checks violet-tinted; CTA
  `border-slate-300 bg-white text-slate-800 hover:bg-slate-50`.
- **`faq.tsx`** — shell `divide-slate-200 border-slate-200 bg-white rounded-2xl
  shadow-sm`; question `text-slate-900`/`text-slate-700`; Plus open → violet,
  closed → slate; answer `text-slate-600`.
- **`footer.tsx`** — `border-slate-200`; tagline `text-slate-500`; column titles
  `text-slate-400`; links `text-slate-500 hover:text-slate-900`; meta
  `text-slate-400`.
- **`portal-mockup.tsx`** — aura lightened to `from-violet-400/30 via-fuchsia-400/15`.
  Dark app window + floating chips stay.
- **`cta-banner.tsx`** — subcopy `text-white/80` (banner stays the page's single
  bold color chapter).

### Verification
- `npx tsc --noEmit` clean; `npm run build` green (`/` static, `ƒ Proxy
  (Middleware)`).
- Headless-Chrome CDP audit (1440x900 + 390x844): **zero horizontal overflow**
  (sw = cw on both); `main` bg `rgb(255,255,255)`; H1 exactly **3 lines** both
  viewports, computed color = slate-900; primary CTA in viewport on both
  (gradient confirmed); nav pill white/85 on slate-200/80; logo ticker color
  `0F172A`; 12/12 logos loaded; **no stuck-invisible GSAP content** after full
  scroll; FAQ scrub words opacity `[1,1]`; **zero page errors** both viewports.
- Rendered-copy sweep: 0 em-dashes, 0 emojis across 654 rendered words.

### Notes
- Landing is deliberately always-light; app-wide dark tokens elsewhere are
  untouched. Rollout of these tokens to auth / dashboard / portal / admin is the
  next pass after user review of this page.

---

## How to run

1. `.env.local` already exists with live Supabase credentials (gitignored).
   To start fresh: `cp .env.local.example .env.local` and fill in Supabase URL,
   anon key, service role key (plus optional Resend / webhook secret).
2. `npm run dev` → http://localhost:3000.
3. Sign up as a freelancer → add a client → create a project → share the portal
   link + PIN.

---

## Known remaining gaps / next steps

- No production payment-provider integration — the webhook is a generic
  shared-secret endpoint meant to be called by a payment service.
- `ProjectHeader.tsx` also calls `useSearchParams` (fine today — only rendered
  on dynamic dashboard pages), but would need a Suspense boundary if it ever
  renders on a static page.
- The download gate + watermark logic could use end-to-end tests.
- Storage `deliverables-bucket` files are cleaned up on project delete; client
  delete cascades in DB.
