import { NextResponse } from "next/server";
import { db, type LeadStatus } from "@/lib/db";

const VALID_STATUSES: LeadStatus[] = [
  "NEW_LEAD",
  "CONTACTED",
  "SITE_SURVEY_SCHEDULED",
  "WON",
  "LOST",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing lead ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const updateData: {
      status?: LeadStatus;
      notes?: string | null;
    } = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: "Invalid lead status" },
          { status: 400 },
        );
      }
      updateData.status = body.status;
    }

    if (body.notes !== undefined) {
      updateData.notes =
        typeof body.notes === "string" ? body.notes.trim() : null;
    }

    const updated = await db.lead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      lead: updated,
    });
  } catch (error) {
    console.error("[api/admin/leads/[id]] Error updating lead:", error);
    return NextResponse.json(
      { success: false, error: "Lead not found or update failed" },
      { status: 500 },
    );
  }
}
