import { describe, expect, it } from "vitest";
import { POST as loginPost } from "./login/route";
import { POST as logoutPost } from "./logout/route";
import { GET as leadsGet } from "./leads/route";
import { PATCH as leadPatch } from "./leads/[id]/route";
import { DEFAULT_ADMIN_PASSCODE } from "@/lib/auth";

describe("Admin API Integration Seam", () => {
  it("POST /api/admin/login authenticates with valid passcode and sets session cookie", async () => {
    const req = new Request("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: DEFAULT_ADMIN_PASSCODE }),
    });

    const res = await loginPost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("craftspace_admin_session=");
  });

  it("POST /api/admin/login rejects invalid passcode with 401", async () => {
    const req = new Request("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: "incorrect-passcode" }),
    });

    const res = await loginPost(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("POST /api/admin/logout clears session cookie", async () => {
    const res = await logoutPost();
    expect(res.status).toBe(200);

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("craftspace_admin_session=");
  });

  it("GET /api/admin/leads returns all 12 initial seed leads", async () => {
    const req = new Request("http://localhost:3000/api/admin/leads");
    const res = await leadsGet(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.leads.length).toBeGreaterThanOrEqual(12);
  });

  it("GET /api/admin/leads filters leads by status and keyword search", async () => {
    // Test status filter
    const statusReq = new Request(
      "http://localhost:3000/api/admin/leads?status=NEW_LEAD"
    );
    const statusRes = await leadsGet(statusReq);
    const statusJson = await statusRes.json();
    expect(statusJson.success).toBe(true);
    expect(
      statusJson.leads.every((l: { status: string }) => l.status === "NEW_LEAD")
    ).toBe(true);

    // Test search filter by customer name or phone
    const searchReq = new Request(
      "http://localhost:3000/api/admin/leads?search=0891234567"
    );
    const searchRes = await leadsGet(searchReq);
    const searchJson = await searchRes.json();
    expect(searchJson.success).toBe(true);
    expect(searchJson.leads.length).toBeGreaterThanOrEqual(1);
    expect(searchJson.leads[0].phoneNumber).toBe("0891234567");
  });

  it("PATCH /api/admin/leads/[id] updates lead status and internal notes", async () => {
    const req = new Request("http://localhost:3000/api/admin/leads/lead-01", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "CONTACTED",
        notes: "โทรคุยกับลูกค้าเรียบร้อย สนใจส่ง Moodboard",
      }),
    });

    const res = await leadPatch(req, {
      params: Promise.resolve({ id: "lead-01" }),
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.lead.status).toBe("CONTACTED");
    expect(json.lead.notes).toBe("โทรคุยกับลูกค้าเรียบร้อย สนใจส่ง Moodboard");
  });
});
