import QRCode from "qrcode";

export interface LineMessageParams {
  refCode: string;
  propertyType: string;
  areaSqm: number;
  materialGrade: string;
  estimatedMin: number;
  estimatedMax: number;
}

/**
 * Maps internal property type to friendly Thai label
 */
export function getPropertyThaiLabel(propertyType: string): string {
  switch (propertyType) {
    case "CONDO":
      return "คอนโด";
    case "TOWNHOME":
      return "ทาวน์โฮม";
    case "HOUSE":
      return "บ้านเดี่ยว";
    default:
      return propertyType;
  }
}

/**
 * Builds standard prefilled LINE OA inquiry message
 * Format: สวัสดีครับ สนใจปรึกษาแบบตกแต่งห้องตามใบประเมิน #CS-YYMM-XXXX (คอนโด 35 ตร.ม. เกรด PREMIUM งบประเมิน ฿222,750 – ฿267,300)
 */
export function buildLinePrefilledMessage(params: LineMessageParams): string {
  const propertyLabel = getPropertyThaiLabel(params.propertyType);
  const minFormatted = params.estimatedMin.toLocaleString();
  const maxFormatted = params.estimatedMax.toLocaleString();

  return `สวัสดีครับ สนใจปรึกษาแบบตกแต่งห้องตามใบประเมิน ${params.refCode} (${propertyLabel} ${params.areaSqm} ตร.ม. เกรด ${params.materialGrade} งบประเมิน ฿${minFormatted} – ฿${maxFormatted})`;
}

/**
 * Builds official LINE deep link using oaMessage scheme
 * Target: https://line.me/R/oaMessage/{LINE_OA_ID}/?text={ENCODED_MESSAGE}
 */
export function buildLineDeepLink(
  message: string,
  oaId: string = process.env.NEXT_PUBLIC_LINE_OA_ID || "@craftspace"
): string {
  const cleanOaId = oaId.startsWith("@") ? oaId : `@${oaId}`;
  return `https://line.me/R/oaMessage/${encodeURIComponent(cleanOaId)}/?text=${encodeURIComponent(message)}`;
}

/**
 * Generates dynamic base64 PNG QR code data URL for desktop scanning
 */
export async function generateQrCodeDataUrl(deepLink: string): Promise<string> {
  return QRCode.toDataURL(deepLink, {
    width: 240,
    margin: 1,
    color: {
      dark: "#1F1D1A",
      light: "#FFFFFF",
    },
  });
}
