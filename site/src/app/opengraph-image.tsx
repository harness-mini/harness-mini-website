import { ImageResponse } from "next/og";
import { SKILLS, AGENTS } from "@/lib/site";

export const alt =
  "harness-mini — a minimal, CLI-agnostic agent harness. Convention + skills + sub-agents + thin shell glue.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Terminal-styled social card. Static (generated at build). Satori-safe:
// flexbox + inline hex colors, ASCII glyphs, default font (no custom TTF).
export default function OpengraphImage() {
  const bg = "#0d0f15";
  const fg = "#e7ecf2";
  const green = "#57e39b";
  const muted = "#93a0b0";
  const border = "rgba(255,255,255,0.10)";
  const card = "rgba(255,255,255,0.03)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          backgroundImage:
            "radial-gradient(1100px 520px at 50% -12%, rgba(87,227,155,0.18), rgba(13,15,21,0))",
          color: fg,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <span style={{ color: green, fontWeight: 700 }}>&gt;_</span>
          <span style={{ marginLeft: 16, color: muted, letterSpacing: 1 }}>
            harness-mini
          </span>
        </div>

        {/* headline + install strip */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -1.5,
            }}
          >
            <span style={{ display: "flex" }}>A minimal, CLI-agnostic</span>
            <span style={{ display: "flex", color: green }}>agent harness.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 40,
              padding: "20px 28px",
              borderRadius: 14,
              border: `1px solid ${border}`,
              background: card,
              fontSize: 28,
            }}
          >
            <span style={{ color: green, marginRight: 14 }}>$</span>
            <span style={{ color: fg }}>bash harness-mini/init.sh ./project</span>
          </div>
        </div>

        {/* footer chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: muted,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: green, fontWeight: 700 }}>the 40% line</span>
            <span style={{ margin: "0 16px", color: border }}>·</span>
            <span>{SKILLS.length} skills</span>
            <span style={{ margin: "0 16px", color: border }}>·</span>
            <span>{AGENTS.length} sub-agents</span>
          </div>
          <span>the harness is the environment</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
