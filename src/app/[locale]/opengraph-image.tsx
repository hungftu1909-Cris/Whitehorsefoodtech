import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#FBF8F1",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#3B2314",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, color: "#3B2314", fontWeight: 700 }}>
              Whitehorse
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#6B5A45",
                letterSpacing: 4,
                fontFamily: "sans-serif",
              }}
            >
              FOODTECH
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <span
            style={{
              fontSize: 54,
              lineHeight: 1.15,
              color: "#241505",
              fontWeight: 700,
            }}
          >
            {t("siteName")}
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#6B5A45",
              fontFamily: "sans-serif",
              lineHeight: 1.4,
            }}
          >
            {t("description")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#B8863A",
            fontFamily: "sans-serif",
            letterSpacing: 2,
          }}
        >
          PREMIUM AGRICULTURAL PRODUCTS · GLOBALLY DELIVERED
        </div>
      </div>
    ),
    { ...size }
  );
}
