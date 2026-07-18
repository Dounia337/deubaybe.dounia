import { ImageResponse } from "next/og";
import { CVRepo } from "@/db/repo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

// iOS applies its own rounded-square mask to home-screen icons, so this stays a plain square
// (unlike icon.tsx, which is pre-cropped to a circle for the browser tab).
export default async function AppleIcon() {
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
          background: "#0e1526",
        }}
      >
        {profile.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse/satori requires a plain <img>, not next/image
          <img src={profile.photo_url} width={180} height={180} style={{ objectFit: "cover" }} alt="" />
        ) : (
          <div style={{ display: "flex", fontSize: 90, color: "#6084cc", fontWeight: 700 }}>
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
