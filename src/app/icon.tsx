import { ImageResponse } from "next/og";
import { CVRepo } from "@/db/repo";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
// Without this, Next statically prerenders the icon once at build time and the photo would go
// stale until the next deploy if it's ever changed from the admin panel.
export const dynamic = "force-dynamic";

// Dynamic (not statically generated at build time) because it reads the live profile photo, so
// it stays in sync automatically if the photo is ever changed from the admin panel.
export default async function Icon() {
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
          borderRadius: 9999,
          overflow: "hidden",
          background: "#0e1526",
        }}
      >
        {profile.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse/satori requires a plain <img>, not next/image
          <img
            src={profile.photo_url}
            width={32}
            height={32}
            style={{ objectFit: "cover", borderRadius: 9999 }}
            alt=""
          />
        ) : (
          <div style={{ display: "flex", fontSize: 18, color: "#6084cc", fontWeight: 700 }}>
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
