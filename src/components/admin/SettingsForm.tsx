"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/app/actions/profile";

interface FreelancerProfile {
  full_name: string;
  business_name: string | null;
  brand_color: string | null;
  logo_url: string | null;
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

  return (
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
          <div>
            <h2 className="text-base font-medium tracking-tight text-[#151B45]">
              Branding
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              These set the accents and logo on your portals.
            </p>
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
            <Label htmlFor="brand_color">Brand Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="brand_color"
                name="brand_color"
                type="color"
                defaultValue={profile.brand_color ?? "#151B45"}
                className="h-10 w-16 cursor-pointer p-1"
              />
              <span className="text-sm text-zinc-500">
                Used for accents on client portals.
              </span>
            </div>
            {state?.fieldErrors?.brand_color && (
              <p className="text-sm text-destructive">{state.fieldErrors.brand_color[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
            />
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
  );
}
