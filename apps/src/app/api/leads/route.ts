import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateEstimate, type PropertyType, type DecorationZoneKey, type MaterialGradeKey } from "@/lib/pricing";
import { generateRefCode } from "@/lib/refCode";
import { validateLeadSubmission, cleanThaiPhone } from "@/lib/validation";
import { buildLinePrefilledMessage, buildLineDeepLink } from "@/lib/lineRouting";

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

    const lineMessage = buildLinePrefilledMessage({
      refCode,
      propertyType,
      areaSqm: Number(areaSqm),
      materialGrade,
      estimatedMin: estimate.estimatedMin,
      estimatedMax: estimate.estimatedMax,
    });

    const lineDeepLink = buildLineDeepLink(lineMessage);

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
