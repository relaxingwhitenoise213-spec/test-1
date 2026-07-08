import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon (iOS renders its own corner radius). */
export default function AppleIcon() {
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
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3 }}>
          UK
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            width: 72,
            height: 8,
            borderRadius: 4,
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
