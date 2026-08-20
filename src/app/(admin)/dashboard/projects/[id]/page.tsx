import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/admin/ProjectHeader";
import { DeliverableCard } from "@/components/admin/DeliverableCard";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/admin/FileUploader";
import { CodeSnippetForm } from "@/components/admin/CodeSnippetForm";
import { LinkEmbedForm } from "@/components/admin/LinkEmbedForm";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, clients(*)")
    .eq("id", params.id)
    .eq("freelancer_id", user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: deliverables } = await supabase
    .from("deliverables")
    .select("*, feedback_comments(*)")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  const portalBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="space-y-8 pb-12">
      <ProjectHeader project={project} portalBaseUrl={portalBaseUrl} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Deliverables
            </h2>
            <div className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200">
              {deliverables?.map((deliverable) => (
                <DeliverableCard key={deliverable.id} deliverable={deliverable} />
              ))}
              {(!deliverables || deliverables.length === 0) && (
                <div className="py-12 text-center text-sm text-zinc-500">
                  No deliverables added yet. Add one to the right.
                </div>
              )}
            </div>
          </div>

          <ActivityFeed projectId={project.id} />
        </div>

        <div>
          <div className="border border-zinc-200 bg-white lg:sticky lg:top-6">
            <div className="p-6">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Add deliverable
              </h2>
              <div className="mt-5">
                <Tabs defaultValue="file">
                  <TabsList className="mb-6 grid w-full grid-cols-3">
                    <TabsTrigger value="file">File</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="file">
                    <FileUploader projectId={project.id} freelancerId={user.id} />
                  </TabsContent>
                  <TabsContent value="code">
                    <CodeSnippetForm projectId={project.id} />
                  </TabsContent>
                  <TabsContent value="link">
                    <LinkEmbedForm projectId={project.id} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
