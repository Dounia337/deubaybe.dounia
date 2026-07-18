import { ImageResponse } from "next/og";
import { CVRepo } from "@/db/repo";

export const OG_SIZE = { width: 1200, height: 630 };

// Hardcoded to the dark-theme palette (globals.css .dark block) — OG/Twitter preview cards are
// static images with no access to the site's CSS custom properties or theme toggle, so they need
// literal values matching the brand rather than a var() reference.
const BG = "#070b16";
const FG = "#f3f5f9";
const ACCENT = "#6084cc";
const ACCENT_GLOW = "rgba(86, 121, 196, 0.35)";

/** Shared by opengraph-image.tsx and twitter-image.tsx so both platforms get the same branded
 * card — composed from the live profile (name, headline, photo), not the raw photo alone, since
 * a square/portrait photo dropped straight into a 1200x630 slot gets cropped badly by most
 * platforms. Falls back to an initial-letter avatar if no photo has been uploaded yet, matching
 * the same fallback the site's own <Avatar> component uses. */
export async function renderOgCard() {
  const profile = await CVRepo.profile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: BG,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: ACCENT_GLOW,
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "rgba(127, 150, 194, 0.18)",
            filter: "blur(120px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "0 80px" }}>
          <div
            style={{
              display: "flex",
              width: 260,
              height: 260,
              borderRadius: 9999,
              overflow: "hidden",
              border: `2px solid rgba(243, 245, 249, 0.12)`,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              background: "#0e1526",
            }}
          >
            {profile.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- ImageResponse/satori requires a plain <img>, not next/image
              <img
                src={profile.photo_url}
                width={260}
                height={260}
                style={{ objectFit: "cover", borderRadius: 9999 }}
                alt=""
              />
            ) : (
              <div style={{ display: "flex", fontSize: 110, color: ACCENT, fontWeight: 700 }}>
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: FG, lineHeight: 1.15 }}>
              {profile.full_name}
            </div>
            <div style={{ display: "flex", marginTop: 18, fontSize: 30, color: ACCENT, fontWeight: 500 }}>
              {profile.headline}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
