# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelancers of any discipline (designers, developers, writers, video editors —
deliberately category-agnostic) who deliver digital work to clients and need a
professional, low-friction way to hand that work over and get paid.

Primary job: finish a client deliverable, put every piece of it in one branded
place the client can review without signing up, collect feedback/approval, and
unlock the final files only once payment lands.

Clients are the secondary audience: non-technical decision-makers at small
companies who want to review work, leave comments, and approve — with zero
accounts or passwords.

## Product Purpose

Portalize gives freelancers a private, zero-login client portal per project. A
freelancer sets up a client and project, uploads deliverables (files, code
snippets, links/embeds), and shares a single URL plus a 4-digit PIN. The client
enters the PIN and lands on a branded dashboard showing every deliverable,
previewable in-browser. Success = the client reviews and approves the work, and
the freelancer gets paid before the raw files leave the portal.

## Positioning

The mechanism a neighboring product could not truthfully copy: **payment-gated
downloads are the product's leverage, not an add-on.** Clients can view
everything (watermarked / copy-protected while unpaid) but the download buttons
stay locked until the freelancer marks the project paid — manually or via a
payment webhook — at which point Supabase Realtime flips the portal live:
watermarks vanish and buttons become signed download links.

Framing from the PRD: "Calendly-simple client experience, DocSend-style
controlled viewing, with a payment trigger baked into the download flow instead
of bolted on separately."

## Operating Context

- Freelancer works on desktop in the admin dashboard (`/dashboard`); manages
  clients, projects, deliverables, and payment status there.
- Client opens the shared link on any device, enters the PIN, and uses the
  portal (`/p/[slug]`). No email/password, no Supabase Auth for clients — a
  PIN-validated HTTP-only cookie scopes the session.
- Deliverable types: file (image/PDF/zip/other), code snippet, external link,
  embedded live work (Figma, Loom, live prototypes).
- Payments are typically received out-of-band (bank transfer, cash, Stripe,
  Razorpay). The freelancer flips "Mark as Paid" in the dashboard; an optional
  webhook automates this.
- Notifications: feedback/approvals email the freelancer via Resend (opt-in).

## Capabilities and Constraints

**Confirmed functionality**

- Two-sided product: freelancer admin dashboard + zero-login client portal.
- Clients & projects; each project gets a unique slug and a 4-digit PIN.
- Four deliverable types (file, code, link, embed) with in-browser previewers:
  images, PDFs, syntax-highlighted code (read-only), sandboxed embeds.
- Watermark overlay on files/code while unpaid (per-project `watermark_enabled`).
- Download gate: `/api/download` returns 402 unless `payment_status = 'paid'`;
  signed download URLs (5-min expiry); raw private-bucket URLs never exposed.
- Manual "Mark as Paid" toggle and an optional payment webhook
  (`POST /api/webhooks/payment`, shared-secret guarded).
- Realtime: payment/status changes update the open portal live.
- Feedback loop: per-deliverable change requests, approve deliverable / approve
  whole project; email notifications to the freelancer.
- PIN security: SHA-256 hashed PINs, rate-limited (5 failed attempts/min/IP),
  HTTP-only SameSite=strict session cookie.
- Freelancer branding: name, business name, brand color, logo (public
  `brand-assets` bucket) shown on portals.

**Technical constraints**

- Next.js App Router, Server Components + Server Actions, React 19.
- Supabase: Postgres + RLS, Supabase Auth (freelancers only), private Storage
  buckets, Realtime; service-role key used server-side.
- shadcn/ui on `@base-ui/react`; Tailwind CSS v4; zod validation.
- This version of Next.js has breaking changes (see `AGENTS.md`): `proxy`
  replaces `middleware`, `useActionState` replaces `useFormState`, server
  actions bound to forms must return `void`.

**Undecided / in flux (not fabricated)**

- Pricing tiers and their feature limits (model confirmed as free + paid tiers,
  but the tiers themselves are not designed).
- Production payment-provider integration (Stripe/Razorpay signature
  verification replacing the shared-secret webhook) is not wired.
- Whether portals/portal links support custom domains.

## Brand Commitments

- Product name **"Portalize" is final** (user-confirmed).
- No other binding brand commitments. The logo chip ("P" tile) and wordmark used
  on the landing/auth pages are working sketches, not binding. Brand color per
  freelancer is a product feature, not a brand commitment.
- Landing-page claim "Start free" reflects the confirmed free + paid-tier model.

## Evidence on Hand

- `prd.md` — the source PRD (product pitch, workflows, schema, screen mockups).
- `README.md`, `.env.local.example`, `changes.md` — setup and change history.
- Incumbent visual implementation exists (landing page, auth pages, admin
  dashboard, client portal) — treated as evidence of the current world, not a
  committed design system (no DESIGN.md yet).
- No real testimonials, customer names, case studies, pricing pages, or
  press/assets exist. Future work must not fabricate these.

## Product Principles

1. **Zero-login is the core promise.** Clients never create accounts or reset
   passwords; a link + PIN is the whole experience.
2. **Protect the work until paid.** Controlled viewing (watermark, copy
   protection) plus payment-gated downloads is the product's hook and leverage.
3. **One branded place for everything.** All deliverable types live in a single
   portal that looks like the freelancer's brand.
4. **Unlock must be instant and invisible.** The moment payment lands, the
   portal flips live with no client action — manual toggle and webhook both
   feed the same Realtime path.
5. **Freelancer always in control.** Automation (webhook, email) is additive;
   the manual "Mark as Paid" path always works.
