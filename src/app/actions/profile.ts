"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  business_name: z.string().optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Brand color must be a hex value like #151B45"),
});

export type ProfileActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateProfileAction(
  prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const validated = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    business_name: formData.get("business_name") || undefined,
    brand_color: formData.get("brand_color") || "#151B45",
  });

  if (!validated.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { full_name, business_name, brand_color } = validated.data;

  // Optional new logo upload (public brand-assets bucket).
  let logo_url: string | null = null;
  const file = formData.get("logo") as File | null;
  if (file && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-assets")
      .upload(path, file);

    if (uploadError) return { error: uploadError.message };

    logo_url = supabase.storage
      .from("brand-assets")
      .getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase
    .from("freelancers")
    .update({
      full_name,
      business_name: business_name || null,
      brand_color,
      ...(logo_url ? { logo_url } : {}),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
