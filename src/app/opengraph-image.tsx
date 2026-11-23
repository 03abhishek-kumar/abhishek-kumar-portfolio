import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}: Software Engineer & Product Builder`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#060608",
          color: "#ededf0",
          position: "relative",
        }}
      >
        {/* chrome orb suggestion */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 70,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 35% 30%, #ffffff 0%, #c7ccff 12%, #5b5fd6 45%, #1a1a28 75%, #060608 100%)",
            boxShadow: "0 0 160px 20px rgba(124,140,255,0.25)",
          }}
        />
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#a1a1ad", textTransform: "uppercase" }}>
          Software Engineer / Full-Stack / Tech Lead
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9 }}>ABHISHEK</div>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9, paddingLeft: 120 }}>KUMAR</div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 36, color: "#ededf0" }}>
            Building products that solve <span style={{ color: "#7c8cff", marginLeft: 10 }}>real problems.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
