import { ImageResponse } from "next/og";
import { getResume } from "@/data/resume";
import { site } from "@/data/resume/site";

export const alt = "ShadCN CV Kit — Resume Template & CV Component for Next.js";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { contact, role } = getResume(site.defaultLanguage);
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        color: "#fafafa",
        padding: "64px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 18px",
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#a1a1aa",
          }}
        >
          OPEN SOURCE · MIT
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 18px",
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          NEXT.JS 16 · REACT 19 · TAILWIND 4
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            fontSize: "68px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#ffffff",
          }}
        >
          ShadCN CV Kit
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "1000px",
          }}
        >
          A modern, bilingual, accessible resume template and portable React
          document for developers. Built with shadcn/ui.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "1px solid #27272a",
          paddingTop: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff" }}>
            {contact.name}
          </span>
          <span style={{ fontSize: "22px", color: "#52525b" }}>•</span>
          <span style={{ fontSize: "22px", color: "#a1a1aa" }}>{role}</span>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#38bdf8",
            fontWeight: 600,
            fontFamily: "monospace",
          }}
        >
          {new URL(site.url).hostname}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
