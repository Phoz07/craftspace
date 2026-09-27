import Link from "next/link";
import { MessageSquare, Phone, MapPin, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1F1D1A] text-[#E5DED3] pt-16 pb-12 border-t border-[#332F2A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#332F2A]">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#8F653B] flex items-center justify-center text-[#FBF9F5]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-lg tracking-wider text-[#FBF9F5]">
                CRAFTSPACE
              </span>
            </div>
            <p className="text-sm text-[#A8A196] leading-relaxed max-w-sm">
              สตูดิโอออกแบบตกแต่งภายในและงานเฟอร์นิเจอร์บิวท์อินพรีเมียม
              มุ่งเน้นการสร้างสรรค์พื้นที่พักผ่อนที่ลงตัวระหว่างฟังก์ชันใช้งานและความงามสไตล์
              Japandi & Modern Luxury
            </p>
            <p className="text-xs text-[#8F653B]">
              หมายเหตุ: การคำนวณราคาผ่านหน้าเว็บไซต์เป็นการประเมินงบประมาณเบื้องต้นจากสเปกมาตรฐาน
              ไม่ใช่ใบเสนอราคาผูกมัด (Official Quotation)
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#FBF9F5] tracking-wider uppercase">
              ติดต่อสตูดิโอ
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A8A196]">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C89D53]" />
                <span>LINE: @craftspace</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C89D53]" />
                <span>082-456-7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C89D53] shrink-0 mt-0.5" />
                <span>สุขุมวิท 55 (ทองหล่อ), กรุงเทพมหานคร</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#FBF9F5] tracking-wider uppercase">
              เวลาทำการ
            </h4>
            <p className="text-sm text-[#A8A196] leading-relaxed">
              จันทร์ - เสาร์: 09:00 - 18:00 น.
              <br />
              (นัดสำรวจหน้างานล่วงหน้า 1-2 วัน)
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="text-xs text-[#C89D53] hover:underline inline-flex items-center gap-1"
              >
                เข้าสู่ระบบฝ่ายขาย (Admin Portal) &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7368] gap-4">
          <p>© 2026 CraftSpace Studio Co., Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-[#A8A196] cursor-pointer">
              นโยบายความเป็นส่วนตัว (PDPA)
            </span>
            <span className="hover:text-[#A8A196] cursor-pointer">
              เงื่อนไขการประเมินราคา
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
