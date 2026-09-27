"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  calculateEstimate,
  type PropertyType,
  type DecorationZoneKey,
  type MaterialGradeKey,
} from "@/lib/pricing";
import {
  Sparkles,
  Calculator,
  ArrowRight,
  Home as HomeIcon,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [propertyType, setPropertyType] = useState<PropertyType>("CONDO");
  const [areaSqm, setAreaSqm] = useState<number>(35);
  const [selectedZones, setSelectedZones] = useState<DecorationZoneKey[]>([
    "LIVING",
    "BEDROOM",
  ]);
  const [materialGrade, setMaterialGrade] =
    useState<MaterialGradeKey>("PREMIUM");

  const estimate = calculateEstimate({
    propertyType,
    areaSqm,
    selectedZones,
    materialGrade,
  });

  const toggleZone = (zone: DecorationZoneKey) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Foundation Hero Intro */}
        <section className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] border border-[#E5DED3] text-xs font-medium text-[#8F653B]">
            <Sparkles className="w-3.5 h-3.5 text-[#C89D53]" />
            <span>Japandi & Modern Luxury Built-in Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1D1A] leading-tight">
            ประเมินงบประมาณบิวท์อิน
            <br />
            <span className="text-[#8F653B]">คอนโดและบ้านของคุณใน 1 นาที</span>
          </h1>
          <p className="text-base sm:text-lg text-[#5A554E] max-w-2xl mx-auto leading-relaxed">
            ระบบคำนวณราคาประเมินสดแบบแม่นยำด้วยสูตรปรับตัวแปรตามพื้นที่จริง
            (Decoupled Logistics & Scale Matrix) คัดกรองงบชัดเจนก่อนเริ่มงาน
          </p>
          <div className="pt-2">
            <a
              href="#pricing-playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F1D1A] text-[#FBF9F5] font-medium text-sm hover:bg-[#332F2A] transition-all shadow-sm"
            >
              <span>ทดลองคำนวณราคาสด</span>
              <ArrowRight className="w-4 h-4 text-[#C89D53]" />
            </a>
          </div>
        </section>

        {/* Foundational Pricing Playground */}
        <section
          id="pricing-playground"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE4DA] shadow-sm max-w-4xl mx-auto mb-16"
        >
          <div className="flex items-center justify-between pb-6 border-b border-[#EAE4DA] mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#8F653B] flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F1D1A]">
                  เครื่องคำนวณราคาประเมินจริง (Pricing Engine Tracer)
                </h2>
                <p className="text-xs text-[#7A7368]">
                  คำนวณตามสูตรคณิตศาสตร์ที่ผ่านการอนุมัติใน ADR 0002
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#EBF7EE] text-[#1E7E34] font-medium border border-[#C3E6CB]">
              Active v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7368] mb-2">
                  1. ประเภทอสังหาริมทรัพย์ ($M_{"{"}property{"}"}$)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "CONDO", label: "คอนโด (1.0)" },
                      { id: "TOWNHOME", label: "ทาวน์โฮม (1.1)" },
                      { id: "HOUSE", label: "บ้านเดี่ยว (1.2)" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                        propertyType === item.id
                          ? "bg-[#1F1D1A] text-white border-[#1F1D1A] shadow-sm"
                          : "bg-[#FBF9F5] text-[#5A554E] border-[#E5DED3] hover:border-[#8F653B]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#7A7368]">
                    2. ขนาดพื้นที่ใช้สอย ($F_{"{"}area{"}"}$)
                  </label>
                  <span className="text-sm font-bold text-[#8F653B]">
                    {areaSqm} ตร.ม. (x
                    {estimate.breakdown.areaScaleFactor.toFixed(2)})
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="1"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-[#A8A196] mt-1">
                  <span>20 ตร.ม.</span>
                  <span>80 ตร.ม.</span>
                  <span>150 ตร.ม.</span>
                  <span>250+ ตร.ม.</span>
                </div>
              </div>

              {/* Decoration Zones */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7368] mb-2">
                  3. โซนตกแต่งบิวท์อินหลัก (Multi-select)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "LIVING", label: "ห้องนั่งเล่น (฿45k)" },
                      { id: "BEDROOM", label: "ห้องนอนใหญ่ (฿55k)" },
                      { id: "KITCHEN", label: "เคาน์เตอร์ครัว (฿65k)" },
                      { id: "SYSTEM", label: "งานฝ้าซ่อนไฟ (฿25k)" },
                    ] as const
                  ).map((zone) => {
                    const isSelected = selectedZones.includes(zone.id);
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => toggleZone(zone.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-[#F3EFE6] border-[#8F653B] text-[#1F1D1A]"
                            : "bg-[#FBF9F5] border-[#E5DED3] text-[#7A7368]"
                        }`}
                      >
                        <span>{zone.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#8F653B]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Grade */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7368] mb-2">
                  4. เกรดวัสดุและฟิตติ้ง ($M_{"{"}grade{"}"}$)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "STANDARD", label: "Standard (1.0)" },
                      { id: "PREMIUM", label: "Premium (1.35)" },
                      { id: "LUXURY", label: "Luxury (1.8)" },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setMaterialGrade(g.id)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                        materialGrade === g.id
                          ? "bg-[#8F653B] text-white border-[#8F653B] shadow-sm"
                          : "bg-[#FBF9F5] text-[#5A554E] border-[#E5DED3]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Calculation Result Card */}
            <div className="bg-[#1F1D1A] rounded-2xl p-6 text-[#FBF9F5] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#A8A196] border-b border-[#332F2A] pb-3 mb-6">
                  <span>สถานะการประเมินราคา</span>
                  <span className="text-[#C89D53] font-medium">
                    {estimate.isZeroZone
                      ? "⚠️ ยังไม่เลือกโซน"
                      : estimate.isFloorPriceApplied
                      ? "🔒 ชน Floor Price ขั้นต่ำ"
                      : "✨ คำนวณปกติ"}
                  </span>
                </div>

                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#A8A196]">
                    งบประมาณประเมินเบื้องต้น (Min – Max)
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FBF9F5]">
                    {estimate.isZeroZone ? (
                      <span className="text-[#7A7368]">฿0</span>
                    ) : (
                      <span className="text-[#DFB978]">
                        ฿{estimate.estimatedMin.toLocaleString()} – ฿
                        {estimate.estimatedMax.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A8A196] leading-relaxed">
                    หมายเหตุ:
                    ตัวเลขนี้เป็นการประเมินงบประมาณเบื้องต้นจากสเปกมาตรฐาน
                    ไม่ใช่ใบเสนอราคาผูกมัด (Official Quotation)
                  </p>
                </div>

                {/* Calculation Matrix Breakdown */}
                <div className="bg-[#292622] rounded-xl p-4 text-xs space-y-2 border border-[#3D3730]">
                  <span className="font-semibold text-[#DFB978] block mb-2">
                    Math Engine Breakdown:
                  </span>
                  <div className="flex justify-between text-[#A8A196]">
                    <span>Base Zones Sum:</span>
                    <span className="font-mono text-[#FBF9F5]">
                      ฿{estimate.breakdown.baseZoneTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A8A196]">
                    <span>Property Multiplier ({propertyType}):</span>
                    <span className="font-mono text-[#FBF9F5]">
                      x{estimate.breakdown.propertyMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A8A196]">
                    <span>Area Scale Factor ({areaSqm} sqm):</span>
                    <span className="font-mono text-[#FBF9F5]">
                      x{estimate.breakdown.areaScaleFactor.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A8A196]">
                    <span>Grade Multiplier ({materialGrade}):</span>
                    <span className="font-mono text-[#FBF9F5]">
                      x{estimate.breakdown.gradeMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#3D3730] flex justify-between text-[#FBF9F5] font-medium">
                    <span>Raw Formula Output:</span>
                    <span className="font-mono">
                      ฿{estimate.rawEstimate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  disabled={estimate.isZeroZone}
                  className="w-full py-3 px-4 rounded-xl bg-[#C89D53] hover:bg-[#DFB978] text-[#1F1D1A] font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {estimate.isZeroZone
                    ? "กรุณาเลือกอย่างน้อย 1 โซนเพื่อคำนวณ"
                    : "บันทึกและส่งข้อมูลรับสิทธิ์สำรวจหน้างานฟรี"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
