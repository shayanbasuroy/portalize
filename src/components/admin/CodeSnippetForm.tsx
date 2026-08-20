"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCodeDeliverableAction } from "@/app/actions/deliverables";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Adding Code..." : "Add Code Snippet"}
    </Button>
  );
}

export function CodeSnippetForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(createCodeDeliverableAction, null);

  const languages = [
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "python", label: "Python" },
    { value: "json", label: "JSON" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
  ];

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="project_id" value={projectId} />
      
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required placeholder="e.g. Header Component" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code_language">Language *</Label>
        <Select name="code_language" defaultValue="typescript">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code_content">Code *</Label>
        <Textarea 
          id="code_content" 
          name="code_content" 
          required 
          className="font-mono min-h-[200px]" 
          placeholder="Paste your code here..."
        />
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
