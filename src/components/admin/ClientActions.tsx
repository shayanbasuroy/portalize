"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateClientAction,
  deleteClientAction,
} from "@/app/actions/clients";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface Client {
  id: string;
  client_name: string;
  client_email: string;
  company_name: string | null;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export function ClientActions({ client }: { client: Client }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [state, formAction] = useActionState(updateClientAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => setEditOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger render={<span />} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the details for {client.client_name}.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={client.id} />
            <div className="space-y-2">
              <Label htmlFor={`client_name_${client.id}`}>Client Name *</Label>
              <Input
                id={`client_name_${client.id}`}
                name="client_name"
                defaultValue={client.client_name}
                required
              />
              {state?.fieldErrors?.client_name && (
                <p className="text-sm text-destructive">{state.fieldErrors.client_name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`client_email_${client.id}`}>Client Email *</Label>
              <Input
                id={`client_email_${client.id}`}
                name="client_email"
                type="email"
                defaultValue={client.client_email}
                required
              />
              {state?.fieldErrors?.client_email && (
                <p className="text-sm text-destructive">{state.fieldErrors.client_email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`company_name_${client.id}`}>Company Name (Optional)</Label>
              <Input
                id={`company_name_${client.id}`}
                name="company_name"
                defaultValue={client.company_name ?? ""}
              />
            </div>
            {state?.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {state.error}
              </div>
            )}
            <SubmitButton label="Save Changes" pendingLabel="Saving..." />
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger render={<span />} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {client.client_name}? This will
              also delete all of their projects and deliverables.
            </DialogDescription>
          </DialogHeader>
          <form
            action={async (formData: FormData) => {
              await deleteClientAction(formData);
              setDeleteOpen(false);
              router.refresh();
            }}
            className="flex justify-end gap-3"
          >
            <input type="hidden" name="id" value={client.id} />
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <DeleteButton />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
