import type { MetadataRoute } from "next";
import { CVRepo } from "@/db/repo";

export const dynamic = "force-dynamic";

// Dynamic (reads the live profile) so "Add to Home Screen" on Android/Chrome always uses the
// current name and photo, same reasoning as icon.tsx/apple-icon.tsx.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await CVRepo.profile();

  return {
    name: `${profile.full_name} — ${profile.headline}`,
    short_name: profile.full_name,
    description: profile.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#070b16",
    theme_color: "#070b16",
    icons: profile.photo_url
      ? [
          { src: profile.photo_url, sizes: "192x192", type: "image/png" },
          { src: profile.photo_url, sizes: "512x512", type: "image/png" },
        ]
      : [],
  };
}
