"use client";

import { useState } from "react";
import {
  calculateEstimate,
  type PropertyType,
  type DecorationZoneKey,
  type MaterialGradeKey,
  type EstimateResult,
} from "@/lib/pricing";
import { AnimatedPrice } from "./AnimatedPrice";
import {
  Building2,
  Home as HomeIcon,
  Castle,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Shield,
  Layers,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Gem,
} from "lucide-react";

export interface EstimatorState {
  propertyType: PropertyType;
  areaSqm: number;
  selectedZones: DecorationZoneKey[];
  materialGrade: MaterialGradeKey;
  estimate: EstimateResult;
}

interface EstimatorWizardProps {
  onProceedToLeadCapture?: (state: EstimatorState) => void;
}

export function EstimatorWizard({
  onProceedToLeadCapture,
}: EstimatorWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
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

  const steps = [
    { num: 1, title: "ประเภทอสังหาฯ" },
    { num: 2, title: "ขนาดพื้นที่" },
    { num: 3, title: "โซนตกแต่ง" },
    { num: 4, title: "เกรดวัสดุ" },
  ];

  const handleNext = () => {
    if (currentStep === 3 && selectedZones.length === 0) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (onProceedToLeadCapture) {
        onProceedToLeadCapture({
          propertyType,
          areaSqm,
          selectedZones,
          materialGrade,
          estimate,
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      id="estimator"
      className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE4DA] shadow-xl max-w-4xl mx-auto my-12"
    >
      {/* Wizard Header & Progress */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE4DA] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#8F653B] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F1D1A]">
                ประเมินงบประมาณบิวท์อินสด (Cost Estimator)
              </h2>
              <p className="text-xs text-[#7A7368]">
                คำนวณราคาแม่นยำตามสเปกจริงจบใน 4 ขั้นตอนสั้นๆ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8F653B] font-medium bg-[#F3EFE6] px-3 py-1.5 rounded-full w-fit">
            <span>ขั้นตอนที่ {currentStep} จาก 4</span>
          </div>
        </div>

        {/* Progress Bar with Step Titles */}
        <div className="grid grid-cols-4 gap-2 pt-6">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div key={step.num} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isDone || isCurrent ? "bg-[#8F653B]" : "bg-[#EAE4DA]"
                  }`}
                />
                <span
                  className={`text-[11px] block truncate font-medium ${
                    isCurrent
                      ? "text-[#8F653B] font-bold"
                      : isDone
                      ? "text-[#1F1D1A]"
                      : "text-[#A8A196]"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Body & Live Price Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Step Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Property Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F1D1A]">
                  ขั้นตอนที่ 1: เลือกประเภทอสังหาริมทรัพย์ของคุณ
                </h3>
                <p className="text-xs text-[#7A7368]">
                  ประเภทที่อยู่อาศัยมีผลต่อการขนส่งแนวดิ่งและความสูงเพดานของโครงสร้าง
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "CONDO",
                    title: "คอนโดมิเนียม (Condominium)",
                    desc: "ความสูงเพดานมาตรฐาน 2.4 - 2.6 ม. ขนส่งผ่านลิฟต์โดยสาร/ลิฟต์บริการ",
                    multiplier: "x1.00",
                    icon: Building2,
                  },
                  {
                    id: "TOWNHOME",
                    title: "ทาวน์โฮม (Townhome)",
                    desc: "อาคาร 2-4 ชั้น เพดาน 2.6 - 2.8 ม. งานขนย้ายผ่านโถงบันไดและที่จอดรถจำกัด",
                    multiplier: "x1.10",
                    icon: HomeIcon,
                  },
                  {
                    id: "HOUSE",
                    title: "บ้านเดี่ยว (Single-detached House)",
                    desc: "เพดานสูงโปร่ง 2.8 - 3.2 ม. งาน Double Volume และโครงสร้างบิวท์อินแนวตั้งขนาดใหญ่",
                    multiplier: "x1.20",
                    icon: Castle,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = propertyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id as PropertyType)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                        isSelected
                          ? "bg-[#F3EFE6] border-[#8F653B] shadow-sm ring-1 ring-[#8F653B]"
                          : "bg-white border-[#EAE4DA] hover:border-[#C89D53] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#8F653B] text-white"
                            : "bg-[#F3EFE6] text-[#8F653B]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#1F1D1A]">
                            {item.title}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/80 text-[#8F653B] border border-[#E5DED3]">
                            {item.multiplier}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A7368] mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Usable Area Size */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1F1D1A]">
                  ขั้นตอนที่ 2: ระบุขนาดพื้นที่ใช้สอย (ตารางเมตร)
                </h3>
                <p className="text-xs text-[#7A7368]">
                  เลื่อนแถบสไลเดอร์หรือพิมพ์ตัวเลขขนาดห้องของคุณโดยประมาณ
                </p>
              </div>

              {/* Area Display & Number Input */}
              <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#EAE4DA] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7368]">
                    ขนาดพื้นที่คำนวณ:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={20}
                      max={350}
                      value={areaSqm}
                      onChange={(e) =>
                        setAreaSqm(
                          Math.max(20, Math.min(350, Number(e.target.value) || 20))
                        )
                      }
                      className="w-20 px-3 py-1.5 text-right font-bold text-base bg-white rounded-lg border border-[#E5DED3] text-[#1F1D1A] focus:outline-none focus:ring-2 focus:ring-[#8F653B]"
                    />
                    <span className="text-sm font-semibold text-[#1F1D1A]">
                      ตร.ม.
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="1"
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(Number(e.target.value))}
                  className="w-full"
                />

                <div className="flex justify-between text-[11px] text-[#A8A196]">
                  <span>20 ตร.ม. (Studio)</span>
                  <span>45 ตร.ม. (1-Bed)</span>
                  <span>80 ตร.ม. (2-Bed)</span>
                  <span>250+ ตร.ม. (House)</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#7A7368]">
                  ขนาดยอดนิยม:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "คอนโดสตูดิโอ (28 ตร.ม.)", val: 28 },
                    { label: "คอนโด 1 ห้องนอน (35 ตร.ม.)", val: 35 },
                    { label: "คอนโด 2 ห้องนอน (55 ตร.ม.)", val: 55 },
                    { label: "ทาวน์โฮม (75 ตร.ม.)", val: 75 },
                    { label: "บ้านเดี่ยว (160 ตร.ม.)", val: 160 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setAreaSqm(preset.val)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        areaSqm === preset.val
                          ? "bg-[#1F1D1A] text-white border-[#1F1D1A]"
                          : "bg-white text-[#5A554E] border-[#EAE4DA] hover:bg-[#F3EFE6]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Decoration Zones (Multi-Select) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F1D1A]">
                  ขั้นตอนที่ 3: เลือกโซนที่ต้องการตกแต่งบิวท์อิน
                </h3>
                <p className="text-xs text-[#7A7368]">
                  เลือกได้หลายโซนพร้อมกันตามความต้องการของคุณ
                </p>
              </div>

              {/* Informative Microcopy Badge */}
              <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#E5DED3] flex items-start gap-2.5 text-xs text-[#5A554E] leading-relaxed">
                <Info className="w-4 h-4 text-[#8F653B] shrink-0 mt-0.5" />
                <span>
                  💡 <strong>ราคาประเมินนี้ครอบคลุมการบิวท์อิน 1 โซนหลักต่อประเภท</strong> (เช่น 1 ห้องนอนใหญ่, 1 ห้องนั่งเล่นหลัก) หากต้องการเพิ่มห้องนอนเล็กหรือโซนอื่นๆ สตูดิโอจะจัดสเปกและส่วนลดพิเศษเพิ่มเติมให้ในขั้นตอนสรุปแบบ
                </span>
              </div>

              {/* Zero-zone Guard Alert */}
              {selectedZones.length === 0 && (
                <div className="p-3 rounded-xl bg-[#FFF3CD] border border-[#FFEEBA] flex items-center gap-2 text-xs text-[#856404]">
                  <AlertCircle className="w-4 h-4 text-[#856404] shrink-0" />
                  <span>กรุณาเลือกอย่างน้อย 1 โซนเพื่อดูราคาประเมินและไปต่อ</span>
                </div>
              )}

              {/* Zone Checkbox Cards */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "LIVING",
                    name: "ห้องนั่งเล่น & โซนพักผ่อนหลัก (Main Living Area)",
                    items: "ผนังทีวีเซาะร่องซ่อนไฟ, ตู้โชว์กระจก, ตู้เก็บรองเท้ากั้นโซน",
                    base: "฿45,000",
                  },
                  {
                    id: "BEDROOM",
                    name: "ห้องนอนใหญ่ (Master Bedroom)",
                    items: "ตู้เสื้อผ้า Full-height ถึงฝ้า, ผนังหัวเตียงบุผ้า/ไม้, โต๊ะเครื่องแป้ง",
                    base: "฿55,000",
                  },
                  {
                    id: "KITCHEN",
                    name: "ห้องครัว (Kitchen & Pantry)",
                    items: "เคาน์เตอร์ครัวล่าง, ตู้ลอยแขวนผนัง, ท็อปหินสังเคราะห์กันรอย",
                    base: "฿65,000",
                  },
                  {
                    id: "SYSTEM",
                    name: "งานระบบ & ตกแต่งเพิ่มเติม (System & Ceiling)",
                    items: "ฝ้าหลุมซ่อนไฟ Linear LED, ผ้าม่านลอน 2 ชั้น, วอลเปเปอร์ผิวสัมผัส",
                    base: "฿25,000",
                  },
                ].map((zone) => {
                  const isChecked = selectedZones.includes(
                    zone.id as DecorationZoneKey
                  );
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => toggleZone(zone.id as DecorationZoneKey)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? "bg-[#F3EFE6] border-[#8F653B] shadow-xs"
                          : "bg-white border-[#EAE4DA] hover:border-[#C89D53] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
                            isChecked
                              ? "bg-[#8F653B] border-[#8F653B] text-white"
                              : "border-[#A8A196] bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1F1D1A]">
                            {zone.name}
                          </div>
                          <p className="text-xs text-[#7A7368] mt-0.5">
                            {zone.items}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#8F653B] font-semibold shrink-0">
                        {zone.base}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Material Grade */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1F1D1A]">
                  ขั้นตอนที่ 4: เกรดวัสดุและอุปกรณ์ฟิตติ้ง (Material Grade)
                </h3>
                <p className="text-xs text-[#7A7368]">
                  เลือกมาตรฐานวัสดุและอุปกรณ์บานพับรางลิ้นชักที่เหมาะกับคุณ
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  {
                    id: "STANDARD",
                    title: "Standard Grade",
                    multiplier: "x1.00",
                    badge: "คุ้มค่าเริ่มต้น",
                    desc: "ไม้ปาร์ติเกิลและ MDF เคลือบผิวเมลามีนกันรอย, อุปกรณ์บานพับและรางลิ้นชัก Soft-close มาตรฐานอุตสาหกรรม",
                  },
                  {
                    id: "PREMIUM",
                    title: "Premium Grade",
                    multiplier: "x1.35",
                    badge: "แนะนำยอดนิยม ⭐",
                    desc: "ไม้กันชื้น HMR สีเขียวทนความชื้นสูง ปิดผิวลามิเนตนำเข้ายุโรป, อุปกรณ์ฟิตติ้งเยอรมันแท้ (Hafele / Blum)",
                  },
                  {
                    id: "LUXURY",
                    title: "Luxury Grade",
                    multiplier: "x1.80",
                    badge: "ระดับไฮเอนด์",
                    desc: "โครง HMR พ่นสีไฮกลอส เดินคิ้วสแตนเลสสีทองแฮร์ไลน์, บานตู้กระจกชาทองกรอบอลูมิเนียมบางเฉียบ และท็อปหินควอทซ์เกรดพรีเมียม",
                  },
                ].map((grade) => {
                  const isSelected = materialGrade === grade.id;
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      onClick={() =>
                        setMaterialGrade(grade.id as MaterialGradeKey)
                      }
                      className={`w-full p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? "bg-[#F3EFE6] border-[#8F653B] ring-1 ring-[#8F653B] shadow-sm"
                          : "bg-white border-[#EAE4DA] hover:border-[#C89D53] hover:bg-[#FBF9F5]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1F1D1A]">
                            {grade.title}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              grade.id === "PREMIUM"
                                ? "bg-[#8F653B] text-white"
                                : "bg-[#EAE4DA] text-[#5A554E]"
                            }`}
                          >
                            {grade.badge}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8F653B]">
                          {grade.multiplier}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A7368] leading-relaxed">
                        {grade.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAE4DA]">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A554E] hover:text-[#1F1D1A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 3 && selectedZones.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1F1D1A] hover:bg-[#332F2A] text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span>{currentStep === 4 ? "รับสลิปสรุปราคา & นัดสำรวจฟรี" : "ขั้นตอนถัดไป"}</span>
              <ChevronRight className="w-4 h-4 text-[#C89D53]" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Sticky Price Calculation Box (5 cols) */}
        <div className="lg:col-span-5 bg-[#1F1D1A] rounded-2xl p-6 text-[#FBF9F5] shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#332F2A] pb-3 text-xs text-[#A8A196]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C89D53]" />
                Live Estimated Price
              </span>
              <span className="text-[#C89D53] font-mono font-medium">
                {estimate.isZeroZone
                  ? "รอเลือกโซน"
                  : estimate.isFloorPriceApplied
                  ? "Floor Price ฿120k"
                  : "คำนวณเรียลไทม์"}
              </span>
            </div>

            {/* Price Range Display with Live Ticking Animation */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#A8A196]">
                ช่วงงบประมาณประเมิน (Min – Max)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#DFB978] tracking-tight">
                {estimate.isZeroZone ? (
                  <span className="text-[#7A7368]">฿0</span>
                ) : (
                  <div className="flex items-baseline flex-wrap gap-1">
                    <AnimatedPrice value={estimate.estimatedMin} />
                    <span className="text-lg text-[#A8A196] font-normal mx-1">
                      –
                    </span>
                    <AnimatedPrice value={estimate.estimatedMax} />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#A8A196] leading-relaxed pt-1">
                หมายเหตุ: ตัวเลขนี้เป็นการประเมินงบประมาณเบื้องต้นจากสเปกมาตรฐาน ไม่ใช่ใบเสนอราคาผูกมัด (Official Quotation) ราคาจริงอาจปรับเปลี่ยนตามสภาพพื้นที่จริงและฟังก์ชันเฉพาะบุคคล
              </p>
            </div>

            {/* Spec Snapshot */}
            <div className="bg-[#292622] rounded-xl p-3.5 border border-[#3D3730] space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-[#DFB978] block">
                สเปกที่เลือกขณะนี้:
              </span>
              <div className="flex justify-between text-[#A8A196]">
                <span>อสังหาฯ:</span>
                <span className="text-[#FBF9F5] font-medium">
                  {propertyType === "CONDO"
                    ? "คอนโดมิเนียม"
                    : propertyType === "TOWNHOME"
                    ? "ทาวน์โฮม"
                    : "บ้านเดี่ยว"}
                </span>
              </div>
              <div className="flex justify-between text-[#A8A196]">
                <span>พื้นที่:</span>
                <span className="text-[#FBF9F5] font-medium">{areaSqm} ตร.ม.</span>
              </div>
              <div className="flex justify-between text-[#A8A196]">
                <span>โซนบิวท์อิน:</span>
                <span className="text-[#FBF9F5] font-medium">
                  {selectedZones.length} โซน
                </span>
              </div>
              <div className="flex justify-between text-[#A8A196]">
                <span>เกรดวัสดุ:</span>
                <span className="text-[#FBF9F5] font-medium">{materialGrade}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={estimate.isZeroZone}
              onClick={handleNext}
              className="w-full py-3.5 px-4 rounded-xl bg-[#C89D53] hover:bg-[#DFB978] text-[#1F1D1A] font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              {estimate.isZeroZone
                ? "กรุณาเลือกอย่างน้อย 1 โซน"
                : currentStep < 4
                ? "ไปขั้นตอนถัดไป & สรุปราคา"
                : "รับสลิปสรุปราคา & นัดสำรวจฟรี"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
