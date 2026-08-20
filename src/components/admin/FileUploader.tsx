"use client";

import { useRef, useState } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createFileDeliverableAction } from "@/app/actions/deliverables";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={!hasFile || pending}>
      {pending ? "Uploading..." : "Upload File"}
    </Button>
  );
}

export function FileUploader({ projectId, freelancerId }: { projectId: string, freelancerId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(createFileDeliverableAction, null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="project_id" value={projectId} />
      <input 
        type="file" 
        name="file"
        ref={inputRef} 
        className="hidden" 
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      
      {!file ? (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG, ZIP, PDF (max 50MB)</p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="h-8 w-8 text-info shrink-0" />
              <div className="truncate">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="p-3 mt-4 text-sm text-destructive bg-destructive/10 rounded-md">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 mt-4 text-sm text-success bg-success/10 rounded-md">
          Uploaded successfully!
        </div>
      )}

      <SubmitButton hasFile={!!file} />
    </form>
  );
}
