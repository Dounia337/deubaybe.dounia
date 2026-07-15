import { MessagesRepo } from "@/db/repo";
import { EmptyState } from "@/components/ui/primitives";
import { MessageRow } from "@/components/admin/message-row";

export default async function AdminMessagesPage() {
  const messages = await MessagesRepo.all();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Messages</h1>
      <p className="mt-1 text-sm text-fg-muted">
        {messages.length} total · {messages.filter((m) => !m.is_read).length} unread
      </p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <EmptyState title="No messages yet" description="Submissions from the contact form will show up here." />
        ) : (
          messages.map((m) => <MessageRow key={m.id} message={m} />)
        )}
      </div>
    </div>
  );
}
