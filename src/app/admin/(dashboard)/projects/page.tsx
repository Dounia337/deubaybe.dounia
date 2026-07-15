import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectsRepo } from "@/db/repo";
import { Button, EmptyState } from "@/components/ui/primitives";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { PublishToggleClient } from "@/components/admin/publish-toggle-client";

export default async function AdminProjectsPage() {
  const projects = await ProjectsRepo.all(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Projects</h1>
          <p className="mt-1 text-sm text-fg-muted">{projects.length} total</p>
        </div>
        <Button href="/admin/projects/new">
          <Plus className="h-4 w-4" /> New project
        </Button>
      </div>

      <div className="mt-8">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create your first one to see it here." />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-sunken text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <Link href={`/projects/${p.slug}`} target="_blank" className="text-fg hover:text-accent">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <PublishToggleClient
                        apiPath={`/api/projects/${p.id}`}
                        published={!!p.published}
                      />
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{p.featured ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AdminRowActions editHref={`/admin/projects/${p.id}`} apiPath={`/api/projects/${p.id}`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
