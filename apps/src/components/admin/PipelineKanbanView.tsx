"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/db";
import {
  buildLineDeepLink,
  buildLinePrefilledMessage,
} from "@/lib/lineRouting";

interface PipelineKanbanViewProps {
  leads: LeadRecord[];
  onOpenNotes: (lead: LeadRecord) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
}

const STAGES: Array<{
  id: LeadStatus;
  title: string;
  badgeBg: string;
  badgeText: string;
  headerBorder: string;
}> = [
  {
    id: "NEW_LEAD",
    title: "1. ลีดใหม่ (New)",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    headerBorder: "border-t-amber-400",
  },
  {
    id: "CONTACTED",
    title: "2. ติดต่อแล้ว",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    headerBorder: "border-t-blue-400",
  },
  {
    id: "SITE_SURVEY_SCHEDULED",
    title: "3. นัดหมายสำรวจ",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    headerBorder: "border-t-purple-400",
  },
  {
    id: "WON",
    title: "4. ปิดการขาย (Won)",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    headerBorder: "border-t-emerald-500",
  },
  {
    id: "LOST",
    title: "5. ยกเลิก / ไม่พร้อม",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-700",
    headerBorder: "border-t-gray-400",
  },
];

// Helper to format relative time in Thai
function getRelativeTimeString(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "เมื่อสักครู่";
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  return `${diffDays} วันที่แล้ว`;
}

export function PipelineKanbanView({
  leads,
  onOpenNotes,
  onUpdateStatus,
}: PipelineKanbanViewProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);

  const getStageLeads = (stage: LeadStatus) =>
    leads.filter((l) => l.status === stage);

  // Drag-and-drop handlers using standard HTML5 Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStatus) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: LeadStatus) => {
    e.preventDefault();
    setDragOverStage(null);
    const id = e.dataTransfer.getData("text/plain") || draggedLeadId;
    if (id) {
      const currentLead = leads.find((l) => l.id === id);
      if (currentLead && currentLead.status !== targetStage) {
        await onUpdateStatus(id, targetStage);
      }
    }
    setDraggedLeadId(null);
  };

  // Quick sequential stage shift
  const advanceStage = async (lead: LeadRecord, direction: 1 | -1) => {
    const pipelineOrder: LeadStatus[] = [
      "NEW_LEAD",
      "CONTACTED",
      "SITE_SURVEY_SCHEDULED",
      "WON",
    ];

    if (direction === 1) {
      const currentIndex = pipelineOrder.indexOf(lead.status);
      if (currentIndex >= 0 && currentIndex < pipelineOrder.length - 1) {
        await onUpdateStatus(lead.id, pipelineOrder[currentIndex + 1]);
      }
    } else {
      if (lead.status === "LOST") {
        await onUpdateStatus(lead.id, "NEW_LEAD");
      } else {
        const currentIndex = pipelineOrder.indexOf(lead.status);
        if (currentIndex > 0) {
          await onUpdateStatus(lead.id, pipelineOrder[currentIndex - 1]);
        }
      }
    }
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1200px] items-start">
        {STAGES.map((stage) => {
          const stageLeads = getStageLeads(stage.id);
          const isDragOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex-1 min-w-[240px] bg-[#F8F6F0] rounded-2xl border ${
                isDragOver
                  ? "border-[#8F653B] ring-2 ring-[#8F653B]/20 bg-[#F3EFE6]"
                  : "border-[#EAE4DA]"
              } shadow-xs flex flex-col transition-all border-t-4 ${stage.headerBorder}`}
            >
              {/* Stage Header */}
              <div className="p-3.5 border-b border-[#EAE4DA] flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F1D1A]">
                  {stage.title}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg} ${stage.badgeText}`}
                >
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5 min-h-[500px]">
                {stageLeads.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-[#A8A196] border-2 border-dashed border-[#EAE4DA] rounded-xl text-xs">
                    <span>ไม่มีลีดในสถานะนี้</span>
                    <span className="text-[10px] mt-0.5">ลากการ์ดมาวางที่นี่</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const message = buildLinePrefilledMessage({
                      refCode: lead.refCode,
                      propertyType: lead.propertyType,
                      areaSqm: lead.areaSqm,
                      materialGrade: lead.materialGrade,
                      estimatedMin: lead.estimatedMin,
                      estimatedMax: lead.estimatedMax,
                    });
                    const lineLink = buildLineDeepLink(message);
                    const relativeTime = getRelativeTimeString(lead.createdAt);

                    const propThai =
                      lead.propertyType === "CONDO"
                        ? "คอนโด"
                        : lead.propertyType === "TOWNHOME"
                          ? "ทาวน์โฮม"
                          : "บ้านเดี่ยว";

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="bg-white p-3.5 rounded-xl border border-[#EAE4DA] shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5 group"
                      >
                        {/* Ref ID & Relative Time Badge */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[#8F653B]">
                            {lead.refCode}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#7A7368] text-[10px]">
                            <Clock className="w-3 h-3" />
                            <span>{relativeTime}</span>
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-bold text-xs text-[#1F1D1A]">
                            {lead.customerName}
                          </h4>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-[#7A7368]">
                            <span className="font-medium text-[#1F1D1A]">
                              {propThai} {lead.areaSqm} ตร.ม.
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F3EFE6] text-[#8F653B] font-semibold">
                              {lead.materialGrade}
                            </span>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="pt-1.5 border-t border-[#F3EFE6] flex items-center justify-between text-xs">
                          <span className="text-[10px] text-[#7A7368]">
                            งบประมาณ:
                          </span>
                          <span className="font-bold text-[#1F1D1A] text-[11px]">
                            ฿{(lead.estimatedMin / 1000).toFixed(0)}k – ฿
                            {(lead.estimatedMax / 1000).toFixed(0)}k
                          </span>
                        </div>

                        {/* Notes Preview if available */}
                        {lead.notes && (
                          <div className="p-2 rounded-lg bg-[#FBF9F5] border border-[#EAE4DA] text-[10px] text-[#7A7368] line-clamp-2 leading-relaxed">
                            {lead.notes}
                          </div>
                        )}

                        {/* Action Buttons Bar */}
                        <div className="pt-1.5 border-t border-[#F3EFE6] flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${lead.phoneNumber}`}
                              className="p-1.5 rounded-lg bg-[#F3EFE6] text-[#1F1D1A] hover:bg-[#8F653B] hover:text-white transition-colors"
                              title="โทรหาลูกค้า"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={lineLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                              title="เปิดแชท LINE OA"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => onOpenNotes(lead)}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-[#1F1D1A] hover:text-white transition-colors border border-gray-200"
                              title="บันทึกข้อความ"
                            >
                              <FileText className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Stage Shift Controls */}
                          <div className="flex items-center gap-0.5">
                            {stage.id !== "NEW_LEAD" && (
                              <button
                                type="button"
                                onClick={() => advanceStage(lead, -1)}
                                className="p-1 rounded text-[#A8A196] hover:text-[#1F1D1A] hover:bg-[#F3EFE6]"
                                title="ย้อนขั้นก่อนหน้า"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {stage.id !== "WON" && stage.id !== "LOST" && (
                              <button
                                type="button"
                                onClick={() => advanceStage(lead, 1)}
                                className="p-1 rounded text-[#8F653B] hover:text-white hover:bg-[#8F653B] transition-colors"
                                title="เลื่อนขั้นถัดไป"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
