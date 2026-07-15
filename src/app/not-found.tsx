import { Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="hero-wash flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-accent">404::not_found</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-fg">Nothing logged at this path</h1>
      <p className="mt-2 max-w-sm text-sm text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <div className="mt-6">
        <Button href="/">Back home</Button>
      </div>
    </div>
  );
}
