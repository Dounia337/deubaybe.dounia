import { Plus } from "lucide-react";
import { ExperiencesRepo } from "@/db/repo";
import { Button, EmptyState } from "@/components/ui/primitives";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { PublishToggleClient } from "@/components/admin/publish-toggle-client";
import { formatDate } from "@/lib/format";

export default async function AdminExperiencesPage() {
  const experiences = await ExperiencesRepo.all(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Experiences</h1>
          <p className="mt-1 text-sm text-fg-muted">{experiences.length} total</p>
        </div>
        <Button href="/admin/experiences/new">
          <Plus className="h-4 w-4" /> New experience
        </Button>
      </div>

      <div className="mt-8">
        {experiences.length === 0 ? (
          <EmptyState title="No experiences yet" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-sunken text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experiences.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 text-fg">{e.title}</td>
                    <td className="px-4 py-3 text-fg-muted">{e.type}</td>
                    <td className="px-4 py-3 text-fg-muted">{formatDate(e.event_date)}</td>
                    <td className="px-4 py-3">
                      <PublishToggleClient apiPath={`/api/experiences/${e.id}`} published={!!e.published} />
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{e.featured ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AdminRowActions
                          editHref={`/admin/experiences/${e.id}`}
                          apiPath={`/api/experiences/${e.id}`}
                        />
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
