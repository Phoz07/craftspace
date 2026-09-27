"use client";

import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Laptop,
  MessageSquare,
  QrCode,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { LeadSubmissionResponse } from "./LeadCaptureModal";

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadSubmissionResponse | null;
}

export function SubmissionSuccessModal({
  isOpen,
  onClose,
  lead,
}: SubmissionSuccessModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [hasCopiedMessage, setHasCopiedMessage] = useState(false);
  const [hasCopiedRef, setHasCopiedRef] = useState(false);
  const [activeTab, setActiveTab] = useState<"mobile" | "desktop">("mobile");

  // Automatically detect client device screen width to default tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        setActiveTab("desktop");
      } else {
        setActiveTab("mobile");
      }
    }
  }, [isOpen]);

  // Generate dynamic QR code encoding the exact LINE oaMessage deep link
  useEffect(() => {
    if (lead?.lineDeepLink) {
      QRCode.toDataURL(lead.lineDeepLink, {
        width: 240,
        margin: 1,
        color: {
          dark: "#1F1D1A",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("Failed to generate QR code", err));
    }
  }, [lead?.lineDeepLink]);

  if (!isOpen || !lead) return null;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(lead.lineMessage);
      setHasCopiedMessage(true);
      setTimeout(() => setHasCopiedMessage(false), 2500);
    } catch (err) {
      console.error("Failed to copy line message", err);
    }
  };

  const handleCopyRefCode = async () => {
    try {
      await navigator.clipboard.writeText(lead.refCode);
      setHasCopiedRef(true);
      setTimeout(() => setHasCopiedRef(false), 2500);
    } catch (err) {
      console.error("Failed to copy ref code", err);
    }
  };

  const propertyLabel =
    lead.propertyType === "CONDO"
      ? "คอนโดมิเนียม"
      : lead.propertyType === "TOWNHOME"
        ? "ทาวน์โฮม"
        : "บ้านเดี่ยว";

  const slipFilename = `CraftSpace-Slip-${lead.refCode.replace("#", "")}.png`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EAE4DA] overflow-hidden overflow-y-auto max-h-[94vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F3EFE6] text-[#7A7368] hover:text-[#1F1D1A] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="bg-[#1F1D1A] text-[#FBF9F5] p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#DFB978]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#DFB978]/20 text-[#DFB978] mb-3.5 border border-[#DFB978]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            บันทึกข้อมูลและออกใบประเมินสำเร็จ!
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A196] mt-1.5 max-w-md mx-auto">
            คุณ {lead.customerName} ได้รับสิทธิ์สำรวจหน้างานฟรี (มูลค่า ฿3,500) เรียบร้อยแล้ว
          </p>

          {/* Reference ID Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2B2723] border border-[#453E36]">
            <span className="text-[11px] text-[#A8A196] uppercase tracking-wider">
              Reference ID:
            </span>
            <span className="font-mono font-bold text-base text-[#DFB978]">
              {lead.refCode}
            </span>
            <button
              type="button"
              onClick={handleCopyRefCode}
              title="คัดลอกรหัสอ้างอิง"
              className="p-1 rounded-md hover:bg-[#3D3730] text-[#A8A196] hover:text-white transition-colors"
            >
              {hasCopiedRef ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Scope & Estimate Recap */}
          <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#7A7368] block">
                {propertyLabel} • {lead.areaSqm} ตร.ม. • เกรด{" "}
                {lead.materialGrade} • {lead.selectedZones.length} โซน
              </span>
              <span className="text-base font-bold text-[#1F1D1A] mt-0.5 block">
                ช่วงงบประเมิน ฿{lead.estimatedMin.toLocaleString()} – ฿
                {lead.estimatedMax.toLocaleString()}
              </span>
            </div>
            <a
              href={lead.slipUrl}
              download={slipFilename}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#8F653B] text-[#8F653B] font-bold text-xs hover:bg-[#8F653B] hover:text-white transition-all shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดสลิป (9:16)</span>
            </a>
          </div>

          {/* Omnichannel Channel Selector (Mobile 1-Click vs Desktop QR) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7368]">
                ช่องทางเชื่อมต่อ LINE Official
              </span>
              <div className="inline-flex rounded-lg bg-[#F3EFE6] p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("mobile")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
                    activeTab === "mobile"
                      ? "bg-white text-[#1F1D1A] shadow-xs"
                      : "text-[#7A7368] hover:text-[#1F1D1A]"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>มือถือ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("desktop")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
                    activeTab === "desktop"
                      ? "bg-white text-[#1F1D1A] shadow-xs"
                      : "text-[#7A7368] hover:text-[#1F1D1A]"
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>คอมพิวเตอร์</span>
                </button>
              </div>
            </div>

            {/* Mobile Experience: 1-Click Deep Link */}
            {activeTab === "mobile" && (
              <div className="space-y-3">
                <a
                  href={lead.lineDeepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 text-center"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>เปิด LINE แชทเพื่อรับสิทธิ์ทันที</span>
                </a>
                <p className="text-[11px] text-[#7A7368] text-center">
                  เมื่อกดเปิด ระบบจะนำคุณเข้าสู่แอป LINE
                  และพิมพ์ข้อความสรุปสเปกให้ทันทีโดยไม่ต้องพิมพ์ซ้ำ
                </p>
              </div>
            )}

            {/* Desktop Experience: Dynamic QR Code */}
            {activeTab === "desktop" && (
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE4DA] text-center space-y-3">
                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#EAE4DA]">
                    <img
                      src={qrCodeDataUrl}
                      alt="LINE OA Dynamic QR Code"
                      width={180}
                      height={180}
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <QrCode className="w-10 h-10 text-gray-400 animate-pulse" />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#1F1D1A]">
                    เปิดกล้องมือถือสแกน QR Code เพื่อส่งข้อมูล
                  </p>
                  <p className="text-[11px] text-[#7A7368] max-w-xs">
                    ข้อความและรหัสอ้างอิงของคุณจะเด้งเข้าหน้าต่างแชท LINE ในมือถือทันที
                  </p>
                </div>
              </div>
            )}

            {/* Copy Summary Text Action */}
            <div className="p-3.5 rounded-xl bg-white border border-[#EAE4DA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#7A7368]">
                  ข้อความสรุปสำหรับส่งแอดมิน:
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F3EFE6] text-[#8F653B] hover:bg-[#EAE4DA] transition-colors"
                >
                  {hasCopiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">คัดลอกเรียบร้อย!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกข้อความสรุป</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-[#1F1D1A] bg-[#FBF9F5] p-2.5 rounded-lg font-mono border border-[#EAE4DA] line-clamp-2">
                {lead.lineMessage}
              </p>
            </div>

            {/* Fallback LINE ID & LINE PC Direct Link */}
            <div className="pt-2 border-t border-[#EAE4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7A7368]">
              <div className="flex items-center gap-1.5">
                <span>LINE Official ID:</span>
                <span className="font-bold text-[#1F1D1A]">@craftspace</span>
                <span className="text-[11px] text-[#A8A196]">
                  (พิมพ์มี @ ด้วยนะครับ)
                </span>
              </div>
              <a
                href="https://line.me/R/ti/p/@craftspace"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#8F653B] font-semibold hover:underline"
              >
                <span>เปิดใน LINE PC</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F3EFE6] px-6 py-4 border-t border-[#EAE4DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A7368]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C89D53] shrink-0" />
            <span>เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม. เพื่อยืนยันวันสำรวจหน้างาน</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#EAE4DA] text-[#1F1D1A] font-semibold hover:bg-gray-50 transition-colors shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
