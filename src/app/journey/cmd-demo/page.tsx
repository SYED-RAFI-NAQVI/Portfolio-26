import type { Metadata } from "next";
import { JourneyCmd } from "../../../components/journey/JourneyCmd";

export const metadata: Metadata = {
  title: "CMD Demo — Journey",
  description: "JourneyCmd component at small, medium, and large sizes.",
};

export default function CmdDemoPage() {
  return (
    <main
      style={{
        background: "#050505",
        minHeight: "100vh",
        padding: "64px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 64,
        alignItems: "flex-start",
      }}
    >
      {/* ── Small ─────────────────────────────────────────────── */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#737373",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          Small — 320 × 220
        </p>
        <div style={{ width: 320, height: 220 }}>
          <JourneyCmd
            title="NODE.01"
            meta="2019 · ORIGIN"
            command="init"
            description="Where it started."
          />
        </div>
      </section>

      {/* ── Medium ────────────────────────────────────────────── */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#737373",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          Medium — 560 × 340
        </p>
        <div style={{ width: 560, height: 340 }}>
          <JourneyCmd
            title="RAFI.JOURNEY"
            meta="NODE_04 · 2026 · NEW YORK"
            command="open milestone --id applied-ai"
            description="Building systems where product, software, and applied AI intersect."
          />
        </div>
      </section>

      {/* ── Large / wide ──────────────────────────────────────── */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#737373",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          Large — 880 × 400
        </p>
        <div style={{ width: 880, height: 400 }}>
          <JourneyCmd
            title="SHIP.LOG"
            meta="EXPERIMENT · STATUS / ACTIVE"
            command="deploy --target production --region us-east"
            description="The output, metric, launch, and result that defined this phase. A place for evidence, not claims."
            tracerSpeed={7}
            tracerLength={8}
          />
        </div>
      </section>

      {/* ── Children slot ─────────────────────────────────────── */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#737373",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          Children slot — 640 × 300
        </p>
        <div style={{ width: 640, height: 300 }}>
          <JourneyCmd title="CUSTOM.CONTENT">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase" as const,
                  color: "#f2f2f2",
                  margin: 0,
                }}
              >
                PROJECT · SHIPPED
              </p>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  fontFamily: "var(--font-geist-sans), sans-serif",
                }}
              >
                Custom React content goes here
              </h3>
              <p style={{ fontSize: 14, color: "#a1a1a1", margin: 0, lineHeight: 1.7 }}>
                Screenshots, metrics, logos, diagrams — anything passed as children
                replaces the default terminal body.
              </p>
            </div>
          </JourneyCmd>
        </div>
      </section>
    </main>
  );
}
