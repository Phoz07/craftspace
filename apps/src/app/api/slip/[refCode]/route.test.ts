import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/slip/[refCode] Server-side Satori Slip Generation Seam", () => {
  it("renders a valid PNG slip for an existing lead with image/png content type", async () => {
    // Lead-01 is seeded with refCode #CS-2609-7K2X
    const req = new Request("http://localhost:3000/api/slip/CS-2609-7K2X");
    const params = Promise.resolve({ refCode: "CS-2609-7K2X" });

    const response = await GET(req, { params });
    expect(response.status).toBe(200);

    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("image/png");

    const arrayBuffer = await response.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(1000);

    // Verify PNG magic signature: 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A
    const bytes = new Uint8Array(arrayBuffer);
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50); // P
    expect(bytes[2]).toBe(0x4e); // N
    expect(bytes[3]).toBe(0x47); // G
  });

  it("returns 404 when refCode does not exist", async () => {
    const req = new Request("http://localhost:3000/api/slip/NON-EXISTENT");
    const params = Promise.resolve({ refCode: "NON-EXISTENT" });

    const response = await GET(req, { params });
    expect(response.status).toBe(404);
  });
});
