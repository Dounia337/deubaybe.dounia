import Image from "next/image";
import { cx } from "@/lib/format";

/**
 * Detail-page hero treatment for images of any aspect ratio. The crisp image is never cropped
 * (object-contain), which leaves empty side/top bars for anything that isn't a close match for
 * the container's ratio. Instead of showing that empty space as flat fill color, a heavily
 * blurred, cropped copy of the same image fills the whole frame behind it — the same trick media
 * apps (Apple Music, Spotify) use for art that doesn't match their frame.
 *
 * The seam between the crisp layer and that background is where a naive version breaks down: a
 * CSS mask on the crisp image can't be aligned to its *rendered* content box, only to the full
 * (fill-sized) element box, so a feather sized for the container does nothing for e.g. a portrait
 * photo whose real content only occupies the center third of a wide frame. Instead, a third copy
 * of the same image sits between the two, object-contain'd identically to the crisp layer but
 * blurred and scaled up a little — since it's sized by the same algorithm against the same
 * unknown aspect ratio, it always extends just past the crisp layer's true edges in every
 * direction, tracing a soft halo around whatever silhouette the image actually has, no matter
 * what that shape is. No border radius or card framing either, so the image reads as part of the
 * page rather than a UI element floating on it.
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
    <div className={cx("relative w-full overflow-hidden bg-bg-sunken", heightClass)}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="scale-150 object-cover opacity-70 blur-3xl"
      />
      <div className="absolute inset-0 bg-black/20" />
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="relative scale-125 object-contain blur-2xl"
      />
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="relative scale-110 object-contain blur-md"
      />
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
