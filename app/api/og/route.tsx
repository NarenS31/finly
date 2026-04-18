import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Learn money. Change your life.";
  const topic = searchParams.get("topic") ?? "Financial Education";
  const tier = searchParams.get("tier") ?? "";
  const xp = searchParams.get("xp") ?? "10";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#22c55e",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "#f0fdf4",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 72px",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#22c55e",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "#16a34a",
                  borderRadius: "4px",
                  display: "flex",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "#0a0a0a",
                letterSpacing: "-0.5px",
              }}
            >
              fin<span style={{ color: "#22c55e" }}>ly</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                color: "#15803d",
                padding: "6px 14px",
                borderRadius: "99px",
                fontSize: "16px",
                fontWeight: 700,
                display: "flex",
              }}
            >
              {topic}
            </div>
            {tier && (
              <div
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "6px 14px",
                  borderRadius: "99px",
                  fontSize: "16px",
                  fontWeight: 600,
                  display: "flex",
                }}
              >
                Ages {tier}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: title.length > 40 ? "52px" : "64px",
              fontWeight: 900,
              color: "#0a0a0a",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              maxWidth: "800px",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#6b7280",
                fontWeight: 500,
                display: "flex",
              }}
            >
              Free financial education for ages 8-17
            </div>
            <div
              style={{
                background: "#fef9c3",
                border: "1.5px solid #fde68a",
                color: "#854d0e",
                padding: "8px 18px",
                borderRadius: "99px",
                fontSize: "18px",
                fontWeight: 800,
                display: "flex",
              }}
            >
              +{xp} XP
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
