import { Lock } from "lucide-react";

/**
 * Amber "payment pending" banner, matching the landing mockup's Fig. 01 —
 * a flat amber-tinted strip, not a card.
 */
export function PaymentBanner() {
  return (
    <div className="mx-5 border border-amber-200 bg-amber-50/60 px-4 py-3 sm:mx-6">
      <p className="flex items-center gap-2 text-[13px] text-amber-800">
        <Lock className="size-3.5 shrink-0" strokeWidth={2} />
        Payment pending — watermarked previews. Downloads unlock when the
        invoice clears.
      </p>
    </div>
  );
}
