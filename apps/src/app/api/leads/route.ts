import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateEstimate, type PropertyType, type DecorationZoneKey, type MaterialGradeKey } from "@/lib/pricing";
import { generateRefCode } from "@/lib/refCode";
import { validateLeadSubmission, cleanThaiPhone } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = validateLeadSubmission(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      lineId,
      propertyType,
      areaSqm,
      selectedZones,
      materialGrade,
    } = body;

    const phoneNumber = validation.cleanedPhone!;

    // Compute verified price estimate
    const estimate = calculateEstimate({
      propertyType: propertyType as PropertyType,
      areaSqm: Number(areaSqm),
      selectedZones: selectedZones as DecorationZoneKey[],
      materialGrade: materialGrade as MaterialGradeKey,
    });

    if (estimate.isZeroZone) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot create lead without decoration zones",
        },
        { status: 400 }
      );
    }

    // Generate unique Ref ID (ADR 0004)
    const refCode = generateRefCode();

    // Persist to database (Neon Postgres via Prisma with fallback)
    const lead = await db.lead.create({
      data: {
        refCode,
        customerName: customerName.trim(),
        phoneNumber,
        lineId: lineId ? lineId.trim() : null,
        propertyType,
        areaSqm: Number(areaSqm),
        selectedZones,
        materialGrade,
        estimatedMin: estimate.estimatedMin,
        estimatedMax: estimate.estimatedMax,
        status: "NEW_LEAD",
        notes: null,
      },
    });

    // Property Label in Thai
    const propertyLabel =
      propertyType === "CONDO"
        ? "คอนโด"
        : propertyType === "TOWNHOME"
        ? "ทาวน์โฮม"
        : "บ้านเดี่ยว";

    // Format human-friendly budget range (e.g. 2.85-3.4 แสน or ฿285,000 – ฿340,000)
    const minStr = (estimate.estimatedMin / 100_000).toFixed(2);
    const maxStr = (estimate.estimatedMax / 100_000).toFixed(2);

    const lineMessage = `สวัสดีครับ สนใจปรึกษาแบบตกแต่งห้องตามใบประเมิน ${refCode} (${propertyLabel} ${areaSqm} ตร.ม. เกรด ${materialGrade} งบประเมิน ${minStr}-${maxStr} แสนบาท)`;

    const lineOaId = process.env.NEXT_PUBLIC_LINE_OA_ID || "@craftspace";
    const lineDeepLink = `https://line.me/R/oaMessage/${encodeURIComponent(
      lineOaId
    )}/?text=${encodeURIComponent(lineMessage)}`;

    const cleanRef = refCode.replace("#", "");
    const slipUrl = `/api/slip/${cleanRef}`;

    return NextResponse.json(
      {
        success: true,
        lead: {
          id: lead.id,
          refCode: lead.refCode,
          customerName: lead.customerName,
          phoneNumber: lead.phoneNumber,
          lineId: lead.lineId,
          propertyType: lead.propertyType,
          areaSqm: lead.areaSqm,
          selectedZones: lead.selectedZones,
          materialGrade: lead.materialGrade,
          estimatedMin: lead.estimatedMin,
          estimatedMax: lead.estimatedMax,
          lineMessage,
          lineDeepLink,
          slipUrl,
          createdAt: lead.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/leads] Error processing lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
