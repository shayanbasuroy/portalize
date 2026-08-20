"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientAction } from "@/app/actions/clients";
import { Plus } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Adding..." : "Add Client"}
    </Button>
  );
}

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createClientAction, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="w-4 h-4 mr-2" />
        Add Client
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name *</Label>
            <Input id="client_name" name="client_name" required />
            {state?.fieldErrors?.client_name && (
              <p className="text-sm text-destructive">{state.fieldErrors.client_name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_email">Client Email *</Label>
            <Input id="client_email" name="client_email" type="email" required />
            {state?.fieldErrors?.client_email && (
              <p className="text-sm text-destructive">{state.fieldErrors.client_email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name (Optional)</Label>
            <Input id="company_name" name="company_name" />
            {state?.fieldErrors?.company_name && (
              <p className="text-sm text-destructive">{state.fieldErrors.company_name[0]}</p>
            )}
          </div>
          {state?.error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {state.error}
            </div>
          )}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
