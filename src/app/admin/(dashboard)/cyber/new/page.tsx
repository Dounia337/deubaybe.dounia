import { CyberForm } from "@/components/admin/cyber-form";

export default function NewCyberEntryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">New cyber lab entry</h1>
      <div className="mt-8">
        <CyberForm />
      </div>
    </div>
  );
}
