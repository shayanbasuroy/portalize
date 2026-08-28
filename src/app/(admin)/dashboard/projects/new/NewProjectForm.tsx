"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProjectAction } from "@/app/actions/projects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating Project..." : "Create Project"}
    </Button>
  );
}

export function NewProjectForm({ clients }: { clients: { id: string, client_name: string }[] }) {
  const [state, formAction] = useActionState(createProjectAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="client_id">Select Client *</Label>
        <Select name="client_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select an existing client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.fieldErrors?.client_id && (
          <p className="text-sm text-destructive">{state.fieldErrors.client_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input id="title" name="title" required placeholder="e.g. Website Redesign" />
        {state?.fieldErrors?.title && (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="border-t border-zinc-100 pt-4 space-y-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            Payment Lock (Optional)
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Attach a payment link to display a &ldquo;Pay Invoice&rdquo; button on locked deliverables.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="invoice_url" className="text-xs text-zinc-600">
              Payment Link URL
            </Label>
            <Input
              id="invoice_url"
              name="invoice_url"
              type="url"
              placeholder="https://buy.stripe.com/..."
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invoice_amount" className="text-xs text-zinc-600">
              Invoice Amount
            </Label>
            <Input
              id="invoice_amount"
              name="invoice_amount"
              type="text"
              placeholder="$1,500 USD"
              className="text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
