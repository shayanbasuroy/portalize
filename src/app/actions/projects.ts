"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSlug, generatePin, hashPin } from "@/lib/security";

const projectSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required"),
  invoice_url: z.string().optional().nullable(),
  invoice_amount: z.string().optional().nullable(),
});

export async function createProjectAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const rawUrl = formData.get("invoice_url") as string | null;
  const rawAmount = formData.get("invoice_amount") as string | null;

  const validatedFields = projectSchema.safeParse({
    client_id: formData.get("client_id"),
    title: formData.get("title"),
    invoice_url: rawUrl ? rawUrl.trim() : undefined,
    invoice_amount: rawAmount ? rawAmount.trim() : undefined,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields", fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { title, client_id, invoice_url, invoice_amount } = validatedFields.data;

  // Hard server-side tier enforcement: Free tier is limited to 1 active project
  const [{ data: freelancer }, { count: projectCount }] = await Promise.all([
    supabase
      .from("freelancers")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("freelancer_id", user.id),
  ]);

  const isPro = freelancer?.subscription_tier === "pro";
  const currentCount = projectCount ?? 0;

  if (!isPro && currentCount >= 1) {
    return {
      error:
        "Free tier is limited to 1 client portal. Upgrade to Pro for unlimited client portals.",
    };
  }

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
      invoice_url: invoice_url || null,
      invoice_amount: invoice_amount || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Store the plaintext PIN in a freelancer-only table so it can be shown and
  // copied from the dashboard. `access_pin` stays hashed for client checks.
  await supabase.from("project_pins").insert({ project_id: project.id, pin });

  redirect(`/dashboard/projects/${project.id}`);
}

export async function togglePaymentStatus(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;

  // Read the authoritative current status from the DB instead of trusting the
  // client-provided `current_status` (which can be stale after another update
  // re-renders the page). This keeps payment status stable — it only flips on
  // this explicit action, never because of a stale hidden input.
  const { data: project } = await supabase
    .from("projects")
    .select("payment_status")
    .eq("id", id)
    .eq("freelancer_id", user.id)
    .single();

  if (!project) throw new Error("Project not found");

  const newStatus = project.payment_status === "paid" ? "unpaid" : "paid";

  const { error } = await supabase
    .from("projects")
    .update({ payment_status: newStatus })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/projects/${id}`);
}

export async function toggleWatermarkAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;

  // Same as payment status: read the current value from the DB so the toggle is
  // authoritative and can't flip the wrong way from a stale form value.
  const { data: project } = await supabase
    .from("projects")
    .select("watermark_enabled")
    .eq("id", id)
    .eq("freelancer_id", user.id)
    .single();

  if (!project) throw new Error("Project not found");

  const next = !project.watermark_enabled;

  const { error } = await supabase
    .from("projects")
    .update({ watermark_enabled: next })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/projects/${id}`);
}

export async function updateProjectInvoiceAction(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const rawUrl = formData.get("invoice_url") as string | null;
  const rawAmount = formData.get("invoice_amount") as string | null;

  const invoice_url = rawUrl ? rawUrl.trim() : null;
  const invoice_amount = rawAmount ? rawAmount.trim() : null;

  const { error } = await supabase
    .from("projects")
    .update({ invoice_url, invoice_amount })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${id}`);
  return { success: true };
}

export async function regeneratePinAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const pin = generatePin();
  const hashedPin = await hashPin(pin);

  const { error } = await supabase
    .from("projects")
    .update({ access_pin: hashedPin })
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  await supabase.from("project_pins").upsert({ project_id: id, pin });

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
