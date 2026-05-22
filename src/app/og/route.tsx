import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Bagtyyar — Production-Minded Engineer";
  const description = searchParams.get("description") ?? "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: 80,
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1040 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 72, fontWeight: 700, color: "#fafafa", lineHeight: 1.05, letterSpacing: "-0.5px" }}>
              {title}
            </div>
            <div style={{ fontSize: 28, color: "#a0a0a0", lineHeight: 1.4 }}>
              {description}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#2563eb" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#fafafa" }}>Bagtyyar</div>
              <div style={{ fontSize: 16, color: "#505050" }}>{process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") || "bagtyyar.dev"}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
