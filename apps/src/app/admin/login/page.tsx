"use client";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("กรุณากรอกรหัสผ่านสตูดิโอ");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || "รหัสผ่านไม่ถูกต้อง");
        return;
      }

      // Hard redirect to load admin page with validated cookie
      window.location.href = "/admin";
    } catch (err) {
      console.error("Login failed:", err);
      setError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#FBF9F5] selection:bg-[#DFB978] selection:text-[#1F1D1A]">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A7368] hover:text-[#1F1D1A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าหลัก CraftSpace</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#EAE4DA] overflow-hidden">
          {/* Header */}
          <div className="bg-[#1F1D1A] text-[#FBF9F5] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-[#DFB978]/10 rounded-full blur-xl pointer-events-none" />

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#292622] text-[#DFB978] mb-3 border border-[#3D3730]">
              <Shield className="w-6 h-6" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              CRAFTSPACE ADMIN
            </h1>
            <p className="text-xs text-[#A8A196] mt-1 tracking-wider uppercase">
              Studio Sales Pipeline Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F1D1A]">
                รหัสผ่านสำหรับทีมงาน (Studio Passcode)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7368]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="กรอกรหัสผ่านสตูดิโอ"
                  autoFocus
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-[#EAE4DA] bg-[#FBF9F5] text-[#1F1D1A] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8F653B] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A7368] hover:text-[#1F1D1A]"
                  tabIndex={-1}
                >
                  {showPasscode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#7A7368]">
                Default:{" "}
                <code className="bg-[#F3EFE6] px-1 py-0.5 rounded font-mono text-[10px]">
                  craftspace2026
                </code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#8F653B] hover:bg-[#724E2B] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </>
              ) : (
                <span>เข้าสู่ระบบ Pipeline</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-[#A8A196]">
                ระบบรักษาความปลอดภัยภายในสตูดิโอ CraftSpace
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
