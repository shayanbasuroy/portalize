# Changes

## 2026-08-21 — Landing page: visual mockups + bento grid

Reworked the landing page's two text-heavy sections into micro-UI mockups,
keeping the existing Minimalist Editorial system (Portal Navy/White/Purple,
hairline dividers, sharp corners, no shadows/gradients).

### Features → asymmetric bento grid
Replaced the 6 text rows with 4 flat cells on a `2 · 1 / 1 · 2` grid, ruled by
shared 1px hairlines:
1. **Every file previews in-browser** (span 2) — tabbed previewer
   (`Image · Figma · PDF · Video · Code`) + a photo gallery.
2. **Payment lock protection** (span 1) — watermarked photo preview + locked
   `deliverables.zip`.
3. **Read receipts** (span 1) — Portal Navy toast + activity trail.
4. **Zero client logins** (span 2) — "6 logins" vs "1 link + 4-digit PIN".

### How it works → 3-step visual flow
Replaced the 3 text rows with flat cells, each carrying a mini mockup:
1. **Upload & aggregate** — drag-drop zone + mixed file list
   (`brand-board.fig`, `hero-shot.png`, `case-study.pdf`).
2. **Share link & PIN** — URL bar + 4-digit PIN entry.
3. **Unlocked upon payment** — paid invoice → emerald "Download deliverables".

### Scroll reveal
- Added `src/components/landing/reveal.tsx` — a subtle 12px rise + fade on
  scroll (`motion` `whileInView`, `once: true`).
- Wrapped the page in `<MotionConfig reducedMotion="user">` so SSR output stays
  consistent — fixes a hydration mismatch for users with macOS Reduce Motion.

### Copy
- Diversified example deliverables to speak to all freelancer types (design,
  photo, writing, video) rather than code-only examples.

## 2026-08-22 — Hardening + auth + PIN + read receipts

### Auth
- **Magic-link login** — `/login` now has a "magic link" mode
  (`magicLinkAction`); existing users only, no auto-create.
- **Password reset** — new `/forgot-password` + `/update-password` pages
  (`forgotPasswordAction` / `updatePasswordAction`), with anti-enumeration
  messaging.

### PIN / session security
- **Signed session token** — the portal session cookie is now an HMAC-signed,
  expiring token (`src/lib/session.ts`), verified in the proxy, portal page,
  actions, and `/api/download` (was a forgeable `'verified'` string).
- **PIN visible on dashboard** — the client's 4-digit PIN is now shown and
  copyable on the freelancer's project dashboard, with a "Regenerate" button.
  Plaintext lives in a freelancer-only `project_pins` table; `projects.access_pin`
  stays hashed for the client check.

### Features
- **Watermark toggle** — "Watermark previews" on/off per project.
- **Granular + realtime read receipts** — new `deliverable_previewed` events
  (logged when a client's portal renders a deliverable) and a live-updating
  Activity feed (Supabase Realtime).
- **Serverless-safe rate limiting** — `pin_attempts` table (DB-backed) with an
  in-memory fallback.

### Migrations
- `004_pin_attempts.sql` — rate-limit table.
- `005_deliverable_previewed.sql` — adds the `deliverable_previewed` event type.
- `006_project_pins.sql` — plaintext PIN store (freelancer-only RLS).

### Supabase-side steps (manual, done by user)
- Apply migrations `004`/`005`/`006`.
- Configure SMTP + redirect URLs (`/auth/callback`, `/update-password`) for
  magic-link / reset emails.

## 2026-08-22 — Bug fixes, security lockdown, performance

### Critical fixes
- **Project detail 404** — `dashboard/projects/[id]` read `params.id`
  synchronously; Next 16 made `params` a Promise, so it was `undefined` and the
  page always `notFound()`'d. Now `await params`.
- **Portal branding was broken** — the portal read `freelancers(*)` through the
  anon role (no anon policy on that table → `null`), so every portal showed
  fallback branding. Portal reads now use the service role.
- **Anonymous RLS leak** — anon could read `projects` (hashed `access_pin`),
  `deliverables` (`code_content`), `feedback_comments`, and `activity_events`
  directly via the REST API, bypassing the PIN. `007_security_lockdown.sql`
  drops those policies; portal reads + actions moved to the service role.
- **File upload 500** — Server Action body limit was the 1MB default; raised
  `serverActions.bodySizeLimit` + `proxyClientMaxBodySize` to 50MB.
- **Code deliverable download 500** — `code` rows have no `content_url`, so
  `/api/download` signed a null path. It now streams `code_content` as a file
  (with language → extension mapping).
- **Payment/watermark flapping** — toggles read the status from a
  client-provided hidden input (stale after re-renders). They now read the
  authoritative value from the DB, so they only flip on an explicit press.

### Performance
- Proxy session check switched from `getUser()` (network) to `getSession()`
  (local JWT decode) — removes a round-trip from every navigation.
- `createClient` + `getCurrentUser` memoized with React `cache()` (one
  `getUser()` per request instead of ~7).
- Dashboard collapsed 6 queries into a single parallel round-trip.
- Proxy matcher narrowed to only auth-relevant routes.

### UX
- Portal lost Realtime (anon read was removed for security); restored live
  updates via a 20s `router.refresh()` poll.
- Fixed deliverable feedback-count key; added empty-clients hint on New Project.

### Migration
- `007_security_lockdown.sql` — drops anon policies (applied via
  `supabase db query --linked`). Note: `supabase db push` fails on `003`
  ("already exists") because `003`–`006` were applied out-of-band; use the SQL
  editor to apply migrations to a fresh project.

## 2026-08-27 — Domain setup, feedback viewer, aesthetic loading & build stability

### Custom Domain & Visual Polish
- **`portalize.site` integration** — updated mock URLs, browser previews, and figure components from `portalize.app` to the active production domain `portalize.site`.
- **JSX & React 19 fixes** — resolved unescaped quotes in `features.tsx`, and converted synchronous dialog state setters inside `useEffect` (`AddClientDialog`, `ClientActions`) to deferred updates to eliminate React compiler warnings.

### Freelancer Feedback & Change Request Viewer
- **Interactive Feedback Dialog** — the deliverable feedback count button on `/dashboard/projects/[id]` is now an interactive trigger opening a detailed modal showing client comment history (author name, client/freelancer badge, formatted timestamp, and comment text).
- **"Read Feedback" Callout** — when a deliverable has status `changes_requested`, a prominent amber button appears so freelancers immediately see what revisions were requested.

### Streaming Loading UI & Performance
- **Root & Dashboard Loading (`loading.tsx`)** — created full-page streaming skeletons for root, `/dashboard`, and `/p/[slug]` with the signature Portalize "P" tile, pulse animations, and layout-matched placeholders to eliminate perceived freezing during data fetches.
- **Indeterminate Progress Animation** — added `@keyframes indeterminate` in `globals.css` for hairline progress rules.

### PDF & Build Stabilization
- **Canvas-only PDF Previews** — optimized `DocViewer.tsx` to use pure canvas rendering with safe CDN worker loading, preventing PostCSS / CSS loader panics on Turbopack/Next 16 while enforcing anti-copy protection on unpaid deliverables.
- **Production Build Script** — configured `package.json` build to `next build --webpack` for deterministic, reliable builds across all hosts.

## 2026-08-27 (Session 2) — Polish, UX fixes & performance

### Loading Screen
- **Animated Portalize Logo** — replaced the plain "P" text tile in `app/loading.tsx` with the actual `icon.png` logo, wrapped in a rounded elevated tile with an ambient purple ping ring, smooth pulse, and a Portal Navy indeterminate progress rule underneath.

### Freelancer Dashboard
- **1-click portal preview** — added an "Open" button with an external-link icon next to the copy button in `ProjectHeader.tsx` so freelancers can instantly open the client-facing portal in a new tab without copying and pasting the URL.

### Deliverable Form UX
- **Auto-reset on success** — `FileUploader.tsx`, `CodeSnippetForm.tsx`, and `LinkEmbedForm.tsx` now automatically clear their inputs and reset the form after a successful submission, preventing stale values when adding multiple deliverables in sequence.
- **Drag-and-drop file binding fix** — `FileUploader.tsx` now correctly binds dragged files to the native file input element (via `inputRef.current.files`), so dropped files are actually submitted with the Server Action form instead of only updating the preview UI.
- **Submit button styling** — all three forms now use consistent `bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800` button styles to match the rest of the app.

### Client Portal
- **Feedback drawer button fallback** — the "Submit Feedback" button in `FeedbackDrawer.tsx` now has a solid fallback class (`bg-[#151B45]`) in addition to `var(--brand-color, #151B45)`. This ensures correct contrast inside base-ui portals rendered outside the CSS variable scope of the inner layout wrapper.

### Landing Page — Features Section Performance
- **Shared inView trigger** — rewired all animation logic inside the features bento cells (`WatermarkPreview`, `ReadReceiptToast`, `LoginComparison`) to fire from a single `useInView` observer on the parent `Bento` cell (via React Context), instead of each internal element registering its own independent `whileInView` / `IntersectionObserver`.
- **Eliminated stacked trigger delay** — previously, entering a cell caused a cascade of separate viewport callbacks at `-40px` margins each, making mockup animations trickle in over ~800ms. Now all child animations receive the same `inView` signal simultaneously and complete within ~400ms of the cell entering view.
- **Tighter animation values** — reduced internal stagger delays (max 0.38s), travel distances, and spring stiffness tuned for a snappier, more confident feel without losing the premium quality of the motion.

### Favicon & Branding
- **Custom Portalize Favicon** — replaced the default Vercel/Next.js favicon with the official Portalize icon (`icon.png`), updating `/public/favicon.ico`, `/src/app/favicon.ico`, and `/src/app/icon.png` along with full `metadata.icons` definitions in `src/app/layout.tsx`.

## 2026-08-27 (Session 3) — Dodo Payments SaaS Subscriptions & Hard Tier Enforcement

### Dodo Payments Integration
- **SDK & Client Setup** — installed `dodopayments` SDK and configured `src/lib/dodo.ts` with test mode environment and product ID mapping.
- **Portalize Pro Product Created** — created the official "Portalize Pro" ($19/mo recurring SaaS subscription) in Dodo Payments test mode (`pdt_0NmHjRgnGankECp1XlRFW`).
- **Server Actions (`src/app/actions/billing.ts`)**:
  - `createUpgradeCheckoutAction`: creates a Dodo hosted checkout session with metadata and customer info.
  - `createCustomerPortalAction`: creates a Dodo Customer Portal session for subscribers to manage payment methods and cancellation.
- **Webhook Handler (`src/app/api/webhooks/dodo/route.ts`)**:
  - Validates Dodo webhook signatures with `dodo.webhooks.unwrap()`.
  - Handles `subscription.active`, `subscription.renewed`, `subscription.plan_changed` (grants Pro).
  - Handles `subscription.cancelled`, `subscription.expired`, `subscription.failed`, `subscription.on_hold` (reverts to Free).

### Hard Server-Side Tier Enforcement
- **Database Schema (`008_subscriptions.sql`)** — added `subscription_tier`, `subscription_id`, `customer_id`, and `subscription_status` columns to `public.freelancers` with index.
- **Project Limit Enforcement (`src/app/actions/projects.ts`)** — Free tier is strictly limited to 1 active project on the database level. Any server action call to create a 2nd project returns `{ error: "Free tier is limited to 1 client portal. Upgrade to Pro for unlimited client portals." }`.
- **Branding Enforcement (`src/app/actions/profile.ts`)** — custom logo uploads are strictly rejected on the server if the user is on the Free tier.

### UI & Paywall Gating
- **Dashboard (`/dashboard`)** — displays dynamic `Free Plan` vs `Pro Plan` badge in the header, plus an upgrade banner for free users.
- **New Project Paywall (`/dashboard/projects/new`)** — when a free user reaches the 1-portal limit, the creation form is replaced with a clear, high-conversion Upgrade to Pro card.
- **Settings & Billing (`/dashboard/settings`)** — added Subscription Plan card with dynamic Upgrade CTA / Manage Billing buttons, plus Pro feature badges on custom logo & brand color pickers.

## 2026-08-27 (Session 4) — Subscription UI: Minimalist Editorial Redesign

Completely removed generic AI-slop styling (purple `#6C3FE8` backgrounds, `Sparkles` icons, bubbly `rounded-xl` cards) from all four subscription/upgrade UI surfaces. Every surface now strictly adheres to the Portalize Minimalist Editorial design system.

### `src/components/admin/UpgradeButton.tsx`
- Removed `Sparkles` icon; replaced with clean `ArrowRight` on all CTA buttons.
- `UpgradeButton`: Portal Navy `bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800`, accepts a `text` prop for copy variation.
- `ManageBillingButton`: clean `border-zinc-200 text-[#151B45] hover:bg-zinc-100` outline button.
- Both buttons display loading state with spinner and descriptive copy.

### `src/app/(admin)/dashboard/page.tsx`
- **Plan banner**: replaced purple glowing box with a clean `border border-zinc-200 bg-white p-5` strip.
- Uses monospace spec label `PLAN INDEX · FREE TIER` and bracket notation `[1/1 portal created]`.
- **Header badge**: replaced purple `ShieldCheck` badge with a minimal monospace `[Free]` / `[Pro]` text indicator.
- Removed unused `Sparkles` and `ShieldCheck` imports.

### `src/app/(admin)/dashboard/projects/new/page.tsx`
- **Paywall card**: replaced purple-bordered card with `border border-zinc-200 bg-white p-8`.
- Header uses monospace `Plan Index · Limit Reached` spec label and `[1/1 used]` bracket counter.
- Feature list uses hairline `h-px w-3 bg-zinc-300` dashes instead of green `Check` icons.
- Actions row: two-column layout with Navy `UpgradeButton` and ghost `View existing projects` link.
- Removed unused `Sparkles`, `ArrowLeft`, `Check` imports.

### `src/components/admin/SettingsForm.tsx`
- **Subscription card**: replaced purple badge and check-grid with a bordered card matching Profile/Branding section structure.
- `SUBSCRIPTION` monospace label in the header; `[Active]` / `[Free]` bracket state.
- Feature list uses hairline dashes rendered from a map (DRY, consistent with new project paywall).
- Upgrade / Manage Billing buttons placed at the bottom of the card body above a `border-t border-zinc-100` divider.
- Removed unused `ShieldCheck`, `Sparkles`, `Check` imports.

## 2026-08-28 (Session 7) — Conversion Levers: Payment Link & Instant Read-Receipt Email Notifications

### Direct Invoice / Payment Link on Locked Client Portals
- **Database Schema (`009_project_invoice_link.sql`)**:
  - Added `invoice_url` and `invoice_amount` columns to `public.projects` (applied to live Supabase DB).
- **Freelancer Dashboard (`ProjectHeader.tsx` & `InvoiceSettingsDialog.tsx`)**:
  - Added `InvoiceSettingsDialog` allowing freelancers to attach or edit their Stripe Payment Link, PayPal, Wise, or invoice URL and optional amount (e.g. `$1,500`).
  - Added `updateProjectInvoiceAction` in `src/app/actions/projects.ts`.
  - Updated `NewProjectForm.tsx` to accept optional invoice link during project creation.
- **Client Portal (`PaymentBanner.tsx` & `PortalView.tsx`)**:
  - Updated `PaymentBanner` to display a sharp, branded 1-click **"Pay Invoice ($X,XXX) ↗"** CTA button linking directly to the freelancer's payment link.
  - Added payment link shortcut in the portal sidebar under payment status.
  - Added viral product-led growth (PLG) footer badge (`"Delivered with Portalize · Private client delivery for freelancers"`).

### Instant Read-Receipt Email Notification
- **Email Service (`src/lib/email.ts`)**:
  - Added `sendPortalOpenedNotification`: triggers an email to the freelancer the instant a client unlocks their portal with their 4-digit PIN.
  - Added `sendDeliverablePreviewedNotification`: triggers an email when a specific deliverable is rendered.
  - Styled with Swiss Minimalist HTML templates (`#151B45` Portal Navy headers, monospace timestamps, hairline rules).
- **Portal Auth Action (`src/app/actions/portal.ts`)**:
  - Connected `sendPortalOpenedNotification` into `verifyPinAction`.


## 2026-08-28 (Session 8) — Pricing, Subscription Fixes & PLG Viral Loop

### Pricing: Pro Plan lowered to $9/mo
- Created a new Dodo Payments product (`pdt_0NmM4RQAbeRxp5dRQUp7O`) priced at $9.00/mo recurring.
- Updated all pricing references from $19 → $9 across:
  - `src/components/landing/pricing.tsx`
  - `src/components/admin/UpgradeButton.tsx`
  - `src/app/(admin)/dashboard/page.tsx`
  - `src/app/(admin)/dashboard/projects/new/page.tsx`
  - `src/components/admin/SettingsForm.tsx`
  - `src/lib/dodo.ts` (default product ID updated)

### False-Positive Upgrade Toast Fix
- **`src/components/admin/SettingsForm.tsx`**: Fixed a bug where the "Welcome to Portalize Pro!" success toast fired even when payment was cancelled or failed.
  - Now verifies `profile.subscription_tier === 'pro'` before showing the success toast.
  - Shows a descriptive error toast if payment was not completed.
  - Clears `?upgraded=true` query param from the URL via `window.history.replaceState` after reading it, preventing the toast from re-firing on page reload.

### PLG Viral Loop — Post-Approval Client Banner
- **`src/components/portal/PortalView.tsx`**: Added a subtle product-led growth referral strip that appears at the bottom of the deliverables panel when a client approves a project.
  - Shows: "Project approved · Deliver your own client projects with Portalize free →" linking to portalize.site.
  - Styled to the Minimalist Editorial system: `bg-zinc-50/70`, `border-zinc-200`, `font-mono text-[11px]`, no popups or modal interruptions.
  - Only visible post-approval — non-intrusive during active client review.

### Landing Page Copy & Interactive Demo (Attempted — Reverted)
The following changes were implemented then reverted at user request (commit `89b099b`):
- **`src/components/landing/hero.tsx`**: Rewrote headline to "Stop sending Google Drive links. / Never get ghosted on final invoices." with updated emotional sub-copy and CTA.
- **`src/components/landing/features.tsx`**: Rewrote all 4 bento card titles to lead with emotional outcomes ("Never get ghosted on final invoices", "Know the exact minute they open it", "No passwords. 1 link + 4-digit PIN").
- **`src/components/landing/problem.tsx`**: Rewrote Before/After items with high-converting freelancer trauma triggers (17-email thread, expired WeTransfer, ghosted 50% invoice, timestamped receipts).
- **`src/components/landing/interactive-hero-demo.tsx`** (created then deleted): Full interactive client portal sandbox — on-screen PIN keypad, live payment unlock toggle, watermark simulation, realtime activity feed mockup.
- All 4 landing page changes were reverted; original design restored. The PLG banner on `PortalView.tsx` was retained.

## 2026-09-01 (Session 9) — Launch Readiness: Top-Level SEO, Domain Redirection, Empty States & Legal

### Comprehensive Search Engine Optimization (SEO)
- **`src/app/robots.ts`**: Generated dynamic `/robots.txt` granting search engine crawlers access to public routes while protecting internal dashboard, auth, and API routes.
- **`src/app/sitemap.ts`**: Generated dynamic `/sitemap.xml` with priority weighting, change frequencies, and last-modified timestamps for all public pages.
- **JSON-LD Schema Markup (`src/components/landing/json-ld.tsx`)**:
  - Implemented `SoftwareApplication` structured schema with tier pricing specification, description, and author organization.
  - Implemented `FAQPage` structured schema indexing all pre-expanded FAQ questions and answers directly for Google rich snippets.
- **Metadata, Social & Canonicals (`src/app/layout.tsx`, `(auth)/login/layout.tsx`, `(auth)/signup/layout.tsx`, `privacy/page.tsx`, `terms/page.tsx`)**:
  - Configured `metadataBase` with `https://portalize.site`.
  - Added strict `alternates.canonical` across all pages to prevent duplicate index penalties.
  - Added targeted freelancer keyword cluster.
  - Added OpenGraph and Twitter card summary metadata with 1200x630px social image (`/og-image.png`).

### Domain & Redirect Rules (`next.config.ts`)
- Configured permanent (308) redirect from `www.portalize.site` to the apex canonical domain `https://portalize.site`.

### Onboarding Empty States (Item 8)
- **`/dashboard` (`src/app/(admin)/dashboard/page.tsx`)**: Replaced plain single-line text with an editorial dashed onboarding card featuring an icon tile, descriptive copy, and a 1-click `"Create your first portal"` CTA.
- **`/dashboard/projects` (`src/app/(admin)/dashboard/projects/page.tsx`)**: Upgraded empty state to match the same high-conversion onboarding card.

### Landing Page Call to Action & Pricing Note (Items 10 & 2)
- **`src/components/landing/cta.tsx`**: Upgraded CTA section with high-converting urgency copy (*"Your next client delivery is one portal away"*), `"Start for free — 2 minutes"` CTA button, and a 4-item trust badge row (Free plan, $9/mo Pro, cancel anytime, multi-device support).
- **`src/components/landing/pricing.tsx`**: Eliminated CountUp $0 flash bug by rendering static `$9`, and clarified *"Starter is free forever, no credit card required"*.
- **`src/components/landing/faq.tsx`**: Converted accordion to multi-open and pre-expanded critical answers (unlock timing, watermarking, cancellation).
- **Legal Pages (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/components/landing/footer.tsx`)**: Created clean Privacy Policy and Terms of Service pages and linked them in the footer.
