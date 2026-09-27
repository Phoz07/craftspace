export interface LeadSubmissionPayload {
  customerName: string;
  phoneNumber: string;
  lineId?: string | null;
  propertyType: string;
  areaSqm: number;
  selectedZones: string[];
  materialGrade: string;
}

export function cleanThaiPhone(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+66")) {
    cleaned = `0${cleaned.slice(3)}`;
  }
  return cleaned;
}

export function isValidThaiMobilePhone(phone: string): boolean {
  const cleaned = cleanThaiPhone(phone);
  // Thai mobile numbers are 10 digits starting with 06, 08, or 09
  const regex = /^0[689]\d{8}$/;
  return regex.test(cleaned);
}

export function validateLeadSubmission(data: Partial<LeadSubmissionPayload>): {
  isValid: boolean;
  errors: Record<string, string>;
  cleanedPhone?: string;
} {
  const errors: Record<string, string> = {};

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.customerName = "กรุณากรอกชื่อ-นามสกุลสำหรับติดต่อ";
  }

  if (!data.phoneNumber) {
    errors.phoneNumber = "กรุณาระบุหมายเลขโทรศัพท์";
  } else if (!isValidThaiMobilePhone(data.phoneNumber)) {
    errors.phoneNumber = "หมายเลขโทรศัพท์ไม่ถูกต้อง (เช่น 08X-XXX-XXXX)";
  }

  if (
    !data.propertyType ||
    !["CONDO", "TOWNHOME", "HOUSE"].includes(data.propertyType)
  ) {
    errors.propertyType = "กรุณาเลือกประเภทอสังหาริมทรัพย์";
  }

  if (!data.areaSqm || data.areaSqm < 15 || data.areaSqm > 500) {
    errors.areaSqm = "ขนาดพื้นที่ต้องอยู่ระหว่าง 15 - 500 ตร.ม.";
  }

  if (
    !data.selectedZones ||
    !Array.isArray(data.selectedZones) ||
    data.selectedZones.length === 0
  ) {
    errors.selectedZones = "กรุณาเลือกโซนตกแต่งอย่างน้อย 1 โซน";
  }

  if (
    !data.materialGrade ||
    !["STANDARD", "PREMIUM", "LUXURY"].includes(data.materialGrade)
  ) {
    errors.materialGrade = "กรุณาเลือกเกรดวัสดุ";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedPhone: data.phoneNumber
      ? cleanThaiPhone(data.phoneNumber)
      : undefined,
  };
}
