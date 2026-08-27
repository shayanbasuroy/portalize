"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/app/actions/profile";
import { UpgradeButton, ManageBillingButton } from "@/components/admin/UpgradeButton";
import { ShieldCheck, Sparkles, Lock, Check } from "lucide-react";
import { toast } from "sonner";

interface FreelancerProfile {
  full_name: string;
  business_name: string | null;
  brand_color: string | null;
  logo_url: string | null;
  subscription_tier: string;
  subscription_status: string;
  customer_id: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-[#151B45] text-[#F8F7FC] hover:bg-zinc-800">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function SettingsForm({ profile }: { profile: FreelancerProfile }) {
  const [state, formAction] = useActionState(updateProfileAction, null);
  const searchParams = useSearchParams();
  const isPro = profile.subscription_tier === "pro";

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      toast.success("Welcome to Portalize Pro! Your unlimited access is active.");
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* Subscription & Plan Card */}
      <div className="border border-zinc-200 bg-white">
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium tracking-tight text-[#151B45]">
                  Subscription Plan
                </h2>
                <span
                  className={`inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                    isPro
                      ? "border-[#6C3FE8]/40 bg-[#6C3FE8]/10 text-[#6C3FE8]"
                      : "border-zinc-300 bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {isPro && <ShieldCheck className="size-3" />}
                  {isPro ? "Pro Plan — $19/mo" : "Free Plan"}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {isPro
                  ? "You have full unlimited access to all client portals, custom branding, and read receipts."
                  : "You are on the Free tier (1 active client portal, standard branding)."}
              </p>
            </div>

            <div className="shrink-0">
              {isPro ? (
                <ManageBillingButton />
              ) : (
                <UpgradeButton size="sm" />
              )}
            </div>
          </div>

          {!isPro && (
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <p className="text-xs font-medium text-zinc-700">Pro unlocks:</p>
              <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-zinc-600 sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Unlimited client portals
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Custom logo & brand accent colors
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Realtime read receipts & activity
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Priority support
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="border border-zinc-200 bg-white">
          {/* Profile */}
          <div className="space-y-4 p-6">
            <div>
              <h2 className="text-base font-medium tracking-tight text-[#151B45]">
                Profile
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Your name and business are shown on client portals.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name}
                required
              />
              {state?.fieldErrors?.full_name && (
                <p className="text-sm text-destructive">{state.fieldErrors.full_name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                name="business_name"
                defaultValue={profile.business_name ?? ""}
                placeholder="e.g. Studio North"
              />
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4 border-t border-zinc-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium tracking-tight text-[#151B45]">
                  Branding
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  These set the accents and logo on your portals.
                </p>
              </div>
              {!isPro && (
                <span className="inline-flex items-center gap-1 border border-[#6C3FE8]/30 bg-[#6C3FE8]/5 px-2 py-0.5 font-mono text-[10px] text-[#6C3FE8]">
                  <Lock className="size-3" />
                  PRO FEATURE
                </span>
              )}
            </div>

            {profile.logo_url && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.logo_url}
                  alt="Current logo"
                  className="h-12 w-12 border border-zinc-200 bg-white object-contain"
                />
                <span className="text-sm text-zinc-500">
                  Current logo — upload a new one to replace it.
                </span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="brand_color">Brand Color</Label>
                {!isPro && (
                  <span className="text-xs text-zinc-400">Upgrade to Pro to customize</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="brand_color"
                  name="brand_color"
                  type="color"
                  defaultValue={profile.brand_color ?? "#151B45"}
                  disabled={!isPro}
                  className={`h-10 w-16 p-1 ${isPro ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                />
                <span className="text-sm text-zinc-500">
                  {isPro
                    ? "Used for accents on client portals."
                    : "Default Portal Navy (Pro required for custom colors)."}
                </span>
              </div>
              {state?.fieldErrors?.brand_color && (
                <p className="text-sm text-destructive">{state.fieldErrors.brand_color[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="logo">Logo</Label>
                {!isPro && (
                  <span className="text-xs text-zinc-400">Upgrade to Pro to upload</span>
                )}
              </div>
              <Input
                id="logo"
                name="logo"
                type="file"
                disabled={!isPro}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className={!isPro ? "cursor-not-allowed opacity-60" : ""}
              />
              {!isPro && (
                <p className="text-xs text-zinc-500">
                  Custom branding is available on the Pro plan ($19/mo).
                </p>
              )}
            </div>
          </div>
        </div>

        {state?.error && (
          <div className="bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="bg-success/10 p-3 text-sm text-success">
            Profile updated successfully.
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
