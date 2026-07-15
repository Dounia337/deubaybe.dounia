import { Button, Eyebrow } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="hero-wash flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
        Nothing here yet
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <div className="mt-7">
        <Button href="/">Back home</Button>
      </div>
    </div>
  );
}
