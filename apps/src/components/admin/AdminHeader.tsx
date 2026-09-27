"use client";

import Link from "next/link";
import {
  LayoutList,
  Columns3,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import { type LeadRecord } from "@/lib/db";

interface AdminHeaderProps {
  currentView: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
  leads: LeadRecord[];
}

export function AdminHeader({
  currentView,
  onViewChange,
  leads,
}: AdminHeaderProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (e) {
      console.error("Logout failed:", e);
      window.location.href = "/admin/login";
    }
  };

  const newLeadsCount = leads.filter((l) => l.status === "NEW_LEAD").length;
  const contactedCount = leads.filter((l) => l.status === "CONTACTED").length;
  const siteSurveyCount = leads.filter(
    (l) => l.status === "SITE_SURVEY_SCHEDULED"
  ).length;

  return (
    <header className="bg-[#1F1D1A] text-[#FBF9F5] border-b border-[#3D3730] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-4">
          {/* Brand Left */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2B2723] border border-[#524B43] flex items-center justify-center text-[#DFB978]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-wider text-white">
                    CRAFTSPACE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFB978]/20 text-[#DFB978] border border-[#DFB978]/30 font-semibold uppercase">
                    Admin Pipeline
                  </span>
                </div>
                <p className="text-[11px] text-[#A8A196]">
                  Sales Lead Qualification & Pipeline Tracking
                </p>
              </div>
            </div>

            {/* Public Link on Mobile */}
            <Link
              href="/"
              target="_blank"
              className="sm:hidden p-2 rounded-lg bg-[#2B2723] text-[#A8A196] hover:text-white"
              title="ดูหน้าบ้าน"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-[#292622] border border-[#3D3730] flex items-center gap-2">
              <span className="text-[#A8A196]">ทั้งหมด:</span>
              <span className="font-bold text-white">{leads.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#292622] border border-[#3D3730] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[#A8A196]">ลีดใหม่:</span>
              <span className="font-bold text-amber-400">{newLeadsCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#292622] border border-[#3D3730] flex items-center gap-2">
              <span className="text-[#A8A196]">ติดต่อแล้ว:</span>
              <span className="font-bold text-blue-400">{contactedCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#292622] border border-[#3D3730] flex items-center gap-2">
              <span className="text-[#A8A196]">นัดสำรวจ:</span>
              <span className="font-bold text-purple-400">{siteSurveyCount}</span>
            </div>
          </div>

          {/* Actions & View Switcher */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* View Switcher Tabs */}
            <div className="inline-flex rounded-xl bg-[#292622] p-1 border border-[#3D3730] text-xs font-semibold">
              <button
                type="button"
                onClick={() => onViewChange("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentView === "table"
                    ? "bg-[#DFB978] text-[#1F1D1A] shadow-xs"
                    : "text-[#A8A196] hover:text-white"
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span>ตาราง (Table)</span>
              </button>
              <button
                type="button"
                onClick={() => onViewChange("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentView === "kanban"
                    ? "bg-[#DFB978] text-[#1F1D1A] shadow-xs"
                    : "text-[#A8A196] hover:text-white"
                }`}
              >
                <Columns3 className="w-4 h-4" />
                <span>คัมบัง (Kanban)</span>
              </button>
            </div>

            {/* Public Link on Desktop */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#292622] border border-[#3D3730] text-xs font-medium text-[#A8A196] hover:text-white hover:border-[#524B43] transition-colors"
            >
              <span>ดูหน้าเว็บ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-900/60 text-xs font-medium text-red-300 hover:bg-red-900/40 hover:text-white transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
