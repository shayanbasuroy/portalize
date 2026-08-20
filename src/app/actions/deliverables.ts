"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createFileDeliverableAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const projectId = formData.get("project_id") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) return { error: "File is required" };

  const filePath = `${user.id}/${projectId}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("deliverables-bucket")
    .upload(filePath, file);

  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase
    .from("deliverables")
    .insert({
      project_id: projectId,
      title: file.name,
      deliverable_type: "file",
      content_url: filePath,
      mime_type: file.type,
      file_size: String(file.size),
      status: "pending",
    });

  if (insertError) return { error: insertError.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function createCodeDeliverableAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const projectId = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const code_content = formData.get("code_content") as string;
  const code_language = formData.get("code_language") as string;

  if (!title || !code_content) return { error: "Title and code content are required" };

  const { error } = await supabase
    .from("deliverables")
    .insert({
      project_id: projectId,
      title,
      deliverable_type: "code",
      code_content,
      code_language: code_language || "text",
      status: "pending",
    });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function createLinkDeliverableAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const projectId = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title || !url) return { error: "Title and URL are required" };

  const isEmbed =
    url.includes("figma.com") ||
    url.includes("loom.com") ||
    url.includes("youtube.com") ||
    url.includes("vimeo.com");
  const deliverableType = isEmbed ? "embed" : "link";

  const { error } = await supabase
    .from("deliverables")
    .insert({
      project_id: projectId,
      title,
      deliverable_type: deliverableType,
      content_url: url,
      status: "pending",
    });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function deleteDeliverableAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const type = formData.get("type") as string;
  const content_url = formData.get("content_url") as string;

  const { data: deliverable } = await supabase
    .from("deliverables")
    .select("project_id")
    .eq("id", id)
    .single();

  if (type === "file" && content_url) {
    await supabase.storage.from("deliverables-bucket").remove([content_url]);
  }

  const { error } = await supabase
    .from("deliverables")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (deliverable) {
    revalidatePath(`/dashboard/projects/${deliverable.project_id}`);
  }
}