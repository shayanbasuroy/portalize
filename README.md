# Portalize

Client portals for freelancers. Share deliverables with each client through a
private, zero-login portal — a unique link plus a 4-digit PIN. Clients preview
files and code, leave feedback, and approve the final work. Downloads unlock
once payment clears.

## Features

- **Clients & projects** — organize work per client, each project gets a
  `[unique-slug]` and PIN.
- **Deliverables** — upload files, paste code snippets, or share links/embeds.
- **Watermarked previews** — files and code render in the browser (with a
  watermark while unpaid); raw downloads are payment-gated.
- **Zero-login client portal** — `/p/[slug]` + PIN, no account required.
- **Feedback loop** — clients request changes or approve deliverables; you get
  email notifications (opt-in via Resend).
- **Payment gating** — mark a project paid in the dashboard or via the payment
  webhook; the portal unlocks downloads live (Realtime).

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Supabase** (Postgres + RLS, Auth, private Storage, Realtime)
- **shadcn/ui** on `@base-ui/react`
- **Tailwind CSS v4**, React 19, Zod

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and apply the migrations in `supabase/migrations/`
   (via the SQL editor or `supabase db push`).

3. Configure environment variables — copy `.env.local.example` to `.env.local`
   and fill in your Supabase URL, anon key, and service role key.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000, sign up as a freelancer, add a client and a
   project. Share the portal link + PIN with your client.

## Key environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-side admin (file previews, email, webhook) |
| `NEXT_PUBLIC_APP_URL` | — | Base URL for portal links (default `http://localhost:3000`) |
| `RESEND_API_KEY` | — | Email notifications (change requests, approvals) |
| `RESEND_FROM_EMAIL` | — | Sender for those emails |
| `WEBHOOK_SECRET` | — | Guards `POST /api/webhooks/payment` |

## Payment webhook

Once an invoice clears (bank transfer, Stripe, Razorpay, cash), mark the
project paid:

```bash
curl -X POST https://your-app.com/api/webhooks/payment \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $WEBHOOK_SECRET" \
  -d '{"projectId": "<project-uuid>"}'
```

For a production payment provider, swap the shared-secret check for the
provider's signature verification (e.g. Stripe's `constructEvent`).

## Project structure

- `src/app/(admin)/` — freelancer dashboard (dashboard, projects, clients, settings)
- `src/app/(portal)/p/[slug]/` — client portal (PIN auth, deliverables, feedback)
- `src/app/actions/` — server actions (auth, clients, projects, deliverables, portal, profile)
- `src/app/api/` — route handlers (download, webhooks/payment, auth callback)
- `src/components/admin|portal|previewers/` — UI components
- `src/lib/` — supabase clients, security (PIN), rate limiting, email, URL helpers
- `supabase/migrations/` — database schema + storage buckets
