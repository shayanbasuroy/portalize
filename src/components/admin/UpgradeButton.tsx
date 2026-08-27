"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createUpgradeCheckoutAction, createCustomerPortalAction } from "@/app/actions/billing";
import { Loader2, Sparkles, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  variant?: "default" | "outline" | "secondary";
  className?: string;
  size?: "default" | "sm" | "lg";
  text?: string;
}

export function UpgradeButton({
  variant = "default",
  className = "bg-[#6C3FE8] text-white hover:bg-[#582ed1]",
  size = "default",
  text = "Upgrade to Pro — $19/mo",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await createUpgradeCheckoutAction();
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleUpgrade}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing checkout...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          {text}
        </>
      )}
    </Button>
  );
}

export function ManageBillingButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    try {
      setLoading(true);
      const res = await createCustomerPortalAction();
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to open billing portal");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleManage}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          Opening billing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-3.5 w-3.5" />
          Manage Billing
        </>
      )}
    </Button>
  );
}
