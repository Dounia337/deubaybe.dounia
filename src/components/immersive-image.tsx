import Image from "next/image";
import { cx } from "@/lib/format";

/**
 * Detail-page hero treatment for images of any aspect ratio. The crisp image is never cropped
 * (object-contain), which leaves empty side/top bars for anything that isn't a close match for
 * the container's ratio. Instead of showing that empty space as flat fill color, a heavily
 * blurred, cropped copy of the same image fills the whole frame behind it — the same trick media
 * apps (Apple Music, Spotify) use for art that doesn't match their frame, so the container always
 * feels full and colored by the image itself rather than empty.
 */
export function ImmersiveImage({
  src,
  alt,
  heightClass = "h-[320px] sm:h-[440px] md:h-[560px]",
  priority,
}: {
  src: string;
  alt: string;
  heightClass?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative w-full overflow-hidden rounded-2xl bg-bg-sunken shadow-xl shadow-black/[0.1] ring-1 ring-border",
        heightClass
      )}
    >
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="scale-125 object-cover opacity-70 blur-3xl"
      />
      <div className="absolute inset-0 bg-black/20" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        priority={priority}
        className="relative object-contain"
      />
    </div>
  );
}
