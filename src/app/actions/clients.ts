"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const clientSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Valid email is required"),
  company_name: z.string().optional(),
});

export async function createClientAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const validatedFields = clientSchema.safeParse({
    client_name: formData.get("client_name"),
    client_email: formData.get("client_email"),
    company_name: formData.get("company_name"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields", fieldErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("clients")
    .insert({
      freelancer_id: user.id,
      ...validatedFields.data,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function updateClientAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  
  const validatedFields = clientSchema.safeParse({
    client_name: formData.get("client_name"),
    client_email: formData.get("client_email"),
    company_name: formData.get("company_name"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("clients")
    .update(validatedFields.data)
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function deleteClientAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/clients");
}
