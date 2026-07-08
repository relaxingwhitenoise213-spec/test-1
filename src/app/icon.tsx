import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** App icon: white portcullis-free, type-led mark on royal blue. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1d4ed8 0%, #17307a 100%)",
          borderRadius: 96,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 190, fontWeight: 800, letterSpacing: -8 }}>
          UK
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            width: 200,
            height: 22,
            borderRadius: 11,
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, background: "#c8102e" }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: "#c8102e" }} />
        </div>
      </div>
    ),
    size
  );
}
