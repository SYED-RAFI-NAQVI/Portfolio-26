import type { Metadata } from "next";
import { JourneyConnector, type JourneyConnectorVariant } from "../../../components/journey/connectors/JourneyConnector";
import { JourneyNode, JourneyConnectorCap } from "../../../components/journey/connectors/JourneyNode";
import { JourneyCmd } from "../../../components/journey/JourneyCmd";

export const metadata: Metadata = {
  title: "Connectors Demo — Journey",
  description: "Demonstrating the Journey connector system.",
};

function DemoBlock({
  title,
  variant,
  direction = "up",
  width,
  height,
  showSignal = false,
  animateIn = false,
}: {
  title: string;
  variant: JourneyConnectorVariant;
  direction?: "up" | "down" | "left" | "right";
  width: number;
  height: number;
  showSignal?: boolean;
  animateIn?: boolean;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 11,
          color: "#737373",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {title} ({width}×{height})
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "max-content",
        }}
      >
        {direction === "up" && <JourneyConnectorCap />}
        <div style={{ width, height }}>
          <JourneyConnector
            variant={variant}
            direction={direction}
            showSignal={showSignal}
            animateIn={animateIn}
          />
        </div>
        {(direction === "up" || direction === "down") && <JourneyNode active={showSignal} />}
        {direction === "down" && <JourneyConnectorCap />}
      </div>
    </div>
  );
}

export default function ConnectorsDemoPage() {
  return (
    <main
      style={{
        background: "#050505",
        minHeight: "100vh",
        padding: "64px 48px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 14,
          marginBottom: 64,
        }}
      >
        JOURNEY CONNECTOR SYSTEM
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 80px" }}>
        <div>
          <DemoBlock
            title="01 — Vertical (Medium)"
            variant="vertical"
            width={40}
            height={120}
            showSignal
          />
          <DemoBlock
            title="02 — Horizontal (Compact)"
            variant="horizontal"
            direction="right"
            width={80}
            height={20}
          />
          <DemoBlock
            title="03 — Deflect Right (Medium)"
            variant="deflect-right"
            width={120}
            height={160}
            showSignal
          />
          <DemoBlock
            title="04 — Deflect Left (Large)"
            variant="deflect-left"
            width={240}
            height={200}
            showSignal
            animateIn
          />
        </div>

        <div>
          <DemoBlock
            title="05 — Double Bend Right (Medium)"
            variant="double-bend-right"
            width={160}
            height={140}
            showSignal
          />
          <DemoBlock
            title="06 — Double Bend Left (Large)"
            variant="double-bend-left"
            width={280}
            height={220}
            showSignal
          />
          <DemoBlock
            title="07 — Short Branch (Compact)"
            variant="short-branch"
            width={20}
            height={40}
          />
        </div>
      </div>

      <div style={{ marginTop: 80, borderTop: "1px solid #222", paddingTop: 80 }}>
        <h2
          style={{
            color: "#fff",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 14,
            marginBottom: 32,
          }}
        >
          COMPOSITION EXAMPLE
        </h2>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 440, height: 200 }}>
              <JourneyCmd
                title="PROJECT.LOG"
                command="build"
                description="This shows a connector routing from the timeline node straight into a CMD card."
              />
            </div>
            <div style={{ width: 140, height: 120 }}>
              <JourneyConnector variant="deflect-right" direction="up" showSignal />
            </div>
            <JourneyNode active />
          </div>
        </div>
      </div>
    </main>
  );
}
