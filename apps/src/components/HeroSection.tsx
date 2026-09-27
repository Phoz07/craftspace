import {
  ArrowRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Subtle Japandi Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#F3EFE6]/60 via-[#FBF9F5]/30 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Badges & Headings */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3EFE6] border border-[#E5DED3] text-xs font-semibold text-[#8F653B] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C89D53]" />
            <span>พรีเมียมบิวท์อินสไตล์ Minimal Japandi & Modern Luxury</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F1D1A] leading-[1.15]">
            เปลี่ยนห้องเปล่าให้เป็น
            <br />
            <span className="text-[#8F653B]">พื้นที่พักผ่อนในฝันของคุณ</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A554E] max-w-2xl mx-auto leading-relaxed font-normal">
            หมดปัญหาผู้รับเหมาทิ้งงานหรืองบบานปลายด้วยระบบคำนวณราคาประเมินสด ชัดเจนโปร่งใส
            จบงานตรงเวลา พร้อมรับสิทธิสำรวจและวัดพื้นที่หน้างานจริงฟรี
          </p>

          {/* Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#estimator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1F1D1A] hover:bg-[#332F2A] text-[#FBF9F5] font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <span>ประเมินราคาห้องคุณใน 1 นาที</span>
              <ArrowRight className="w-4 h-4 text-[#C89D53]" />
            </a>
            <a
              href="#portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white hover:bg-[#F3EFE6] text-[#5A554E] hover:text-[#1F1D1A] font-semibold text-sm border border-[#EAE4DA] transition-all"
            >
              ชมผลงานจริง 6 โครงการ
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A7368]">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-[#C89D53] text-[#C89D53]" />
              <span className="font-semibold text-[#1F1D1A]">4.9/5</span>
              <span>(รีวิวจากลูกค้ากว่า 180+ ยูนิต)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8F653B]" />
              <span>รับประกันโครงสร้างและฟิตติ้ง 3 ปี</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8F653B]" />
              <span>ผลิตติดตั้งเสร็จตรงเวลา 100%</span>
            </div>
          </div>
        </div>

        {/* Interactive Before & After Showcase Box */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#DFB978]/20 via-[#8F653B]/20 to-[#DFB978]/20 rounded-3xl sm:rounded-4xl blur-xl opacity-50 -z-10" />

          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
            afterImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
            beforeLabel="BEFORE: ห้องเปล่าคอนโดก่อนทำ"
            afterLabel="AFTER: บิวท์อิน Japandi ไม้โอ๊คซ่อนไฟ"
            aspectRatioClass="aspect-[16/10] sm:aspect-[16/9]"
          />

          {/* Caption underneath the slider */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7368] px-2 gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#1E7E34]" />
              <span>
                โครงการ Life Ladprao Valley • คอนโด 35 ตร.ม. • งบจริง ฿320,000
              </span>
            </span>
            <span className="italic text-[#8F653B]">
              *ภาพถ่ายจากผลงานการตกแต่งส่งมอบจริงของ CraftSpace
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
