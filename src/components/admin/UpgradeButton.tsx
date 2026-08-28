"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  variant?: "default" | "outline" | "secondary";
  className?: string;
  size?: "default" | "sm" | "lg";
  text?: string;
}

export function UpgradeButton({
  variant = "default",
  className = "bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800",
  size = "default",
  text = "Upgrade to Pro — $9/mo",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to start checkout");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
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
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          Preparing checkout...
        </>
      ) : (
        <>
          <span>{text}</span>
          <ArrowRight className="ml-2 size-3.5" strokeWidth={2} />
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
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to open billing portal");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
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
      className={`border-zinc-200 text-[#151B45] hover:bg-zinc-100 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          Opening...
        </>
      ) : (
        <>
          <span>Manage subscription</span>
          <ArrowRight className="ml-1.5 size-3" />
        </>
      )}
    </Button>
  );
}
