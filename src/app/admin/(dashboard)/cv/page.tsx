import { CVEditor } from "@/components/admin/cv-editor";

export default function AdminCVPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">CV Editor</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Updates here refresh both the web CV and the downloadable PDF automatically.
      </p>
      <div className="mt-8">
        <CVEditor />
      </div>
    </div>
  );
}
