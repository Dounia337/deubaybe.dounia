import { Avatar } from "@/components/ui/primitives";

export function PostFooter({
  name,
  headline,
  photoUrl,
  date,
}: {
  name: string;
  headline?: string | null;
  photoUrl?: string | null;
  date: string;
}) {
  return (
    <div className="glass mt-12 flex flex-col items-center gap-4 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
      <Avatar src={photoUrl} alt={name} size={56} />
      <div className="flex-1">
        <p className="font-mono text-[11px] uppercase tracking-wide text-fg-subtle">Written by</p>
        <p className="font-display text-lg font-semibold text-fg">{name}</p>
        {headline && <p className="text-sm text-fg-muted">{headline}</p>}
      </div>
      <p className="shrink-0 font-mono text-xs text-fg-subtle">Posted {date}</p>
    </div>
  );
}
