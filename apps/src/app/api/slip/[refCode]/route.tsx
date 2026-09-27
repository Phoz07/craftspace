import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";

// Load fonts from local public/fonts buffer
function getFontBuffers() {
  const regularPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "LINESeedSansTH_Rg.ttf",
  );
  const boldPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "LINESeedSansTH_Bd.ttf",
  );

  const regularFont = fs.readFileSync(regularPath);
  const boldFont = fs.readFileSync(boldPath);

  return { regularFont, boldFont };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ refCode: string }> },
) {
  try {
    const { refCode } = await params;
    if (!refCode) {
      return new Response("Missing Reference Code", { status: 400 });
    }

    const normalizedRefCode = refCode.startsWith("#") ? refCode : `#${refCode}`;

    // Lookup lead in database
    let lead = await db.lead.findUnique({
      where: { refCode: normalizedRefCode },
    });

    if (!lead) {
      lead = await db.lead.findUnique({
        where: { refCode },
      });
    }

    if (!lead) {
      return new Response("Estimate Lead Not Found", { status: 404 });
    }

    const { regularFont, boldFont } = getFontBuffers();

    const propertyLabel =
      lead.propertyType === "CONDO"
        ? "คอนโดมิเนียม (Condo)"
        : lead.propertyType === "TOWNHOME"
          ? "ทาวน์โฮม (Townhome)"
          : "บ้านเดี่ยว (House)";

    const zonesList = (lead.selectedZones as string[]).map((z) => {
      if (z === "LIVING") return "ห้องนั่งเล่นหลัก (Main Living Area)";
      if (z === "BEDROOM") return "ห้องนอนใหญ่ (Master Bedroom)";
      if (z === "KITCHEN") return "ห้องครัว (Kitchen & Pantry)";
      if (z === "SYSTEM") return "งานระบบและฝ้าซ่อนไฟ (System & Ceiling)";
      return z;
    });

    const formattedDate = new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(lead.createdAt));

    // Render 1080 x 1920 9:16 Photo-ready Digital Receipt Slip
    return new ImageResponse(
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FBF9F5",
          padding: "80px 70px",
          fontFamily: '"LINE Seed Sans TH", sans-serif',
          color: "#1F1D1A",
        }}
      >
        {/* Top Brand Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "3px solid #EAE4DA",
            paddingBottom: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#1F1D1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                    fill="#DFB978"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  letterSpacing: "4px",
                  color: "#1F1D1A",
                }}
              >
                CRAFTSPACE
              </span>
            </div>
            <span
              style={{
                fontSize: "18px",
                letterSpacing: "6px",
                color: "#8F653B",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Interior & Built-in Studio
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: "30px",
                backgroundColor: "#F3EFE6",
                border: "2px solid #E5DED3",
                fontSize: "18px",
                fontWeight: 600,
                color: "#8F653B",
                marginBottom: "8px",
              }}
            >
              PRELIMINARY ESTIMATE SLIP
            </div>
            <span style={{ fontSize: "16px", color: "#7A7368" }}>
              วันที่ออกเอกสาร: {formattedDate}
            </span>
          </div>
        </div>

        {/* Luxury Reference Code Card */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1F1D1A",
            borderRadius: "32px",
            padding: "48px 50px",
            color: "#FBF9F5",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "18px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#A8A196",
                marginBottom: "8px",
              }}
            >
              รหัสใบประเมินงบประมาณ (Reference ID)
            </span>
            <span
              style={{
                fontSize: "52px",
                fontWeight: 700,
                color: "#DFB978",
                letterSpacing: "2px",
              }}
            >
              {lead.refCode}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: "18px", color: "#A8A196" }}>
              ผู้ขอรับการประเมิน:
            </span>
            <span
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginTop: "4px",
              }}
            >
              {lead.customerName}
            </span>
            <span style={{ fontSize: "20px", color: "#DFB978" }}>
              {lead.phoneNumber}
            </span>
          </div>
        </div>

        {/* Project Specifications Table */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            borderRadius: "32px",
            padding: "50px",
            border: "2px solid #EAE4DA",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#1F1D1A",
              marginBottom: "30px",
              borderBottom: "2px solid #F3EFE6",
              paddingBottom: "16px",
            }}
          >
            สรุปรายการและสเปกการตกแต่ง (Scope & Specifications)
          </span>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#7A7368" }}>
              ประเภทที่อยู่อาศัย:
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: 600, color: "#1F1D1A" }}
            >
              {propertyLabel}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#7A7368" }}>
              ขนาดพื้นที่ใช้สอย:
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: 600, color: "#1F1D1A" }}
            >
              {lead.areaSqm} ตารางเมตร
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#7A7368" }}>
              เกรดวัสดุและฟิตติ้ง:
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: 600, color: "#8F653B" }}
            >
              {lead.materialGrade} Grade
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "2px solid #F3EFE6",
              paddingTop: "24px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "#7A7368",
                marginBottom: "16px",
              }}
            >
              โซนบิวท์อินที่เลือก ({zonesList.length} โซน):
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {zonesList.map((zoneName, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontSize: "22px",
                    color: "#1F1D1A",
                    fontWeight: 500,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8F653B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{zoneName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Budget Range Box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F3EFE6",
            borderRadius: "32px",
            padding: "48px 40px",
            border: "3px solid #8F653B",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#8F653B",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "8px",
            }}
          >
            ช่วงงบประมาณประเมินเบื้องต้น (Estimated Budget Range)
          </span>
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: 800,
              color: "#1F1D1A",
              letterSpacing: "1px",
            }}
          >
            {`฿${lead.estimatedMin.toLocaleString()} – ฿${lead.estimatedMax.toLocaleString()}`}
          </div>
          <span
            style={{
              fontSize: "18px",
              color: "#7A7368",
              marginTop: "8px",
            }}
          >
            ครอบคลุมงานเฟอร์นิเจอร์บิวท์อินโครงสร้าง HMR และฟิตติ้ง Soft-close
          </span>
        </div>

        {/* Legal Disclaimer & Footer Contact */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "2px solid #EAE4DA",
            paddingTop: "32px",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "15px",
              color: "#7A7368",
              lineHeight: "1.6",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            หมายเหตุ: ตัวเลขนี้เป็นการประเมินงบประมาณเบื้องต้นจากสเปกมาตรฐาน
            ไม่ใช่ใบเสนอราคาผูกมัด (Official Quotation)
            ราคาจริงอาจปรับเปลี่ยนตามสภาพพื้นที่จริงและฟังก์ชันเฉพาะบุคคล
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "18px",
              color: "#8F653B",
              fontWeight: 600,
            }}
          >
            <span>LINE: @craftspace</span>
            <span>TEL: 082-456-7890</span>
            <span>WWW.CRAFTSPACE.STUDIO</span>
          </div>
        </div>
      </div>,
      {
        width: 1080,
        height: 1920,
        fonts: [
          {
            name: "LINE Seed Sans TH",
            data: regularFont,
            style: "normal",
            weight: 400,
          },
          {
            name: "LINE Seed Sans TH",
            data: boldFont,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );
  } catch (error) {
    console.error("[api/slip] Error rendering slip:", error);
    return new Response("Internal Server Error generating slip", {
      status: 500,
    });
  }
}
