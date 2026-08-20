"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSlug, generatePin, hashPin } from "@/lib/security";

const projectSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required"),
});

export async function createProjectAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const validatedFields = projectSchema.safeParse({
    client_id: formData.get("client_id"),
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields", fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { title, client_id } = validatedFields.data;
  const slug = generateSlug(title);
  const pin = generatePin();
  const hashedPin = await hashPin(pin);

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      freelancer_id: user.id,
      client_id,
      title,
      slug,
      access_pin: hashedPin,
      payment_status: "unpaid",
      project_status: "in_review",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Note: we would normally display the PIN to the user once here or send it via email.
  // For the sake of this implementation, we will pass it via query param or store it in flash session.
  
  redirect(`/dashboard/projects/${project.id}?pin=${pin}`);
}

export async function togglePaymentStatus(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const currentStatus = formData.get("current_status") as string;
  const newStatus = currentStatus === "paid" ? "unpaid" : "paid";

  const { error } = await supabase
    .from("projects")
    .update({ payment_status: newStatus })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/projects/${id}`);
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;

  // Fetch storage paths so we can clean up files before deleting the project
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", id)
    .eq("freelancer_id", user.id)
    .single();

  if (project) {
    const { data: deliverables } = await supabase
      .from("deliverables")
      .select("content_url")
      .eq("project_id", id);

    const filePaths = (deliverables || [])
      .filter((d) => d.content_url)
      .map((d) => d.content_url as string);

    if (filePaths.length > 0) {
      await supabase.storage.from("deliverables-bucket").remove(filePaths);
    }
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
