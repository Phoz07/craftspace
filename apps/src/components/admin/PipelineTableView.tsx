"use client";

import {
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Filter,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/db";
import {
  buildLineDeepLink,
  buildLinePrefilledMessage,
} from "@/lib/lineRouting";

interface PipelineTableViewProps {
  leads: LeadRecord[];
  onOpenNotes: (lead: LeadRecord) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
}

const STATUS_LABELS: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW_LEAD: {
    label: "ลีดใหม่ (New)",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  CONTACTED: {
    label: "ติดต่อแล้ว",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  SITE_SURVEY_SCHEDULED: {
    label: "นัดหมายสำรวจ",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  WON: {
    label: "ปิดการขาย (Won)",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  LOST: {
    label: "ยกเลิก / ไม่พร้อม",
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

export function PipelineTableView({
  leads,
  onOpenNotes,
  onUpdateStatus,
}: PipelineTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Filter leads based on search query and status pill
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        selectedStatus === "ALL" || lead.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.customerName.toLowerCase().includes(q) ||
        lead.phoneNumber.includes(q) ||
        lead.refCode.toLowerCase().includes(q) ||
        (lead.lineId && lead.lineId.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [leads, searchQuery, selectedStatus]);

  const handleCopyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    } catch (e) {
      console.error("Failed to copy ref code", e);
    }
  };

  // CSV Export with UTF-8 BOM for Thai Excel support
  const handleExportCsv = () => {
    const headers = [
      "วันที่สร้าง",
      "รหัสใบประเมิน",
      "ชื่อลูกค้า",
      "เบอร์โทรศัพท์",
      "LINE ID",
      "ประเภทที่พักอาศัย",
      "พื้นที่ (ตร.ม.)",
      "เกรดวัสดุ",
      "โซนตกแต่ง",
      "งบประเมินต่ำสุด (บาท)",
      "งบประเมินสูงสุด (บาท)",
      "สถานะ",
      "บันทึกภายใน",
    ];

    const rows = filteredLeads.map((l) => {
      const createdStr = new Date(l.createdAt).toLocaleString("th-TH");
      const propLabel =
        l.propertyType === "CONDO"
          ? "คอนโด"
          : l.propertyType === "TOWNHOME"
            ? "ทาวน์โฮม"
            : "บ้านเดี่ยว";
      const zonesStr = (l.selectedZones || []).join(", ");
      const statusLabel = STATUS_LABELS[l.status]?.label || l.status;
      const cleanNotes = (l.notes || "").replace(/"/g, '""');

      return [
        `"${createdStr}"`,
        `"${l.refCode}"`,
        `"${l.customerName}"`,
        `"${l.phoneNumber}"`,
        `"${l.lineId || "-"}"`,
        `"${propLabel}"`,
        l.areaSqm,
        `"${l.materialGrade}"`,
        `"${zonesStr}"`,
        l.estimatedMin,
        l.estimatedMax,
        `"${statusLabel}"`,
        `"${cleanNotes}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `CraftSpace-Leads-Export-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Status Pills, Export */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE4DA] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7368]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามเบอร์โทร, ชื่อ, หรือ Ref Code (#CS-...)"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#EAE4DA] bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B]"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setSelectedStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedStatus === "ALL"
                ? "bg-[#1F1D1A] text-white"
                : "bg-[#F3EFE6] text-[#7A7368] hover:text-[#1F1D1A]"
            }`}
          >
            ทั้งหมด ({leads.length})
          </button>
          {(
            [
              "NEW_LEAD",
              "CONTACTED",
              "SITE_SURVEY_SCHEDULED",
              "WON",
              "LOST",
            ] as LeadStatus[]
          ).map((st) => {
            const count = leads.filter((l) => l.status === st).length;
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#8F653B] text-white shadow-xs"
                    : "bg-[#F3EFE6] text-[#7A7368] hover:text-[#1F1D1A]"
                }`}
              >
                {STATUS_LABELS[st].label} ({count})
              </button>
            );
          })}
        </div>

        {/* CSV Export Button */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#EAE4DA] text-xs font-semibold text-[#1F1D1A] hover:bg-[#F3EFE6] hover:border-[#8F653B] transition-colors shrink-0 shadow-xs"
          title="ส่งออกไฟล์ CSV สำหรับ Microsoft Excel"
        >
          <Download className="w-3.5 h-3.5 text-[#8F653B]" />
          <span>Export CSV ({filteredLeads.length})</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#EAE4DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-[#EAE4DA] text-[#7A7368] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">วันที่ / เวลา</th>
                <th className="py-3 px-4">รหัสใบประเมิน</th>
                <th className="py-3 px-4">ข้อมูลลูกค้า</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4">สเปก & พื้นที่</th>
                <th className="py-3 px-4">งบประมาณประเมิน</th>
                <th className="py-3 px-4">สถานะไปป์ไลน์</th>
                <th className="py-3 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4DA]/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#7A7368]">
                    <Layers className="w-8 h-8 mx-auto text-[#A8A196] mb-2 opacity-50" />
                    <span>ไม่พบข้อมูลลีดตามเงื่อนไขการค้นหา</span>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const createdDate = new Date(lead.createdAt);
                  const dateFormatted = new Intl.DateTimeFormat("th-TH", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(createdDate);

                  const propThai =
                    lead.propertyType === "CONDO"
                      ? "คอนโด"
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
                  const statusStyle = STATUS_LABELS[lead.status];

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FBF9F5] transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-[#7A7368]">
                        <span className="font-mono">{dateFormatted}</span>
                      </td>

                      {/* Ref ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-[#8F653B]">
                          <span>{lead.refCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyRef(lead.refCode)}
                            className="p-1 rounded text-[#A8A196] hover:text-[#1F1D1A]"
                            title="คัดลอก Ref Code"
                          >
                            {copiedRef === lead.refCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer Name & LINE ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#1F1D1A]">
                          {lead.customerName}
                        </div>
                        {lead.lineId ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            LINE: {lead.lineId}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A8A196] block">
                            (ไม่มี LINE ID)
                          </span>
                        )}
                      </td>

                      {/* Phone Number */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <a
                          href={`tel:${lead.phoneNumber}`}
                          className="font-mono text-[#1F1D1A] font-semibold hover:text-[#8F653B] inline-flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3 text-[#8F653B]" />
                          <span>{lead.phoneNumber}</span>
                        </a>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-[#1F1D1A]">
                          <span className="font-semibold">{propThai}</span>{" "}
                          <span>{lead.areaSqm} ตร.ม.</span>
                        </div>
                        <div className="text-[10px] text-[#7A7368] mt-0.5">
                          เกรด {lead.materialGrade} •{" "}
                          {lead.selectedZones?.length || 0} โซน
                        </div>
                      </td>

                      {/* Estimated Price Range */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#1F1D1A]">
                          ฿{lead.estimatedMin.toLocaleString()} – ฿
                          {lead.estimatedMax.toLocaleString()}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              onUpdateStatus(
                                lead.id,
                                e.target.value as LeadStatus,
                              )
                            }
                            className={`appearance-none px-2.5 py-1 pr-6 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8F653B] ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <option value="NEW_LEAD">ลีดใหม่ (New)</option>
                            <option value="CONTACTED">ติดต่อแล้ว</option>
                            <option value="SITE_SURVEY_SCHEDULED">
                              นัดหมายสำรวจ
                            </option>
                            <option value="WON">ปิดการขาย (Won)</option>
                            <option value="LOST">ยกเลิก / ไม่พร้อม</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Dial tel */}
                          <a
                            href={`tel:${lead.phoneNumber}`}
                            className="p-1.5 rounded-lg bg-[#F3EFE6] text-[#1F1D1A] hover:bg-[#8F653B] hover:text-white transition-colors"
                            title="โทรออกทันที"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* Open LINE Chat */}
                          <a
                            href={lineLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                            title="เปิดแชท LINE OA พร้อมข้อความสรุป"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* View / Download Slip */}
                          <a
                            href={`/api/slip/${cleanRef}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors border border-amber-200"
                            title="ดูภาพสลิปประเมินราคา 9:16"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </a>

                          {/* Lead Notes */}
                          <button
                            type="button"
                            onClick={() => onOpenNotes(lead)}
                            className="p-1.5 rounded-lg bg-[#F8F6F0] text-[#7A7368] hover:text-[#1F1D1A] hover:bg-[#EAE4DA] transition-colors border border-[#EAE4DA]"
                            title="บันทึกและดูรายละเอียด"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
