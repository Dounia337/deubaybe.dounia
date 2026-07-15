import { ReflectionForm } from "@/components/admin/reflection-form";

export default function NewReflectionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">New reflection</h1>
      <div className="mt-8">
        <ReflectionForm />
      </div>
    </div>
  );
}
