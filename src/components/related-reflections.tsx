import { BookOpen } from "lucide-react";
import { OverlayCard } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { formatDate } from "@/lib/format";
import type { Reflection } from "@/db/repo";

export function RelatedReflections({ items }: { items: Reflection[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-14 border-t border-border pt-10">
      <p className="font-display text-xl font-semibold tracking-tight text-fg">Keep reading</p>
      <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => {
          const tags = JSON.parse(r.tags || "[]") as string[];
          return (
            <RevealItem key={r.id}>
              <OverlayCard
                href={`/reflections/${r.slug}`}
                src={r.image_url}
                alt={r.title}
                icon={<BookOpen />}
                title={r.title}
                tags={tags}
                date={formatDate(r.post_date)}
                imgHeight="h-40 sm:h-48"
              />
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
