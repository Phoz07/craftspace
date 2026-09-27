import Link from "next/link";
import { Sparkles, Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE4DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#1F1D1A] flex items-center justify-center text-[#DFB978] shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-wider text-[#1F1D1A]">
              CRAFTSPACE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#8F653B] font-medium -mt-1">
              Interior & Built-in Studio
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <a
            href="#portfolio"
            className="hidden md:inline-block text-sm font-medium text-[#5A554E] hover:text-[#1F1D1A] transition-colors"
          >
            ผลงานที่ผ่านมา
          </a>
          <a
            href="#estimator"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#8F653B] hover:bg-[#724E2B] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DFB978]" />
            <span>เริ่มประเมินราคา</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
