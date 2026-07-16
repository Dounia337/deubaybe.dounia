import Link from "next/link";
import { Plus } from "lucide-react";
import { CyberRepo } from "@/db/repo";
import { Button, EmptyState } from "@/components/ui/primitives";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { PublishToggleClient } from "@/components/admin/publish-toggle-client";

export default async function AdminCyberPage() {
  const entries = await CyberRepo.all(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">Cyber Lab</h1>
          <p className="mt-1 text-sm text-fg-muted">{entries.length} total</p>
        </div>
        <Button href="/admin/cyber/new">
          <Plus className="h-4 w-4" /> New entry
        </Button>
      </div>

      <div className="mt-8">
        {entries.length === 0 ? (
          <EmptyState title="No entries yet" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-sunken text-xs uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <Link href={`/cybersecurity/${c.slug}`} target="_blank" className="text-fg hover:text-accent">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{c.category}</td>
                    <td className="px-4 py-3">
                      <PublishToggleClient apiPath={`/api/cyber/${c.id}`} published={!!c.published} />
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{c.featured ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AdminRowActions editHref={`/admin/cyber/${c.id}`} apiPath={`/api/cyber/${c.id}`} />
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
