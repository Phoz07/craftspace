"use client";

import {
  Building2,
  Calendar,
  Check,
  MapPin,
  Maximize2,
  Palette,
  Sparkles,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PORTFOLIO_PROJECTS, type PortfolioProject } from "@/data/portfolio";

type PropertyFilter = "ALL" | "CONDO" | "TOWNHOME" | "HOUSE";
type StyleFilter = "ALL" | "JAPANDI" | "LUXURY" | "CLASSIC";

export function PortfolioShowcase() {
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>("ALL");
  const [styleFilter, setStyleFilter] = useState<StyleFilter>("ALL");

  const filteredProjects = useMemo(() => {
    return PORTFOLIO_PROJECTS.filter((project) => {
      const matchProperty =
        propertyFilter === "ALL" || project.propertyType === propertyFilter;
      const matchStyle = styleFilter === "ALL" || project.style === styleFilter;
      return matchProperty && matchStyle;
    });
  }, [propertyFilter, styleFilter]);

  return (
    <section
      id="portfolio"
      className="py-16 sm:py-24 border-t border-[#EAE4DA]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] border border-[#E5DED3] text-xs font-semibold text-[#8F653B]">
              <Sparkles className="w-3.5 h-3.5 text-[#C89D53]" />
              <span>Real Verified Portfolios</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1D1A]">
              ผลงานที่ส่งมอบจริง
              <br />
              <span className="text-[#8F653B]">โปร่งใสทั้งเวลาและงบประมาณ</span>
            </h2>
            <p className="text-sm text-[#5A554E] leading-relaxed">
              ทุกยูนิตถูกออกแบบด้วยความใส่ใจและสร้างขึ้นจากแปลนจริง
              พร้อมข้อมูลขนาดพื้นที่และงบประมาณที่ลูกค้าจ่ายจริงเพื่อใช้เป็นเกณฑ์อ้างอิง
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#7A7368] font-medium block">
              แสดงผลงาน {filteredProjects.length} จากทั้งหมด{" "}
              {PORTFOLIO_PROJECTS.length} โครงการ
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EAE4DA] shadow-xs mb-10 space-y-4">
          {/* Property Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-xs font-semibold text-[#7A7368] uppercase tracking-wider flex items-center gap-1.5 min-w-[120px]">
              <Building2 className="w-3.5 h-3.5 text-[#8F653B]" />
              ประเภทอสังหาฯ:
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "ALL", label: "ทั้งหมด" },
                  { id: "CONDO", label: "คอนโดมิเนียม" },
                  { id: "TOWNHOME", label: "ทาวน์โฮม" },
                  { id: "HOUSE", label: "บ้านเดี่ยว" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPropertyFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                    propertyFilter === tab.id
                      ? "bg-[#1F1D1A] text-white shadow-xs"
                      : "bg-[#F3EFE6] text-[#5A554E] hover:bg-[#EAE4DA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-[#F3EFE6]">
            <span className="text-xs font-semibold text-[#7A7368] uppercase tracking-wider flex items-center gap-1.5 min-w-[120px]">
              <Palette className="w-3.5 h-3.5 text-[#C89D53]" />
              สไตล์ตกแต่ง:
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "ALL", label: "ทุกสไตล์" },
                  { id: "JAPANDI", label: "Minimal Japandi" },
                  { id: "LUXURY", label: "Modern Luxury" },
                  { id: "CLASSIC", label: "Contemporary Classic" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStyleFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                    styleFilter === tab.id
                      ? "bg-[#8F653B] text-white shadow-xs"
                      : "bg-[#F3EFE6] text-[#5A554E] hover:bg-[#EAE4DA]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE4DA] p-8">
            <p className="text-sm font-medium text-[#7A7368] mb-3">
              ไม่พบผลงานที่ตรงกับเงื่อนไขการค้นหานี้
            </p>
            <button
              type="button"
              onClick={() => {
                setPropertyFilter("ALL");
                setStyleFilter("ALL");
              }}
              className="text-xs font-semibold text-[#8F653B] hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EAE4DA] shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                {/* Image Container with strict Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE4DA]">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#1F1D1A]/80 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
                      {project.propertyLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#8F653B]/90 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
                      {project.styleLabel}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7368] mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8F653B]" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#1F1D1A] group-hover:text-[#8F653B] transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-[#5A554E] mt-2 line-clamp-2 leading-relaxed">
                      {project.highlight}
                    </p>
                  </div>

                  {/* 3 Real Meta Badges */}
                  <div className="pt-4 border-t border-[#F3EFE6] grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#FBF9F5] border border-[#EAE4DA]">
                      <span className="text-[10px] text-[#7A7368] block">
                        พื้นที่ใช้สอย
                      </span>
                      <span className="text-xs font-bold text-[#1F1D1A]">
                        {project.areaSqm} ตร.ม.
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FBF9F5] border border-[#EAE4DA]">
                      <span className="text-[10px] text-[#7A7368] block">
                        เวลาทำจริง
                      </span>
                      <span className="text-xs font-bold text-[#1F1D1A]">
                        {project.durationDays} วัน
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FBF9F5] border border-[#EAE4DA]">
                      <span className="text-[10px] text-[#7A7368] block">
                        งบจริง
                      </span>
                      <span className="text-xs font-bold text-[#8F653B]">
                        ฿{project.actualBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
