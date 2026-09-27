import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/leads Integration Seam", () => {
  it("creates a new lead and returns 201 with Ref ID, LINE deep link, and slip URL", async () => {
    const payload = {
      customerName: "คุณทดสอบ ระบบ",
      phoneNumber: "0891234567",
      lineId: "test_line",
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: ["LIVING", "BEDROOM"],
      materialGrade: "PREMIUM",
    };

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.lead).toBeDefined();
    expect(json.lead.refCode).toMatch(/^#CS-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    expect(json.lead.customerName).toBe("คุณทดสอบ ระบบ");
    expect(json.lead.phoneNumber).toBe("0891234567");
    expect(json.lead.estimatedMin).toBe(135000);
    expect(json.lead.estimatedMax).toBe(162000);
    expect(json.lead.lineDeepLink).toContain("line.me/R/oaMessage");
    expect(json.lead.slipUrl).toMatch(/^\/api\/slip\/CS-/);
  });

  it("returns 400 when validation fails for invalid phone number", async () => {
    const invalidPayload = {
      customerName: "คุณทดสอบ",
      phoneNumber: "021234567", // Landline / non-mobile
      propertyType: "CONDO",
      areaSqm: 35,
      selectedZones: ["LIVING"],
      materialGrade: "STANDARD",
    };

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors.phoneNumber).toBeDefined();
  });
});
