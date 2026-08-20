"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLinkDeliverableAction } from "@/app/actions/deliverables";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Adding Link..." : "Add Link"}
    </Button>
  );
}

export function LinkEmbedForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(createLinkDeliverableAction, null);
  const [url, setUrl] = useState("");

  const getEmbedType = (url: string) => {
    if (!url) return null;
    if (url.includes("figma.com")) return "Figma Embed";
    if (url.includes("loom.com")) return "Loom Video";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube Video";
    if (url.includes("framer.website") || url.includes("framer.app")) return "Framer Site";
    return "Generic Link";
  };

  const embedType = getEmbedType(url);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required placeholder="e.g. V1 Design Draft" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <div className="relative">
          <Input 
            id="url" 
            name="url" 
            type="url"
            required 
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        {embedType && (
          <div className="pt-1">
            <Badge variant="secondary" className="text-xs">
              Detected: {embedType}
            </Badge>
          </div>
        )}
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-success bg-success/10 rounded-md">
          Added successfully!
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
