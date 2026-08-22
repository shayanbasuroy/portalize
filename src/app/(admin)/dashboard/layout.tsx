import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch freelancer profile
  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("*")
    .eq("id", user.id)
    .single();

  const freelancerProps = freelancer ? {
    id: freelancer.id,
    full_name: freelancer.full_name,
    email: user.email!
  } : {
    id: user.id,
    full_name: "",
    email: user.email!
  };

  return (
    <div className="min-h-screen flex bg-[#F8F7FC]">
      <Sidebar freelancer={freelancerProps} />
      <main className="flex-1 px-4 pb-8 pt-20 md:ml-64 md:p-8">
        {children}
      </main>
    </div>
  );
}
