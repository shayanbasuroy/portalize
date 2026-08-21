# Product Requirement Document (PRD): Zero-Login Client Portal SaaS

## 1. Executive Summary & Architecture Overview

This platform enables freelancers to aggregate deliverables (files, live site embeds, Figma designs, code snippets, and video updates) into a single, password-protected client dashboard. It eliminates client login friction while protecting freelancer work with a payment-gated download system.

### Core Tech Stack

- **Frontend & Backend:** Next.js (App Router, Server Components, Server Actions).
- **Styling & UI:** Tailwind CSS, `shadcn/ui` components, Lucide icons.
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth for freelancers).
- **File Storage:** Supabase Storage (Private Buckets with RLS policies and Signed URLs).
- **Code / Document Viewers:** `@monaco-editor/react` or `shiki` (for code), `@react-pdf-viewer` / native canvas (for PDFs), HTML5 video player with watermark overlays.

---

## 2. Database Schema & Security (Supabase)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. FREELANCERS (Extends auth.users)
create table public.freelancers (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  business_name text,
  logo_url text,
  brand_color text default '#3B82F6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CLIENTS
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  freelancer_id uuid references public.freelancers(id) on delete cascade not null,
  client_name text not null,
  company_name text,
  client_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROJECTS
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  freelancer_id uuid references public.freelancers(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  access_pin text not null, -- 4 to 6 digit security code
  payment_status text check (payment_status in ('unpaid', 'paid')) default 'unpaid',
  project_status text check (project_status in ('in_review', 'changes_requested', 'approved')) default 'in_review',
  watermark_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. DELIVERABLES
create table public.deliverables (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  deliverable_type text check (deliverable_type in ('file', 'link', 'code', 'embed')) not null,
  -- Storage path for files; external URL for links/embeds
  content_url text,
  -- Raw text storage for code snippets
  code_content text,
  code_language text default 'javascript',
  file_size text,
  mime_type text,
  status text check (status in ('pending', 'changes_requested', 'approved')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. FEEDBACK COMMENTS
create table public.feedback_comments (
  id uuid default uuid_generate_v4() primary key,
  deliverable_id uuid references public.deliverables(id) on delete cascade not null,
  sender_role text check (sender_role in ('freelancer', 'client')) not null,
  author_name text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

```

---

## 3. End-to-End User Workflows

### Workflow A: Freelancer Setup & Asset Upload

1. **Authentication:** Freelancer logs into dashboard (`/dashboard`) via Supabase Magic Link / Password.
2. **Client & Project Creation:**

- Navigates to `/dashboard/projects/new`.
- Selects or creates a Client (e.g., "Acme Corp").
- Enters Project Title ("Brand Identity & Website Code").
- App generates a unique slug (`[portal.domain.com/p/acme-brand-2026](https://portal.domain.com/p/acme-brand-2026)`) and auto-generates a 4-digit PIN (e.g., `8492`).

3. **Uploading Deliverables:**

- **File Upload:** Drag and drops assets (ZIP, PNG, PDF, MP4). Uploads go directly to Supabase Private Storage (`deliverables-bucket/{project_id}/{filename}`).
- **Code Snippet:** Pastes source code, selects syntax highlighting language (e.g., TypeScript, HTML, CSS).
- **External Links / Embeds:** Pastes URL (Figma file, Framer site, Loom video, Google Drive).

### Workflow B: Client Access & Zero-Login Portal

1. **Distribution:** Freelancer copies public link (`[portal.domain.com/p/acme-brand-2026](https://portal.domain.com/p/acme-brand-2026)`) and shares it alongside the PIN `8492`.
2. **Authentication Challenge:**

- Client opens URL $\rightarrow$ redirected to lightweight verification page.
- Enters 4-digit PIN.
- Next.js Middleware validates PIN against `projects.access_pin` and sets an HTTP-only session cookie (`client_session_{project_id}`).

3. **Portal Viewing Experience:**

- Client lands directly on dashboard. No email/password registration required.
- Displays freelancer's logo, project status badge, list of deliverables, and payment status banner.

### Workflow C: In-App File Viewing & Feedback Loop

1. **Interactive Previewers:**

- **Images / PDFs:** Native high-resolution canvas renderer. If `payment_status == 'unpaid'`, a semi-transparent repeating "PREVIEW ONLY - UNPAID" watermark overlay is rendered over the viewport.
- **Code:** Syntax-highlighted read-only editor with line numbering and copy protection if unpaid.
- **Embeds:** Sandboxed `<iframe>` for live prototypes or videos.

2. **Change Requests:**

- Client clicks "Request Changes" on any deliverable.
- A drawer opens allowing the client to enter detailed feedback.
- Submitting updates `deliverable.status = 'changes_requested'` and `project.project_status = 'changes_requested'`.
- Freelancer receives real-time email notification (via Resend API webhook).

3. **Approval / Mark as Done:**

- If satisfied, client clicks **"Approve Deliverable"** or **"Approve Entire Project"**.
- Updates status to `approved`.

### Workflow D: Payment Gating & Unlocked Downloads

```
[Client Portal] ──> Clicks "Download Asset"
        │
        ▼
[Next.js Server Action / Route Handler]
        │
        ├─► Query Database: Check project.payment_status
        │
        ├── IF payment_status == 'unpaid':
        │     └── REJECT: Return 403 HTTP Error ("Payment Required")
        │         Client UI shows modal: "Downloads locked until invoice is paid."
        │
        └── IF payment_status == 'paid':
              └── APPROVE: Generate Supabase Storage Signed Download URL (5-min expiry)
                  Direct file download triggers in client browser.

```

1. **Download Lock state:** While `payment_status == 'unpaid'`, all primary download buttons display a lock icon (`🔒 Download Locked`). Direct bucket URLs are never exposed in HTML source code.
2. **Unlocking:**

- **Manual Toggle:** Freelancer clicks "Mark as Paid" in their admin dashboard once payment is received via bank transfer, Stripe, cash, etc.
- **Webhook Trigger (Optional):** Stripe/Razorpay webhook updates `payment_status = 'paid'` automatically.

3. **Post-Payment State:** Portal updates in real-time via Supabase Realtime listeners. Watermarks disappear, and download buttons convert to high-speed signed download links.

---

## 4. Detailed Screen & UI Design System

```
┌────────────────────────────────────────────────────────────────────────┐
│ FREELANCER ADMIN DASHBOARD (/dashboard/projects/[id])                 │
├────────────────────────────────────────────────────────────────────────┤
│ Project: Acme Brand Identity            [ Payment Status: UNPAID ⚙️ ]  │
│ Portal Link: portal.app/p/acme-brand    Access PIN: [ 8 4 9 2 ] 📋   │
├────────────────────────────────────────────────────────────────────────┤
│ + Add Deliverable [File / Code / Embed]                               │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📁 Final_Logo_Pack.zip (File)       [ Status: Changes Requested ⚠️] │ │
│ │ 💻 NavbarComponent.tsx (Code)       [ Status: Approved ✅ ]         │ │
│ │ 🔗 Figma Prototype (Embed)          [ Status: Pending Review ]      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT PORTAL VIEW (/p/[slug])                                         │
├────────────────────────────────────────────────────────────────────────┤
│ Acme Corp x Freelancer Studio                                          │
│ ⚠️ Payment Pending: File downloads are locked until payment settles.  │
├────────────────────────────────────────────────────────────────────────┤
│ Deliverables (3)                                                       │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 💻 NavbarComponent.tsx (Code Snippet)                              │ │
│ │ ┌────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 1 │ export const Navbar = () => {                             │ │ │
│ │ │ 2 │   return <nav className="flex justify-between">...</nav>   │ │ │
│ │ └────────────────────────────────────────────────────────────────┘ │ │
│ │ [ 💬 Request Changes ]                      [ 🔒 Download Locked ] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📁 Final_Logo_Pack.zip                                             │ │
│ │ Preview: [ PREVIEW WATERMARK OVERLAY ]                             │ │
│ │ [ 💬 Request Changes ]                      [ 🔒 Download Locked ] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│                                           [ ✅ Approve Entire Project ]│
└────────────────────────────────────────────────────────────────────────┘

```

---

## 5. Next.js Implementation Details & Code Structure

### Next.js App Router Structure

```text
src/
├── app/
│   ├── (admin)/
│   │   └── dashboard/
│   │       ├── clients/
│   │       └── projects/
│   │           └── [id]/
│   │               └── page.tsx      # Freelancer management view
│   ├── (portal)/
│   │   └── p/
│   │       └── [slug]/
│   │           ├── page.tsx          # Public client dashboard
│   │           └── auth/
│   │               └── page.tsx      # PIN verification screen
│   └── api/
│       └── download/
│           └── route.ts              # Protected download stream route
├── components/
│   ├── previewers/
│   │   ├── CodeViewer.tsx            # Monaco / Shiki viewer
│   │   ├── DocViewer.tsx             # PDF / Image canvas viewer
│   │   └── EmbedViewer.tsx           # Sandboxed iframe viewer
│   └── portal/
│       ├── FeedbackDrawer.tsx        # Client comment component
│       └── WatermarkOverlay.tsx      # Visual watermark layer
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   └── server.ts                 # Server component client
│   └── security.ts                   # PIN hashing & session verification

```

### Server Route Handler for Secure Download Verification

```typescript
// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deliverableId = searchParams.get("deliverableId");
  const projectSlug = searchParams.get("slug");

  if (!deliverableId || !projectSlug) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = await createServerClient();

  // Fetch deliverable & parent project status
  const { data: deliverable, error } = await supabase
    .from("deliverables")
    .select("*, projects!inner(payment_status, access_pin, slug)")
    .eq("id", deliverableId)
    .single();

  if (error || !deliverable) {
    return NextResponse.json(
      { error: "Deliverable not found" },
      { status: 404 },
    );
  }

  // Security Verification: Check if payment status is paid
  if (deliverable.projects.payment_status !== "paid") {
    return NextResponse.json(
      {
        error:
          "Payment Required: Complete invoice payment to unlock downloads.",
      },
      { status: 402 },
    );
  }

  // Generate short-lived signed download URL from Supabase Storage
  const { data: signedUrlData, error: storageError } = await supabase.storage
    .from("deliverables-bucket")
    .createSignedUrl(deliverable.content_url, 60, { download: true });

  if (storageError || !signedUrlData) {
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 },
    );
  }

  // Redirect client to secure download stream
  return NextResponse.redirect(signedUrlData.signedUrl);
}
```

---

## 6. Non-Functional Requirements & Security Protocols

1. **Access Control:** Client sessions use HTTP-only, SameSite-strict cookies populated upon PIN validation. Access tokens are scoped strictly to the specific project ID.
2. **Rate Limiting:** The PIN verification endpoint (`/p/[slug]/auth`) enforces rate limiting (5 failed attempts per minute per IP) to prevent brute-force attacks on 4-digit PINs.
3. **Storage Isolation:** Storage buckets are set to `private`. Direct unauthenticated fetch requests return HTTP 403. Files can only be retrieved via server-side signed URLs generated after checking `payment_status == 'paid'`.
4. **Performance:** Light DOM layout loading under 1.2s. Code viewers lazy-load syntax engines to ensure instant initial client portal load times on mobile connections.

---

Here's the pitch in a nutshell:

**The problem:** Freelancers finish client work and then have to scatter deliverables across Google Drive links, email attachments, Slack threads, and Figma shares — with no unified place for clients to review, and no easy way to hold files hostage until they get paid.

**The idea:** A single-link, no-signup client portal. Freelancer sets up a project, gets a unique URL (`portal.app/p/acme-brand`) and a 4-digit PIN. They hand both to the client — no account creation, no password reset emails, no friction. The client enters the PIN, lands straight on a branded dashboard showing every deliverable in one place: files, code snippets (syntax-highlighted), embeds (Figma, Loom, live prototypes), all previewable in-browser.

**The hook — payment-gated downloads:** Until the freelancer marks the project "paid" (manually or via a Stripe/Razorpay webhook), everything is view-only. Images/PDFs get a watermark overlay, code is copy-protected, and download buttons show a lock icon. The moment payment lands, Supabase Realtime flips the UI live — watermarks vanish, locked buttons become real signed download links (5-minute expiry, so raw storage URLs never leak). It's essentially a built-in leverage mechanism: clients can look at the work, but can't walk away with the files until they pay.

**Feedback loop:** Clients can request changes per-deliverable (drawer with comments) or approve individual items / the whole project, triggering email notifications back to the freelancer.

**Stack:** Next.js App Router + Server Actions, Tailwind/shadcn, Supabase for everything backend (Postgres + RLS, private Storage buckets, Realtime, Auth for the freelancer side only — clients never touch Supabase Auth, just PIN-gated cookies).

Basically: Calendly-simple client experience, DocSend-style controlled viewing, with a payment trigger baked into the download flow instead of bolted on separately.
