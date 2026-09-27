"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { EstimatorState } from "./EstimatorWizard";

export interface LeadSubmissionResponse {
  id: string;
  refCode: string;
  customerName: string;
  phoneNumber: string;
  lineId: string | null;
  propertyType: string;
  areaSqm: number;
  selectedZones: string[];
  materialGrade: string;
  estimatedMin: number;
  estimatedMax: number;
  lineMessage: string;
  lineDeepLink: string;
  slipUrl: string;
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimatorState: EstimatorState | null;
  onSuccess: (lead: LeadSubmissionResponse) => void;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  estimatorState,
  onSuccess,
}: LeadCaptureModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lineId, setLineId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen || !estimatorState) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Basic client validation
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = "กรุณากรอกชื่อ-นามสกุลของคุณ";
    }
    const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์มือถือ 10 หลัก (เช่น 081-234-5678)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          lineId: lineId.trim() || undefined,
          propertyType: estimatorState.propertyType,
          areaSqm: estimatorState.areaSqm,
          selectedZones: estimatorState.selectedZones,
          materialGrade: estimatorState.materialGrade,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
        return;
      }

      // Success! Hand off to success handler
      onSuccess(data.lead);
    } catch (err) {
      console.error("[LeadCaptureModal] submission failed:", err);
      setGeneralError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyLabel =
    estimatorState.propertyType === "CONDO"
      ? "คอนโดมิเนียม"
      : estimatorState.propertyType === "TOWNHOME"
        ? "ทาวน์โฮม"
        : "บ้านเดี่ยว";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EAE4DA] overflow-hidden overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F3EFE6] text-[#7A7368] hover:text-[#1F1D1A] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#1F1D1A] text-[#FBF9F5] p-6 sm:p-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#332F2A] border border-[#524B43] text-xs font-semibold text-[#DFB978] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C89D53]" />
            <span>สิทธิพิเศษสำรวจหน้างานฟรี (มูลค่า ฿3,500)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            รับใบสรุปงบประมาณ & สลิปประเมิน
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1.5 leading-relaxed">
            พร้อมรับสิทธิ์นัดหมายทีมดีไซเนอร์อาวุโสเข้าวัดพื้นที่หน้างานจริงโดยไม่มีค่าใช้จ่าย
          </p>

          {/* Estimate Summary Pill in Header */}
          <div className="mt-4 p-3 rounded-xl bg-[#292622] border border-[#3D3730] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#A8A196] block text-[11px]">
                {propertyLabel} {estimatorState.areaSqm} ตร.ม. (เกรด{" "}
                {estimatorState.materialGrade})
              </span>
              <span className="font-bold text-[#DFB978] text-sm">
                ฿{estimatorState.estimate.estimatedMin.toLocaleString()} – ฿
                {estimatorState.estimate.estimatedMax.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#332F2A] text-[#C89D53] border border-[#524B43]">
              {estimatorState.selectedZones.length} โซน
            </span>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {generalError && (
            <div className="p-3.5 rounded-xl bg-[#FDE8E8] border border-[#FBD5D5] text-[#9B1C1C] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F1D1A]">
              ชื่อ-นามสกุลของคุณ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7368]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="เช่น คุณกิตติศักดิ์ วรเมธ"
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B] transition-all ${
                  errors.customerName
                    ? "border-red-400 bg-red-50/20"
                    : "border-[#EAE4DA]"
                }`}
              />
            </div>
            {errors.customerName && (
              <p className="text-[11px] text-red-500">{errors.customerName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F1D1A]">
              หมายเลขโทรศัพท์มือถือ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7368]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B] transition-all ${
                  errors.phoneNumber
                    ? "border-red-400 bg-red-50/20"
                    : "border-[#EAE4DA]"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-[11px] text-red-500">{errors.phoneNumber}</p>
            )}
            <p className="text-[10px] text-[#7A7368]">
              สำหรับส่งลิงก์ใบสรุปราคาและให้ทีมช่างยืนยันวันสำรวจ
            </p>
          </div>

          {/* LINE ID (Optional) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-[#1F1D1A]">
                LINE ID
              </label>
              <span className="text-[10px] text-[#A8A196]">ไม่บังคับ</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7368]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
                placeholder="ไอดีไลน์ของคุณ"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-[#EAE4DA] bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B] transition-all"
              />
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#7A7368]">
            <ShieldCheck className="w-4 h-4 text-[#8F653B] shrink-0" />
            <span>
              เราเก็บรักษาข้อมูลของคุณเป็นความลับตามมาตรฐาน PDPA ไม่มีการโทรสแปมรบกวน
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#8F653B] hover:bg-[#724E2B] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกและสร้างใบประเมิน...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#DFB978]" />
                  <span>รับสิทธิ์สำรวจฟรี & รับสลิปสรุปราคา</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
