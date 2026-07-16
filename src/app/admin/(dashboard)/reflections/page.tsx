import { Plus } from "lucide-react";
import Link from "next/link";
import { ReflectionsRepo } from "@/db/repo";
import { Button, EmptyState } from "@/components/ui/primitives";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { PublishToggleClient } from "@/components/admin/publish-toggle-client";
import { formatDate } from "@/lib/format";

export default async function AdminReflectionsPage() {
  const reflections = await ReflectionsRepo.all(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Reflections</h1>
          <p className="mt-1 text-sm text-fg-muted">{reflections.length} total</p>
        </div>
        <Button href="/admin/reflections/new">
          <Plus className="h-4 w-4" /> New reflection
        </Button>
      </div>

      <div className="mt-8">
        {reflections.length === 0 ? (
          <EmptyState title="No reflections yet" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-sunken text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reflections.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">
                      <Link href={`/reflections/${r.slug}`} target="_blank" className="text-fg hover:text-accent">
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{formatDate(r.post_date)}</td>
                    <td className="px-4 py-3">
                      <PublishToggleClient apiPath={`/api/reflections/${r.id}`} published={!!r.published} />
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{r.featured ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AdminRowActions
                          editHref={`/admin/reflections/${r.id}`}
                          apiPath={`/api/reflections/${r.id}`}
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
