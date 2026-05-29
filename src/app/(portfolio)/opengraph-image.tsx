import { ImageResponse } from "@vercel/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "#0f172a",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7 }}>Khant.dev</div>
        <div style={{ marginTop: 20 }}>My Blog Portfolio</div>
      </div>
    ),
    { ...size },
  );
}
