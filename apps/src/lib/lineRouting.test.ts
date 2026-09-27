import { describe, expect, it } from "vitest";
import {
  buildLinePrefilledMessage,
  buildLineDeepLink,
  generateQrCodeDataUrl,
  getPropertyThaiLabel,
} from "./lineRouting";

describe("Omnichannel LINE Routing utilities", () => {
  it("translates property types to standard Thai labels", () => {
    expect(getPropertyThaiLabel("CONDO")).toBe("คอนโด");
    expect(getPropertyThaiLabel("TOWNHOME")).toBe("ทาวน์โฮม");
    expect(getPropertyThaiLabel("HOUSE")).toBe("บ้านเดี่ยว");
    expect(getPropertyThaiLabel("OTHER")).toBe("OTHER");
  });

  it("builds correct prefilled LINE inquiry message with all lead details", () => {
    const message = buildLinePrefilledMessage({
      refCode: "#CS-2609-7K2X",
      propertyType: "CONDO",
      areaSqm: 35,
      materialGrade: "PREMIUM",
      estimatedMin: 222750,
      estimatedMax: 267300,
    });

    expect(message).toBe(
      "สวัสดีครับ สนใจปรึกษาแบบตกแต่งห้องตามใบประเมิน #CS-2609-7K2X (คอนโด 35 ตร.ม. เกรด PREMIUM งบประเมิน ฿222,750 – ฿267,300)"
    );
  });

  it("builds official LINE oaMessage deep link with URL-encoded parameters", () => {
    const message = "สวัสดีครับ สนใจปรึกษาแบบตกแต่งห้องตามใบประเมิน #CS-2609-7K2X";
    const deepLink = buildLineDeepLink(message, "@craftspace");

    expect(deepLink).toMatch(/^https:\/\/line\.me\/R\/oaMessage\/%40craftspace\/\?text=/);
    expect(decodeURIComponent(deepLink)).toContain("@craftspace/?text=" + message);
  });

  it("generates valid PNG base64 QR code data URL for desktop scanning", async () => {
    const deepLink = "https://line.me/R/oaMessage/%40craftspace/?text=test";
    const dataUrl = await generateQrCodeDataUrl(deepLink);

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(dataUrl.length).toBeGreaterThan(100);
  });
});
