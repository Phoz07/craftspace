"use client";

import {
  Calendar,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Layers,
  Loader2,
  MessageSquare,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/db";
import {
  buildLineDeepLink,
  buildLinePrefilledMessage,
} from "@/lib/lineRouting";

interface LeadNotesModalProps {
  lead: LeadRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, notes: string, status: LeadStatus) => Promise<void>;
}

export function LeadNotesModal({
  lead,
  isOpen,
  onClose,
  onSave,
}: LeadNotesModalProps) {
  const [notes, setNotes] = useState(lead?.notes || "");
  const [status, setStatus] = useState<LeadStatus>(lead?.status || "NEW_LEAD");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when lead changes
  if (!isOpen || !lead) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await onSave(lead.id, notes, status);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Failed to save lead notes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const propThai =
    lead.propertyType === "CONDO"
      ? "คอนโดมิเนียม"
      : lead.propertyType === "TOWNHOME"
        ? "ทาวน์โฮม"
        : "บ้านเดี่ยว";

  const message = buildLinePrefilledMessage({
    refCode: lead.refCode,
    propertyType: lead.propertyType,
    areaSqm: lead.areaSqm,
    materialGrade: lead.materialGrade,
    estimatedMin: lead.estimatedMin,
    estimatedMax: lead.estimatedMax,
  });
  const lineLink = buildLineDeepLink(message);
  const cleanRef = lead.refCode.replace("#", "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE4DA] overflow-hidden overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#F3EFE6] text-[#7A7368] hover:text-[#1F1D1A] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#1F1D1A] text-[#FBF9F5] p-6 sm:p-7 relative">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB978] mb-1.5">
            <Sparkles className="w-4 h-4 text-[#C89D53]" />
            <span>รายละเอียดลีดและบันทึกภายในสตูดิโอ</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {lead.customerName}
            </h2>
            <div className="font-mono text-sm px-3 py-1 rounded-xl bg-[#292622] text-[#DFB978] border border-[#3D3730] inline-block w-fit">
              {lead.refCode}
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <a
              href={`tel:${lead.phoneNumber}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B2723] text-white hover:bg-[#3D3730] transition-colors border border-[#453E36]"
            >
              <Phone className="w-3.5 h-3.5 text-[#DFB978]" />
              <span>{lead.phoneNumber}</span>
            </a>
            {lead.lineId && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>LINE: {lead.lineId}</span>
              </span>
            )}
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>เปิด LINE OA Chat</span>
            </a>
            <a
              href={`/api/slip/${cleanRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EFE6] text-[#8F653B] font-semibold hover:bg-white transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ดูสลิปสรุปราคา (9:16)</span>
            </a>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-7 space-y-5">
          {/* Scope & Estimate Recap Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE4DA] text-xs">
            <div>
              <span className="text-[#7A7368] block text-[11px]">ประเภท</span>
              <span className="font-bold text-[#1F1D1A] mt-0.5 block">
                {propThai}
              </span>
            </div>
            <div>
              <span className="text-[#7A7368] block text-[11px]">พื้นที่</span>
              <span className="font-bold text-[#1F1D1A] mt-0.5 block">
                {lead.areaSqm} ตร.ม.
              </span>
            </div>
            <div>
              <span className="text-[#7A7368] block text-[11px]">เกรดวัสดุ</span>
              <span className="font-bold text-[#8F653B] mt-0.5 block">
                {lead.materialGrade} Grade
              </span>
            </div>
            <div>
              <span className="text-[#7A7368] block text-[11px]">
                งบประมาณประเมิน
              </span>
              <span className="font-bold text-[#1F1D1A] mt-0.5 block">
                ฿{lead.estimatedMin.toLocaleString()} – ฿
                {lead.estimatedMax.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Zones */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#7A7368]">
              โซนที่ลูกค้าเลือก ({lead.selectedZones?.length || 0} โซน):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {lead.selectedZones?.map((z) => (
                <span
                  key={z}
                  className="px-2.5 py-1 rounded-lg bg-[#F3EFE6] text-[#1F1D1A] text-xs font-medium border border-[#E5DED3]"
                >
                  {z}
                </span>
              ))}
            </div>
          </div>

          {/* Status Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F1D1A]">
              สถานะขั้นตอนการขาย (Pipeline Stage)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#EAE4DA] bg-[#FBF9F5] text-xs sm:text-sm font-semibold text-[#1F1D1A] focus:outline-none focus:ring-2 focus:ring-[#8F653B]"
            >
              <option value="NEW_LEAD">NEW_LEAD (ลีดใหม่ ยังไม่ได้ติดต่อ)</option>
              <option value="CONTACTED">
                CONTACTED (ติดต่อโทร/แชทคุยเบื้องต้นแล้ว)
              </option>
              <option value="SITE_SURVEY_SCHEDULED">
                SITE_SURVEY_SCHEDULED (นัดหมายสำรวจหน้างานฟรีแล้ว)
              </option>
              <option value="WON">WON (ปิดการขายสำเร็จ / เซ็นสัญญา)</option>
              <option value="LOST">LOST (ลูกค้ายกเลิก / ยังไม่พร้อม)</option>
            </select>
          </div>

          {/* Qualitative Notes Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1F1D1A]">
              บันทึกข้อความภายในสตูดิโอ (Internal Qualitative Notes)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="บันทึกข้อความ เช่น ลูกค้าต้องการบิวท์อินไม้โทนอ่อน สไตล์มินิมอลญี่ปุ่น นัดวัดพื้นที่วันเสาร์ 10 โมง..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#EAE4DA] bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B] leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="text-[11px] text-[#7A7368]">
              {savedSuccess && (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>บันทึกข้อมูลเรียบร้อยแล้ว</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#EAE4DA] text-xs font-semibold text-[#7A7368] hover:text-[#1F1D1A] hover:bg-[#F3EFE6] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-[#8F653B] hover:bg-[#724E2B] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <span>บันทึกการเปลี่ยนแปลง</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
