"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProjectInvoiceAction } from "@/app/actions/projects";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InvoiceSettingsDialogProps {
  projectId: string;
  initialInvoiceUrl?: string | null;
  initialInvoiceAmount?: string | null;
}

export function InvoiceSettingsDialog({
  projectId,
  initialInvoiceUrl,
  initialInvoiceAmount,
}: InvoiceSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(initialInvoiceUrl || "");
  const [invoiceAmount, setInvoiceAmount] = useState(initialInvoiceAmount || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("id", projectId);
    formData.append("invoice_url", invoiceUrl);
    formData.append("invoice_amount", invoiceAmount);

    try {
      const res = await updateProjectInvoiceAction(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Invoice payment link updated");
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update invoice link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="h-7 border-zinc-200 font-mono text-[11px] text-[#151B45] hover:bg-zinc-100" />
        }
      >
        <CreditCard className="mr-1.5 size-3" />
        {initialInvoiceUrl ? "Edit Payment Link" : "Add Payment Link"}
      </DialogTrigger>

      <DialogContent className="border border-zinc-200 bg-white p-6 sm:max-w-[440px]">
        <DialogHeader className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Project Settings
          </p>
          <DialogTitle className="text-lg font-medium tracking-tight text-[#151B45]">
            Client Payment / Invoice Link
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-zinc-500">
          Add your Stripe Payment Link, PayPal, Wise, or invoice URL. A direct &ldquo;Pay Invoice&rdquo; button will appear on the client&apos;s locked portal screen.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="invoice_url" className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
              Payment Link / URL
            </Label>
            <Input
              id="invoice_url"
              name="invoice_url"
              type="url"
              placeholder="https://buy.stripe.com/..."
              value={invoiceUrl}
              onChange={(e) => setInvoiceUrl(e.target.value)}
              className="border-zinc-200 font-mono text-xs focus:border-[#151B45]"
            />
            <p className="text-[11px] text-zinc-400">
              e.g. Stripe Payment Link, PayPal.me, or QuickBooks invoice link.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice_amount" className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
              Invoice Amount (Optional)
            </Label>
            <Input
              id="invoice_amount"
              name="invoice_amount"
              type="text"
              placeholder="$1,500 USD"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              className="border-zinc-200 font-mono text-xs focus:border-[#151B45]"
            />
            <p className="text-[11px] text-zinc-400">
              Displayed inside the button (e.g. &ldquo;Pay Invoice ($1,500)&rdquo;).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="border-zinc-200 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#151B45] text-xs text-[#F8F7FC] hover:bg-zinc-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Payment Link"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
