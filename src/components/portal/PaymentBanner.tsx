import { Lock, ExternalLink } from "lucide-react";

interface PaymentBannerProps {
  invoiceUrl?: string | null;
  invoiceAmount?: string | null;
}

/**
 * Minimalist amber payment strip on the client portal.
 * If an invoice URL is configured, displays a sharp 1-click "Pay Invoice" CTA.
 */
export function PaymentBanner({ invoiceUrl, invoiceAmount }: PaymentBannerProps) {
  return (
    <div className="mx-5 border border-amber-200 bg-amber-50/60 p-4 sm:mx-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-amber-900">
            <Lock className="size-3.5 shrink-0" strokeWidth={2} />
            Payment Pending · Deliverables Locked
          </p>
          <p className="text-xs text-amber-800">
            Previews are watermarked. High-resolution downloads unlock immediately once the invoice is cleared.
          </p>
        </div>

        {invoiceUrl && (
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 border border-[#151B45] bg-[#151B45] px-4 py-2 font-mono text-xs text-[#F8F7FC] transition-colors hover:bg-zinc-800"
          >
            <span>Pay Invoice {invoiceAmount ? `(${invoiceAmount})` : ""}</span>
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
