import { NextResponse } from "next/server";
import { db, type LeadStatus } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() as LeadStatus | undefined;

    const whereClause: {
      status?: LeadStatus;
      OR?: Array<{
        phoneNumber?: { contains: string };
        refCode?: { contains: string };
        customerName?: { contains: string };
      }>;
    } = {};

    if (status && status !== ("ALL" as any)) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { phoneNumber: { contains: search } },
        { refCode: { contains: search } },
        { customerName: { contains: search } },
      ];
    }

    const leads = await db.lead.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
    });
  } catch (error) {
    console.error("[api/admin/leads] Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
